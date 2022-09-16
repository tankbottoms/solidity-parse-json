// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import '@openzeppelin/contracts/utils/Strings.sol';

library GatewayUtilLib {

  function generateSeed(
    address _account,
    uint256 _blockNumber,
    uint256 _other
  ) public pure returns (uint256 seed) {
    seed = uint256(keccak256(abi.encodePacked(_account, _blockNumber, _other)));
  }
   /**
    @notice Constructs and svg image tag by appending the parameters.
    @param _ipfsGateway HTTP IPFS gateway. The url must contain the trailing slash.
    @param _ipfsRoot IPFS path, must contain tailing slash.
    @param _imageIndex Image index that will be converted to string and used as a filename.
    */
  function _imageTag(
    string memory _ipfsGateway,
    string memory _ipfsRoot,
    uint256 _imageIndex
  ) private pure returns (string memory tag) {
    tag = string(
      abi.encodePacked(
        '<image x="50%" y="50%" width="1000" href="',
        _ipfsGateway,
        _ipfsRoot,
        Strings.toString(_imageIndex),
        '" style="transform: translate(-500px, -500px)" />'
      )
    );
  }
}