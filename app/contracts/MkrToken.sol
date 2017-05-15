pragma solidity ^0.4.8;


import "./token/StandardToken.sol";

contract MkrToken is StandardToken {

  string public name = "Maker";
  string public symbol = "MKR";
  uint public decimals = 12;
  uint public INITIAL_SUPPLY = 1000000000000000;
  address public owner;

  function EthToken() {
    owner = msg.sender;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
