pragma solidity ^0.4.8;

import './SimpleMarket.sol';

contract KeepersMarket is SimpleMarket {

  mapping(address => mapping(address => uint)) public lowest_price_id_mapping;
  mapping(address => mapping(address => mapping(uint => uint))) public  higher_price_id_mapping;
  // mapping(address => mapping(address => mapping(uint => uint))) public smaller_price_id;

  function insertOrder(uint order_id, uint lower_id) {
    Order order = orders[order_id];
    assert(order.supply_amount > 0);
    if (lower_id == 0) {
      uint lowest_id = lowest_price_id_mapping[order.supply_token][order.demand_token];
      Log("lowest_id", lowest_id);
      if (lowest_id == 0) {
        Log("order id set to", order_id);
        lowest_price_id_mapping[order.supply_token][order.demand_token] = order_id;
      } else {
        Order lowest = orders[lowest_id];
        assert(isLowerPriced(order, lowest));
        lowest_price_id_mapping[order.supply_token][order.demand_token] = order_id;
        higher_price_id_mapping[order.supply_token][order.demand_token][order_id] = lowest_id;
      }
    } else {
      Order lower = orders[lower_id];
      assert(lower.supply_token == order.supply_token);
      assert(lower.demand_token == order.demand_token);
      uint higher_id = higher_price_id_mapping[order.supply_token][order.demand_token][lower_id];
      Order higher = orders[higher_id];
      assert(isLowerPriced(lower, order));
      assert(isLowerPriced(order, higher));
      higher_price_id_mapping[lower.supply_token][lower.demand_token][lower_id] = order_id;
      higher_price_id_mapping[lower.supply_token][lower.demand_token][order_id] = higher_id;
    }
  }

  function isLowerPriced(Order smaller_order, Order higher_order) internal returns (bool) {
    return safeMul(smaller_order.demand_amount, higher_order.supply_amount) <
      safeMul(smaller_order.supply_amount, higher_order.demand_amount);
  }

}


// I supply 100 ETH for 1 XBT. the price is 0.01 xbt/eth
