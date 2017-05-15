class OrdersDAO {
  static loadOrders() {
    return KeepersMarket.last_order_id().then((last_order_id) =>
      Promise.all(_.range(1, last_order_id.toNumber() + 1).map((id) => KeepersMarket.orders(id).then(order => [order, id])))
    )
    .then((orders) => _(orders).map((order) => new Order(order)))
  }

  static trade(orderId, volume) {
    return KeepersMarket.executeOrder(orderId, volume, {gas: 500000})
  }

  static cancel(orderId) {
    return KeepersMarket.cancelOrder(orderId)
  }

  static createOrder(demandAmount, supplyAmount, demandToken, supplyToken) {
    return KeepersMarket.createLimitOrder(
      supplyAmount,
      supplyToken.address,
      demandAmount,
      demandToken.address
    )
  }
}
