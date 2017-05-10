class OrdersDAO {
  static loadOrders() {
    return KeepersMarket.last_order_id().then((last_order_id) =>
      Promise.all(_.range(1, last_order_id.toNumber() + 1).map((id) => KeepersMarket.orders(id).then(order => [order, id])))
    )
    .then((orders) => _(orders).map((order) => new Order(order)))
  }

  static createOrder(demandAmount, supplyAmount, demandToken, supplyToken) {
    return KeepersMarket.createLimitOrder(
      supplyAmount * Math.pow(10, Decimals),
      supplyToken.address,
      demandAmount * Math.pow(10, Decimals),
      demandToken.address
    )
  }
}
