window.OrdersDAO = (() => {
  return {
    loadOrders: () =>
      KeepersMarket.last_order_id().then((last_order_id) => {
        return Promise.all(_.range(1, last_order_id.toNumber() + 1).map((id) => KeepersMarket.orders(id).then(order => [order, id])))
        }
      )
      .then((orders) => _(orders).map((order) => new Order(order)))
    }
})()
