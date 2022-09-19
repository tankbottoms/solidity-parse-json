// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import './libraries/JsmnLib.sol';
import './libraries/CommonUtilLib.sol';

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';

contract GenerateNft {
  
  struct TokenImage {
    string image;
  }
  
  struct Asset {
    uint256 cardinality;
    uint256 offset;
    uint256 mask;
  }

  mapping(uint256 => Asset) private _assets;
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

  function getDataUri(uint256 tokenId) external view returns(TokenImage memory tokenImage) {
    tokenImage = _tokenImages[tokenId];
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

  function generateImage() external {
    string[] memory traits = new string[](_nameAssets.length + 1);
    
    for (uint256 index = 1; index < _nameAssets.length + 1; index++) {
        Asset memory asset = _assets[index];
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _tokenSizer))) % asset.cardinality;
        traits[index] = string(abi.encodePacked(_ipfsGateway, _ipfsHash,'/',_nameAssets[index - 1],'/',Strings.toString(rand)));
    }

    string memory image = Base64.encode(abi.encodePacked(
        '<svg id="token" width="1000" height="1000" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="placeholder">',
        _getImageStack(traits),
        '</g></svg>'
    ));

  _tokenImages[_tokenSizer + 1] = TokenImage(image);
  _tokenSizer  = _tokenSizer + 1;
  }

  function _saveData(string memory _json, uint256 _elements) internal {
    JsmnLib.Token[] memory tokens;
    (, tokens, ) = JsmnLib.parse(_json, _elements);
    uint256 counter = 1;
    for (uint256 i = 1; i < tokens.length; i=i+5) {
      string memory key = JsmnLib.getBytes(_json, tokens[i].start, tokens[i].end);
      if (bytes(key).length > 0) {
        _nameAssets.push(key);        
      }
      if (i + 1 < tokens.length) {
        string memory value = JsmnLib.getBytes(_json, tokens[i+1].start, tokens[i+1].end);    
        uint256 cardinality;
        uint256 offset;
        uint256 mask;
        (cardinality, offset, mask) = CommonUtilLib.getPrimitive(value,4);
        _assets[counter] = Asset(cardinality, offset, mask);
      }
      counter++;
    }
  }
}