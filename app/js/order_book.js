window.OrderBook = (() => {
  // [buy, sell]

  const parseBlockchainOrder = (order_id_array) => {
    return {
      id: order_id_array[1],
      supply_amount: order_id_array[0][0].toNumber() / Math.pow(10, Decimals),
      supply_token: _.findKey(Tokens, (tokenC => tokenC.address == order_id_array[0][1].toString())),
      demand_amount: order_id_array[0][2].toNumber() / Math.pow(10, Decimals),
      demand_token: _.findKey(Tokens, (tokenC => tokenC.address == order_id_array[0][3].toString()))
    };
  }

  const splitOrders = (pair) => (orders) => {
      return [_.sortBy(
        _(orders).filter(order => order.supply_token == pair[1] && order.demand_token == pair[0]),
        (order) => order.demand_amount / order.supply_amount),
      _.sortBy(
        _(orders).filter(order => order.supply_token == pair[0] && order.demand_token == pair[1]),
          (order) => order.demand_amount / order.supply_amount)]

    }

  return {
    splitOrders: splitOrders,
    parseBlockchainOrder: parseBlockchainOrder,
    loadOrders: () =>
      KeepersMarket.last_order_id().then((last_order_id) => {
        return Promise.all(_.range(1, last_order_id.toNumber() + 1).map((id) => KeepersMarket.orders(id).then(order => [order, id])))
        }
      )
      .then((orders) => _(orders).map(parseBlockchainOrder))
      .then(splitOrders(["ETH", "XBT"]))
    }
})()
