pragma solidity ^0.4.8;

import './token/ERC20.sol';
import "./Util.sol";
import "./EventfulMarket.sol";

contract SimpleMarket is EventfulMarket  {
  event Log(
      string message,
      uint value
  );

  struct Order { //move to a library
    uint     supply_amount;
    ERC20    supply_token;
    uint     demand_amount;
    ERC20    demand_token;
    address  owner;
    bool     active;
  }

  mapping (uint => Order) public orders;

  uint public last_order_id;


  function getOrderAtId(uint index) public constant returns(uint, ERC20, uint, ERC20) {
      return (orders[index].supply_amount, orders[index].supply_token, orders[index].demand_amount, orders[index].demand_token);
  }

  function next_id() internal returns (uint) {
      last_order_id++; return last_order_id;
  }

  // function simpleMethod() public constant returns(uint) {
  //   return 1222254;
  // }

  function createOrder( uint  supply_amount,
                        ERC20 supply_token,
                        uint  demand_amount,
                        ERC20 demand_token) {
    createOrderOnBehalf(msg.sender, supply_amount, supply_token, demand_amount, demand_token);
  }

  function createOrderOnBehalf(
                        address owner,
                        uint  supply_amount,
                        ERC20 supply_token,
                        uint  demand_amount,
                        ERC20 demand_token) internal {
    Order memory order = Order(
      supply_amount,
      supply_token,
      demand_amount,
      demand_token,
      owner,
      true);
    uint id = next_id();

    // supply_token.transferFrom(owner, this, supply_amount);

    orders[id] = order;

  }

  function cancelOrder(uint id) {
    Util.assert(orders[id].owner == msg.sender);
    //give user money back
    deleteOrderInternal(id);
  }

  function deleteOrderInternal(uint id) internal {
    Order order = orders[id];
    delete orders[id];
    // LogKill(id, sha3(order.supply_token, order.demand_token), order.author, )
  }

  function mutualOrderTrade(uint olderOrderId, uint newerOrderId) {
    Order oldOrder = orders[olderOrderId];
    Order newOrder = orders[newerOrderId];

    Util.assert(oldOrder.demand_token == newOrder.supply_token);
    Util.assert(newOrder.demand_token == oldOrder.supply_token);
    Util.assert(oldOrder.demand_amount / oldOrder.supply_amount <= newOrder.supply_amount / newOrder.demand_amount); // price matches
    Util.assert(olderOrderId < newerOrderId);

    uint buying_amount  = Util.min(oldOrder.supply_amount, newOrder.demand_amount);         // ETH 10
    uint selling_amount = oldOrder.demand_amount * (buying_amount / oldOrder.supply_amount); // BTC 1

    Log("buying_amount", buying_amount);
    Log("selling_amount", selling_amount);

    oldOrder.demand_token.transfer(oldOrder.owner, selling_amount);
    newOrder.demand_token.transfer(newOrder.owner, buying_amount);

    handleOrderDepletion(olderOrderId, buying_amount, selling_amount);
    handleOrderDepletion(newerOrderId, selling_amount, buying_amount);
  }

  function handleOrderDepletion(uint orderId, uint boughtFromThisOrder, uint soldToThisOrder) {
    Log("handling order depletion ", orderId);
    Order order = orders[orderId];
    Util.assert(boughtFromThisOrder <= order.supply_amount);
    Util.assert(soldToThisOrder <= order.demand_amount);

    if (order.demand_amount > soldToThisOrder) {
      createOrderOnBehalf(order.owner, order.supply_amount - boughtFromThisOrder, order.supply_token, order.demand_amount - soldToThisOrder, order.demand_token);
    }

    if (order.supply_amount > boughtFromThisOrder) {
      order.supply_token.transfer(order.owner, order.supply_amount - boughtFromThisOrder);
    }


  }
}


    //old: sell 10 ETH, buy 1 BTC
    //new: sell 3 BTC, buy 50 ETH  - no match

    //old: sell 15 ETH, buy 2 BTC
    //new: sell 2 BTC, buy 12 ETH

    //buying amount  = 12
    //selling amount = 2 * (12 / 15) = 1.6

    //old: give 10 ETH, take 1 BTC - using his price                // price: 10 ETH/BTC OR 0.1
    //new: give 5 BTC, take 45 ETH - PRIO, use the opposite price   // price: 9  ETH/BTC OR 0.11
    // leftower: give 4 BTC take 35 ETH
