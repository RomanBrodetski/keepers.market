class App extends React.Component {

  constructor(props) {
    super(props)

    // const pairs = _(this.props.tokens).map((t) => t.symbol)
    const tokens = _.indexBy(this.props.tokens, "symbol")

    this.handleTokensLoaded = this.handleTokensLoaded.bind(this)
    this.loadOrders = this.loadOrders.bind(this)
    this.loadBlockchainData = this.loadBlockchainData.bind(this)

    this.loadBlockchainData()

    this.state = {}
  }

  loadBlockchainData() {
    TokensDAO.loadInfos(Tokens).then(this.handleTokensLoaded)
  }

  handleTokensLoaded(tokens) {
    this.render = this.renderLoaded.bind(this)

    const symbols = _(tokens).map((t) => t.symbol)
    const pairs = _.chain(MathUtil.pairs(symbols)).map((pair) => ({
      pair: pair,
      orders: {
        buy:  [],
        sell: []
      }
    })).indexBy("pair").value()

    this.setState({
      symbols: symbols,
      tokens: _(tokens).indexBy("symbol"),
      pairs: pairs,
      activePair: MathUtil.pairs(symbols)[0]
    })

    this.loadOrders()
  }

  loadOrders() {
    OrdersDAO.loadOrders().then((orders) => {
      const pairs = _(this.state.pairs).mapObject((pairObj) => {
        const ordersBuy = _.chain(orders)
                           .filter((order) =>
                                order.demandToken == this.state.tokens[pairObj.pair[0]].contract.address &&
                                order.supplyToken == this.state.tokens[pairObj.pair[1]].contract.address)
                           .sortBy((o) => o.price(this.state.tokens[pairObj.pair[1]].symbol)).value()
        const ordersSell = _.chain(orders)
                           .filter((order) =>
                                order.demandToken == this.state.tokens[pairObj.pair[1]].contract.address &&
                                order.supplyToken == this.state.tokens[pairObj.pair[0]].contract.address)
                           .sortBy((o) => o.price(this.state.tokens[pairObj.pair[0]].symbol)).value()

        return {
          pair: pairObj.pair,
          orders: {
            buy: ordersBuy,
            sell: ordersSell
          }
        }
      })
      this.setState({
        pairs: pairs
      })
    })
  }

  renderLoaded () {
    return (
      <div className="row">
        <div className="col-md-1">
          <ul className="nav nav-pills nav-stacked">
            {Object.values(this.state.pairs).map((pairObj) => (
              <li key={pairObj.pair.join()} className={_(this.state.activePair).isEqual(pairObj.pair) ? "active" : ""}>
                <a href="#">{pairObj.pair.join("/")}</a>
                </li>
            ))}
          </ul>
        </div>
        <div className="col-md-11">
          <TradingPair
            pair={this.state.activePair}
            tokens={{buy: this.state.tokens[this.state.activePair[0]], sell: this.state.tokens[this.state.activePair[1]]}}
            orders={this.state.pairs[this.state.activePair].orders}
            onTrade={this.loadBlockchainData}
            />
        </div>
      </div>
    )
  }

  render() {
    return (
      <h1>
        Loading...
      </h1>
    )
  }


}
