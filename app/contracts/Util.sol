pragma solidity ^0.4.8;

// check if they should be marked internal

library Util {
  function max(uint a, uint b) returns (uint) {
    if (a > b) return a;
    else return b;
  }
  function min(uint a, uint b) returns (uint) {
    if (a < b) return a;
    else return b;
  }
  function assert(bool x) {
      if (!x) throw;
  }
}
