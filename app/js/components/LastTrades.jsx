class LastTrades extends React.Component {

  constructor(props) {
    super(props)

    console.log(props)
  }

  render() {
    return (
        <div>
          <h3>
            Last Trades
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>bl. time</th>
                <th>price</th>
                <th>vol.</th>
              </tr>
            </thead>
            <tbody>
              {this.props.trades.map((trade, i) => (
                <tr key={i}>
                  <td>{trade.time}</td>
                  <td>{MathUtil.round(trade.price(this.props.primaryToken.contract.address) * Math.pow(10, this.props.primaryToken.decimals - this.props.secondaryToken.decimals), ShowDecimals)}</td>
                  <td>{MathUtil.format(trade.volume(this.props.primaryToken.contract.address), this.props.primaryToken.decimals, ShowDecimals)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
  }
}

