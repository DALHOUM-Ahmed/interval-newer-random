// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title newerRandom
 * @dev Each time get new random in interval
 */
contract newerRandom {
  uint256 immutable _inclusiveLowerBorder;
  uint256 immutable _inclusiveUpperBorder;
  mapping(uint256 => uint256) recorded;
  uint256 nextIndex;
  uint256 public lastGeneratedNumber;

  constructor(uint256 inclusiveLowerBorder_, uint256 inclusiveUpperBorder_) {
    _inclusiveLowerBorder = inclusiveLowerBorder_;
    _inclusiveUpperBorder = inclusiveUpperBorder_;
    nextIndex = inclusiveLowerBorder_;
  }

  function getNextRandom() public returns (uint256 _randomNumber) {
    require(nextIndex <= _inclusiveUpperBorder, "Used every index");
    if (nextIndex < _inclusiveUpperBorder) {
      uint256 rand = (uint256(
        keccak256(
          abi.encodePacked(
            block.timestamp,
            blockhash(block.number - 1),
            msg.sender,
            nextIndex
          )
        )
      ) % (_inclusiveUpperBorder - nextIndex + 1)) + nextIndex;
      _randomNumber = recorded[rand] > 0 ? recorded[rand] : rand;
      recorded[rand] = recorded[nextIndex] > 0
        ? recorded[nextIndex]
        : nextIndex;
      nextIndex++;
    } else {
      _randomNumber = recorded[nextIndex] > 0 ? recorded[nextIndex] : nextIndex;
      nextIndex++;
    }
    lastGeneratedNumber = _randomNumber;
  }
}
