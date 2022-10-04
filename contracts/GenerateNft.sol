// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import './libraries/JsmnLib.sol';
import './libraries/CommonUtilLib.sol';
import 'hardhat/console.sol';

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';

contract GenerateNft {
  struct Attributes {
    string trait_type;
    string trait_name;
  }

  struct TokenImage {
    string image;
    string attributes;
    string name;
    string description;
  }
  
  struct Asset {
    string name;
    uint256 index;
  }

  mapping(string => string[]) private _assets;
  string[] private _nameAssets;

  mapping(uint256 => TokenImage) private _tokenImages;

  string private _ipfsGateway;
  string private _ipfsHash;

  uint256 private _tokenSizer = 0;

  constructor(string memory ipfsGateway, string memory ipfsHash, string memory assetsJson, uint256 numElements) {
    _ipfsGateway = ipfsGateway;
    _ipfsHash = ipfsHash;
    _saveData(assetsJson, numElements);
  }

  function getCountTokens() external view returns(uint256) {
    return _tokenSizer;
  }

  function getDataUri(uint256 tokenId) external view returns(string memory tokenImage) {
    TokenImage memory image = _tokenImages[tokenId];

    tokenImage = Base64.encode(abi.encodePacked(
      '{',
      '"name":',
      '"',
      image.name,
      '",',
      '"description":',
      '"',
      image.description,
      '",',
      '"attributes":',
      image.attributes,
      ',',
      '"image":',
      '"',
      image.image,
      '"',
      '}'
    ));
  }

  function getNames() external view returns(string[] memory) {
    return _nameAssets;
  }

  function _getImageStack(string[] memory traits) internal pure returns(string memory image){
    for (uint256 index = 0; index < traits.length; index++) {
      image = string(
      abi.encodePacked(image, 
        '<image x="50%" y="50%" width="1000" href="',
        traits[index],
        '" style="transform: translate(-500px, -500px)" />'
      )
    );
    } 
  }

  function _generateAttributes(Attributes[] memory _attr) internal pure returns(string memory attr) {
    for (uint256 index = 0; index < _attr.length; index++) {
      attr = string(abi.encodePacked(
        attr,
        '{',
        '"trait_type":',
        '"',
        _attr[index].trait_type,
        '",',
        '"trait_name":',
        '"',
        _attr[index].trait_name,
        '"',
        '}',
        index+1 == _attr.length ? '' : ','
      ));
    }
  }

  function generateImage() external {
    string[] memory traits = new string[](_nameAssets.length);
    Attributes[] memory attr = new Attributes[](_nameAssets.length);
    for (uint256 index = 0; index < _nameAssets.length; index++) {
      string[] memory assets = _assets[_nameAssets[index]];
      unchecked {
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _tokenSizer))) % assets.length;
        traits[index] = string(abi.encodePacked(_ipfsGateway, _ipfsHash,'/',_nameAssets[index],'/',Strings.toString(rand)));
        attr[index] = Attributes(_nameAssets[index], assets[rand]);
      }
     }

    string memory attributes = string(abi.encodePacked(
      '[',
        _generateAttributes(attr),
      ']'
    ));

    string memory image = Base64.encode(abi.encodePacked(
        '<svg id="token" width="1000" height="1000" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="placeholder">',
        _getImageStack(traits),
        '</g></svg>'
    ));

    _tokenImages[_tokenSizer + 1] = TokenImage(image, attributes, 'name', 'description');
    _tokenSizer  = _tokenSizer + 1;
  }

  function _saveData(string memory _json, uint256 _elements) internal {
    JsmnLib.Token[] memory tokens;
   
    uint256 len;
    (, tokens, len) = JsmnLib.parse(_json, _elements);
   
    for (uint256 index = 1; index < len; index++) {

      if (tokens[index].jsmnType == JsmnLib.JsmnType.ARRAY) {
        string memory name = JsmnLib.getBytes(_json, tokens[index-1].start, tokens[index-1].end);
        _nameAssets.push(name);
        _assets[name] = new string[](tokens[index].size + 1);
        for (uint256 i = 1; i < tokens[index].size + 1; i++) {
          string memory traitName = JsmnLib.getBytes(_json, tokens[index+i].start, tokens[index+i].end);
          _assets[name][i] = traitName;
          }
        }
     }
  }
}