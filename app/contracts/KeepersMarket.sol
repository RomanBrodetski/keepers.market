pragma solidity ^0.4.8;

import './SimpleMarket.sol';

contract KeepersMarket is SimpleMarket {

  mapping(address => mapping(address => uint)) public lowestPriceIdMapping;
  mapping(address => mapping(address => mapping(uint => uint))) public  higherPriceIdMapping;
  // mapping(address => mapping(address => mapping(uint => uint))) public smaller_price_id;

  function insertOrder(uint orderId, uint lowerId) {
    Order order = orders[orderId];
    assert(order.supplyAmount > 0);
    if (lowerId == 0) {
      uint lowestId = lowestPriceIdMapping[order.supplyToken][order.demandToken];
      // Log("lowestId", lowestId);
      if (lowestId == 0) {
        // Log("order id set to", orderId);
        lowestPriceIdMapping[order.supplyToken][order.demandToken] = orderId;
      } else {
        Order lowest = orders[lowestId];
        assert(isLowerPriced(order, lowest));
        lowestPriceIdMapping[order.supplyToken][order.demandToken] = orderId;
        higherPriceIdMapping[order.supplyToken][order.demandToken][orderId] = lowestId;
      }
    } else {
      Order lower = orders[lowerId];
      assert(lower.supplyToken == order.supplyToken);
      assert(lower.demandToken == order.demandToken);
      uint higherId = higherPriceIdMapping[order.supplyToken][order.demandToken][lowerId];
      Order higher = orders[higherId];
      assert(isLowerPriced(lower, order));
      assert(isLowerPriced(order, higher));
      higherPriceIdMapping[lower.supplyToken][lower.demandToken][lowerId] = orderId;
      higherPriceIdMapping[lower.supplyToken][lower.demandToken][orderId] = higherId;
    }
  }

  function isLowerPriced(Order smallerOrder, Order higherOrder) internal returns (bool) {
    return safeMul(smallerOrder.demandAmount, higherOrder.supplyAmount) <
      safeMul(smallerOrder.supplyAmount, higherOrder.demandAmount);
  }

}
