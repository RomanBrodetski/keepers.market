window.Keepers = (() => {

  const markOrdersOrderUi = (container, orderIds) => {
    orderIds.map((orderId, index) => {
      let tr = container.find("tr[data-order-id=" + orderId + "]")
      tr.addClass("success")
      tr.find(".js-order-keepers-order").html(index)
    })
  }

  const traverseOrders = (token1, token2, tail) =>
    KeepersMarket.higher_price_id_mapping(token1, token2, startingId).then((r) => {
      console.log("intermidiate result. r: " + r + " tail: ", tail)
      if (r == 0) {
        return tail;
      } else {
        return traverseOrdersOrder(token1, token2, tail.concat([r]))
      }
    })

  const updateUiOrdersInfo = KeepersMarket.lowest_price_id_mapping(XbtToken.address, EthToken.address).then((lowestOrderId) => {
    console.log("lowest order id is " + lowestOrderId.toNumber());
    if (lowestOrderId.toNumber() > 0) {
      Keepers.traverseOrders(XbtToken.address, EthToken.address, [lowestOrderId.toNumber()]).then((orderedOrders) => {
        console.log("ordered orders are " + orderedOrders);
        Keepers.markOrdersOrderUi($(".js-buy-orders"), orderedOrders)
      })
    }
  })

  // const keep = (token1, token2) => {
  //   splitOrders()
  // }

  return {
    traverseOrders: traverseOrders,
    markOrdersOrderUi: markOrdersOrderUi,
    updateUiOrdersInfo: updateUiOrdersInfo
  }

})()

$(document).ready(function() {
  // Keepers.updateUiOrdersInfo()
});

