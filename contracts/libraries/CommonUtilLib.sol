// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import './JsmnLib.sol';

library CommonUtilLib {
  function getPrimitive(string memory asset, uint256 num) internal pure returns (uint256 n1, uint256 n2, uint256 n3) {
    JsmnLib.Token[] memory _tokens;
    (, _tokens, ) = JsmnLib.parse(asset, num);
    n1 = uint256(JsmnLib.parseInt(JsmnLib.getBytes(asset, _tokens[1].start, _tokens[1].end)));
    n2 = uint256(JsmnLib.parseInt(JsmnLib.getBytes(asset, _tokens[2].start, _tokens[2].end)));
    n3 = uint256(JsmnLib.parseInt(JsmnLib.getBytes(asset, _tokens[3].start, _tokens[3].end)));
  }
}