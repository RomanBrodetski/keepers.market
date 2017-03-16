pragma solidity ^0.4.8;


import "./token/StandardToken.sol";

contract EthToken is StandardToken {

  string public name = "Eth";
  string public symbol = "ETH";
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 10000;
  address public owner;

  function EthToken() {
    owner = msg.sender;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
