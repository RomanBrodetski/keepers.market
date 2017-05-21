class TradingPair extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className={"col-md-8"}>
          <div className={"row"}>
            <div className={"col-md-6"}>
              <h3> Ask </h3>
              <OrderBook orders={this.props.orders.buy} primaryToken={this.props.tokens.buy} secondaryToken={this.props.tokens.sell} onTrade={this.props.onTrade}/>
            </div>
            <div className={"col-md-6"}>
              <h3> Bid </h3>
              <OrderBook orders={this.props.orders.sell} primaryToken={this.props.tokens.buy} secondaryToken={this.props.tokens.sell} onTrade={this.props.onTrade}/>
            </div>
          </div>
          <div className={"row"} style={{"marginTop":50}}>
            <div className={"col-md-6"}>
              <CreateOrder demandToken={this.props.tokens.buy} supplyToken={this.props.tokens.sell} mode={"BUY"} updateOrders={this.props.onTrade}/>
            </div>
            <div className={"col-md-6"}>
              <CreateOrder demandToken={this.props.tokens.sell} supplyToken={this.props.tokens.buy} mode={"SELL"} updateOrders={this.props.onTrade}/>
            </div>
          </div>
        </div>
        <div className={"col-md-4"}>
          <LastTrades trades={this.props.trades} primaryToken={this.props.tokens.buy} secondaryToken={this.props.tokens.sell}  />
        </div>
      </div>
    );
  }
}

