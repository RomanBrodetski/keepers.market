class App extends React.Component {

  constructor(props) {
    super(props)

    // const pairs = _(this.props.tokens).map((t) => t.symbol)
    const tokens = _.indexBy(this.props.tokens, "symbol")

    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.changePair = this.changePair.bind(this)
    this.loadInitialBlockchainData()

    this.state = {}
  }

  handleOrderBlockchainEvent(event) {
    const trade = new Trade(event)

    const pair = Object.values(this.state.pairs).map((e) => e.pair).find((p) =>
      this.state.tokens[p[0]].contract.address == trade.demandToken && this.state.tokens[p[1]].contract.address == trade.supplyToken ||
      this.state.tokens[p[1]].contract.address == trade.demandToken && this.state.tokens[p[0]].contract.address == trade.supplyToken)

    this.setState({
      trades: Object.assign({}, this.state.trades, {
        [pair]: [].concat(this.state.trades[pair] || [], trade)
      })
    })
  }

  loadInitialBlockchainData() {
    TokensDAO.loadInfos(Tokens).then((tokens) => {
      const symbols = _(tokens).map((t) => t.symbol)
      const pairs = _.chain(MathUtil.pairs(symbols)).map((pair) => ({
        pair: pair,
        trades: []
      })).indexBy("pair").value()
      this.setState({
        trades: {},
        symbols: symbols,
        tokens: _(tokens).indexBy("symbol"),
        pairs: pairs,
        activePair: MathUtil.pairs(symbols)[0]
      })
      this.loadBlockchainData()
      KeepersMarket.Trade({from: web3.eth.accounts}, 'latest').then(this.handleOrderBlockchainEvent.bind(this))

      this.render = this.renderLoaded
    })
  }

  loadBlockchainData() {
    Promise.all(Object.values(this.state.tokens).map((tokenObj) => TokensDAO.loadStatistics(tokenObj.contract)))
      .then((responses) => {
        const tokens = _.chain(responses).zip(Object.values(this.state.tokens)).map((respTokenPair) => {
          return Object.assign(respTokenPair[1], respTokenPair[0])
        }).indexBy("symbol").value()
        this.setState({
          tokens: tokens
        })
      })

    OrdersDAO.loadOrders().then((orders) => {
      const pairs = _(this.state.pairs).mapObject((pairObj) => {
        const ordersBuy = _.chain(orders)
                           .filter((order) =>
                                order.demandToken.toLowerCase() == this.state.tokens[pairObj.pair[0]].contract.address.toLowerCase() &&
                                order.supplyToken.toLowerCase() == this.state.tokens[pairObj.pair[1]].contract.address.toLowerCase())
                           .sortBy((o) => o.price(this.state.tokens[pairObj.pair[1]].symbol)).value()
        const ordersSell = _.chain(orders)
                           .filter((order) =>
                                order.demandToken.toLowerCase() == this.state.tokens[pairObj.pair[1]].contract.address.toLowerCase() &&
                                order.supplyToken.toLowerCase() == this.state.tokens[pairObj.pair[0]].contract.address.toLowerCase())
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

  changePair(e, pair) {
    e.preventDefault()
    this.setState({
      activePair: pair
    })
  }

  renderLoaded () {
    return (
      <div className="row">
        <div className="col-md-2">
          <ul className="nav nav-pills nav-stacked">
            {Object.values(this.state.pairs).map((pairObj) => (
              <li key={pairObj.pair.join()} className={_(this.state.activePair).isEqual(pairObj.pair) ? "active" : ""}>
                <a href="#" onClick={(e) => this.changePair(e, pairObj.pair)}>{pairObj.pair.join("/")}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-10">
          {this.state.pairs[this.state.activePair].orders && (
            <TradingPair
              pair={this.state.activePair}
              tokens={{buy: this.state.tokens[this.state.activePair[0]], sell: this.state.tokens[this.state.activePair[1]]}}
              orders={this.state.pairs[this.state.activePair].orders}
              trades={this.state.trades[this.state.activePair] || []}
              onTrade={this.loadBlockchainData}
              />
            )
          }
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
