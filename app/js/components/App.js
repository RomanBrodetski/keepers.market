class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      buyOrders: [],
      sellOrders: []
    }

    this.reloadOrders()

    this.reloadOrders = this.reloadOrders.bind(this)
  }

  reloadOrders() {
    OrdersDAO.loadOrders().then((orders) => {
      this.setState({
        buyOrders:  _(orders).filter((order) => order.demandToken == "ETH"),
        sellOrders: _(orders).filter((order) => order.demandToken == "XBT")
      })
    })
  }

  render() {
    return (
      <div>
        <div className={"row"}>
          <div className={"col-md-8"}>
            <div className={"col-md-6"}>
              <OrderBook orders={this.state.buyOrders} mode={"BUY"}/>
            </div>
            <div className={"col-md-6"}>
              <OrderBook orders={this.state.sellOrders} mode={"SELL"}/>
            </div>
          </div>
        </div>
        <div className={"row"}>
          <div className={"col-md-8"}>
            <div className={"col-md-6"}>
              <CreateOrder demandToken={"ETH"} supplyToken={"XBT"} mode={"BUY"} updateOrders={this.reloadOrders}/>
            </div>
            <div className={"col-md-6"}>
              <CreateOrder demandToken={"XBT"} supplyToken={"ETH"} mode={"SELL"} updateOrders={this.reloadOrders}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

