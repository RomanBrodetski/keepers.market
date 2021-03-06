class OrdersDAO {
  static loadOrders() {
    return KeepersMarket.lastOrderId().then((lastOrderId) =>
      Promise.all(_.range(1, lastOrderId.toNumber() + 1).map((id) => KeepersMarket.orders(id).then(order => [order, id])))
    )
    .then((orders) => _(orders).map((order) => new Order(order[0], order[1])))
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
      demandToken.address,
      {gas: 500000}
    )
  }
}
