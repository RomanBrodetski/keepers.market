pragma solidity ^0.4.8;

import './token/ERC20.sol';
import "./Utilities.sol";
import "./SafeMath.sol";

contract SimpleMarket is Utilities, SafeMath {


    event Trade(
        uint sellHowMuch,
        address indexed sellWhichToken,
        uint buyHowMuch,
        address indexed buyWhichToken
    );


    struct Order {
        uint     supplyAmount;
        ERC20    supplyToken;
        uint     demandAmount;
        ERC20    demandToken;
        address  owner;
        bool     active;
    }


    mapping (uint => Order) public orders;


    uint public lastOrderId;


    function createLimitOrder(
        uint  supplyAmount,
        ERC20 supplyToken,
        uint  demandAmount,
        ERC20 demandToken
    ) {
        // assert(msg.sender == );
        // check all the values
        supplyToken.transferFrom(msg.sender, this, supplyAmount);
        createOrder(msg.sender, supplyAmount, supplyToken, demandAmount, demandToken);
    }


    function executeOrder(uint id, uint demandAmount) {
        // syncronized (only for id)
        Order order = orders[id];
        assert(demandAmount <= order.supplyAmount);

        uint supplyAmount = SafeMath.safeMul(order.demandAmount, demandAmount) / order.supplyAmount; //todo: overflow, remainder :(

        order.demandToken.transferFrom(msg.sender, this, supplyAmount);
        uint mirrorOrderId = createOrder(msg.sender, supplyAmount, order.demandToken, demandAmount, order.supplyToken);

        mutualOrderTrade(id, mirrorOrderId);
    }


    function cancelOrder(uint id) {
        Order order = orders[id];
        assert(order.owner == msg.sender);
        order.supplyToken.transfer(order.owner, order.supplyAmount);
        delete orders[id];
    }


    function mutualOrderTrade(uint olderOrderId, uint newerOrderId) internal {
        Order oldOrder = orders[olderOrderId];
        Order newOrder = orders[newerOrderId];

        assert(oldOrder.demandToken == newOrder.supplyToken);
        assert(newOrder.demandToken == oldOrder.supplyToken);
        assert(oldOrder.demandAmount *  newOrder.demandAmount <= oldOrder.supplyAmount * newOrder.supplyAmount);
        assert(olderOrderId < newerOrderId);

        uint buyingAmount  = Utilities.min(oldOrder.supplyAmount, newOrder.demandAmount);
        uint sellingAmount = SafeMath.safeMul(oldOrder.demandAmount, buyingAmount) / oldOrder.supplyAmount;


        oldOrder.demandToken.transfer(oldOrder.owner, sellingAmount);
        newOrder.demandToken.transfer(newOrder.owner, buyingAmount);

        handleOrderDepletion(olderOrderId, buyingAmount, sellingAmount);
        handleOrderDepletion(newerOrderId, sellingAmount, buyingAmount);
    }


    function handleOrderDepletion(uint orderId, uint boughtFromThisOrder, uint soldToThisOrder) internal {
        Order order = orders[orderId];

        uint supplyLeft = SafeMath.safeSub(order.supplyAmount, boughtFromThisOrder);
        uint demandLeft = SafeMath.safeSub(order.demandAmount, soldToThisOrder);

        if (demandLeft > 0) {
            createOrder(order.owner, supplyLeft, order.supplyToken, demandLeft, order.demandToken);
        } else if (supplyLeft > 0) {
            order.supplyToken.transfer(order.owner, supplyLeft);
        }

        delete orders[orderId];
    }


    function createOrder(
        address owner,
        uint  supplyAmount,
        ERC20 supplyToken,
        uint  demandAmount,
        ERC20 demandToken
    ) internal returns (uint) {
        Order memory order = Order(
            supplyAmount,
            supplyToken,
            demandAmount,
            demandToken,
            owner,
            true);
        uint id = nextId();

        orders[id] = order;
        return id;
    }


    function nextId() internal returns (uint) {
             return ++lastOrderId;
    }
}
