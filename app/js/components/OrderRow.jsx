class OrderRow extends React.Component {

  constructor(props) {
    super(props)

    const primary = this.props.order.volume(this.props.primaryToken.contract.address)
    const secondary = this.props.order.volume(this.props.secondaryToken.contract.address)

    this.state = {
      primary: {
        value: primary,
        caption: this.valueToCaption(primary, this.props.primaryToken.decimals)
      },
      secondary: {
        value: secondary,
        caption: this.valueToCaption(secondary, this.props.secondaryToken.decimals)
      }
    }

    this.handleVolumeChange = this.handleVolumeChange.bind(this)
    this.trade = this.trade.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  valueToCaption(value, decimals) {
    return MathUtil.round(value  / Math.pow(10, decimals), ShowDecimals)
  }

  handleVolumeChange(event) {
    event.preventDefault()
    var value = parseFloat(event.target.value) == NaN ? 0 : parseFloat(event.target.value)
    var name  = event.target.name

    var token = name == "primary" ? this.props.primaryToken : this.props.secondaryToken
    if (value * Math.pow(10, token.decimals) > this.props.order.volume(token.contract.address)) {
      value = this.props.order.volume(token.contract.address) / Math.pow(10, token.decimals)
    }
    const calibrated = this.props.order.computeCounterpart(token.contract.address, value * Math.pow(10, token.decimals))

    this.setState({
      [name] : {
        value: calibrated[0],
        caption: this.valueToCaption(calibrated[0], name == "primary" ? this.props.primaryToken.decimals : this.props.secondaryToken.decimals)
      },
      [name == "primary" ? "secondary" : "primary"] : {
        value: calibrated[1],
        caption: this.valueToCaption(calibrated[1], name == "primary" ? this.props.secondaryToken.decimals : this.props.primaryToken.decimals)
      }
    })
  }

  trade(e) {
    e.preventDefault()
    const value = this.props.primaryToken.contract.address == this.props.order.supplyToken ? this.state.primary.value : this.state.secondary.value
    OrdersDAO
      .trade(this.props.order.id, value)
      .then(this.props.onTrade)
  }


  cancel(e) {
    e.preventDefault()
    OrdersDAO
      .cancel(this.props.order.id)
      .then(this.props.onTrade)
  }

  render() {
    return (
            <tr>
              <td>
                <span title={this.props.order.price(this.props.primaryToken.contract.address)}>
                  {Math.round(this.props.order.price(this.props.primaryToken.contract.address) * Math.pow(10, ShowDecimals)) / Math.pow(10, ShowDecimals)}
                </span>
              </td>
              <td>
                <span title={this.props.order.volume(this.props.primaryToken.contract.address)}>
                  {this.valueToCaption(this.props.order.volume(this.props.primaryToken.contract.address), this.props.primaryToken.decimals)}
                </span>
              </td>
              <td style={{width:130}}>
                <div className="input-group input-group-sm">
                  <input type="number" className="form-control" step="10" name="primary" value={this.state.primary.caption} onChange={this.handleVolumeChange}/>
                  <span>{this.state.primary.value}</span>
                </div>
              </td>
              <td style={{width:130}}>
                <div className="input-group input-group-sm">
                  <input type="number" className="form-control" name="secondary" value={this.state.secondary.caption} onChange={this.handleVolumeChange}/>
                  <span>{this.state.secondary.value}</span>
                </div>
              </td>
              <td>
                <a href="#" onClick={this.trade}>
                  <span className="glyphicon glyphicon-send"></span>
                </a>
              </td>
              <td>
                  {this.props.order.owner == web3.eth.defaultAccount &&
                    (<a href="#" onClick={this.cancel}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </a>)}
              </td>
            </tr>
          )
  }
};
