pragma solidity ^0.4.8;


import "./token/StandardToken.sol";

contract XbtToken is StandardToken {

  string public name = "Xbt";
  string public symbol = "XBT";
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 10000;

  function XbtToken() {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
