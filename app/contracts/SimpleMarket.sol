pragma solidity ^0.4.8;

import './token/ERC20.sol';
import "./Utilities.sol";
import "./SafeMath.sol";
import "./EventfulMarket.sol";

contract SimpleMarket is EventfulMarket,
                         Utilities,
                         SafeMath
                           {
  event Log(
      string message,
      uint value
  );

  struct Order {
    uint     supply_amount;
    ERC20    supply_token;
    uint     demand_amount;
    ERC20    demand_token;
    address  owner;
    bool     active;
  }

  mapping (uint => Order) public orders;
  uint public last_order_id;

  function createLimitOrder(  uint  supply_amount,
                              ERC20 supply_token,
                              uint  demand_amount,
                              ERC20 demand_token) {
    // assert(msg.sender == );
    // check all the values
    supply_token.transferFrom(msg.sender, this, supply_amount);
    createOrder(msg.sender, supply_amount, supply_token, demand_amount, demand_token);
  }

  function executeOrder(uint id, uint demand_amount) {
    // syncronized (only for id)
    Order order = orders[id];
    assert(demand_amount <= order.supply_amount);

    uint supply_amount = SafeMath.safeMul(order.demand_amount, demand_amount) / order.supply_amount; //todo: overflow, remainder :(

    order.demand_token.transferFrom(msg.sender, this, supply_amount);
    uint mirror_order_id = createOrder(msg.sender, supply_amount, order.demand_token, demand_amount, order.supply_token);

    mutualOrderTrade(id, mirror_order_id);
  }

  function cancelOrder(uint id) {
    Order order = orders[id];
    assert(order.owner == msg.sender);
    order.supply_token.transfer(order.owner, order.supply_amount);
    delete orders[id];
  }

  function mutualOrderTrade(uint older_order_id, uint newerOrderId) internal {
    Order oldOrder = orders[older_order_id];
    Order newOrder = orders[newerOrderId];

    assert(oldOrder.demand_token == newOrder.supply_token);
    assert(newOrder.demand_token == oldOrder.supply_token);
    assert(oldOrder.demand_amount *  newOrder.demand_amount <= oldOrder.supply_amount * newOrder.supply_amount);
    assert(older_order_id < newerOrderId);

    uint buying_amount  = Utilities.min(oldOrder.supply_amount, newOrder.demand_amount);         // ETH 10
    uint selling_amount = SafeMath.safeMul(oldOrder.demand_amount, buying_amount) / oldOrder.supply_amount;

    Log("buying_amount", buying_amount);
    Log("selling_amount", selling_amount);

    oldOrder.demand_token.transfer(oldOrder.owner, selling_amount);
    newOrder.demand_token.transfer(newOrder.owner, buying_amount);

    handleOrderDepletion(older_order_id, buying_amount, selling_amount);
    handleOrderDepletion(newerOrderId, selling_amount, buying_amount);
  }

  function handleOrderDepletion(uint orderId, uint boughtFromThisOrder, uint soldToThisOrder) internal{
    Log("handling order depletion ", orderId);
    Order order = orders[orderId];

    uint supply_left = SafeMath.safeSub(order.supply_amount, boughtFromThisOrder);
    uint demand_left = SafeMath.safeSub(order.demand_amount, soldToThisOrder);

    assert(supply_left >= 0);
    assert(demand_left >= 0);

    if (demand_left > 0) {
      Log("Order is not fulfil. creating new one", 0);
      createOrder(order.owner, supply_left, order.supply_token, demand_left, order.demand_token);
    } else {
      if (supply_left > 0) {
        order.supply_token.transfer(order.owner, supply_left);
      }
    }
    delete orders[orderId];
  }


  function createOrder(
                        address owner,
                        uint  supply_amount,
                        ERC20 supply_token,
                        uint  demand_amount,
                        ERC20 demand_token) internal returns (uint) {
    Order memory order = Order(
      supply_amount,
      supply_token,
      demand_amount,
      demand_token,
      owner,
      true);
    uint id = next_id();

    orders[id] = order;
    return id;
  }

  function next_id() internal returns (uint) {
       return ++last_order_id;
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
