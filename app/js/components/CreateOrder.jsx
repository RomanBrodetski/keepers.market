const InputGroup = ({value, caption, name, onChange, disabled=false}) => {
    return (
       <div className="input-group">
          <input readOnly={disabled} className="form-control" name={name} value={value} onChange={onChange}/>
          <span className="input-group-addon">{caption}</span>
        </div>
      )
  }

class CreateOrder extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      allowanceCaption: "",
      price: "",
      amount: "",
      total: ""
    }

    this.handleAllowanceChange = this.handleAllowanceChange.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleTotalChange = this.handleTotalChange.bind(this)
    this.setAllowance      = this.setAllowance.bind(this)
    this.createOrder       = this.createOrder.bind(this)
  }

  onlyFinite(num) {
    return isFinite(num) ? num : ""
  }

  handlePriceChange(event) {
    this.setState({
      price: parseFloat(event.target.value),
      total: this.onlyFinite(this.state.amount * parseFloat(event.target.value))
    })
  }

  handleAmountChange(event) {
    const value = parseFloat(event.target.value)
    this.setState({
      amount: this.onlyFinite(value),
      total: this.onlyFinite(value * this.state.price)
    })
  }

  handleTotalChange(event) {
    const value = parseFloat(event.target.value)
    this.setState({
      total: this.onlyFinite(value),
      amount: this.onlyFinite(value / this.state.price)
    })
  }

  handleAllowanceChange(event) {
    const value = event.target.value
    this.setState({
      allowanceCaption: value
    })
  }

  setAllowance() {
    TokensDAO.setAllowance(
      this.props.supplyToken.contract,
      this.state.allowanceCaption * Math.pow(10, this.props.supplyToken.decimals)
    ).then(this.props.updateOrders)
  }

  createOrder() {
    const demandAmount = (this.props.mode === "BUY" ? this.state.amount : this.state.total)
    const supplyAmount = (this.props.mode === "BUY" ? this.state.total : this.state.amount)
    OrdersDAO.createOrder(
      demandAmount * Math.pow(10, this.props.demandToken.decimals),
      supplyAmount * Math.pow(10, this.props.supplyToken.decimals),
      this.props.demandToken.contract,
      this.props.supplyToken.contract
    ).then(this.props.updateOrders)
  }

  render() {
    return (
        <form className="form-horizontal" >
          <div className="form-group">
            <label className="col-md-3 control-label">Balance</label>
            <div className="col-md-9">
              <InputGroup value={MathUtil.format(this.props.supplyToken.balance, this.props.supplyToken.decimals, ShowDecimals)} caption={this.props.supplyToken.symbol} name="balance" disabled={true}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Allowance</label>
            <div className="col-md-5">
              <InputGroup value={MathUtil.format(this.props.supplyToken.allowance, this.props.supplyToken.decimals, ShowDecimals)} caption={this.props.supplyToken.symbol} name="allowance" disabled={true}/>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <input type="text" className="form-control" name="allowanceCaption"
                  value={this.state.allowanceCaption}
                  onChange={this.handleAllowanceChange} />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button" onClick={this.setAllowance}>Set</button>
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Price</label>
            <div className="col-md-9">
              <InputGroup
                value={this.state.priceCaption}
                caption={this.props.mode === "BUY" ? this.props.supplyToken.symbol : this.props.demandToken.symbol}
                name="price"
                onChange={this.handlePriceChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Amount</label>
            <div className="col-md-9">
              <InputGroup
                value={MathUtil.round(this.state.amount, ShowDecimals)}
                caption={this.props.mode === "BUY" ? this.props.demandToken.symbol : this.props.supplyToken.symbol}
                name="amount"
                onChange={this.handleAmountChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Total</label>
               <div className="col-md-9">
                <InputGroup
                  value={MathUtil.round(this.state.total, ShowDecimals)}
                  caption={this.props.mode === "BUY" ? this.props.supplyToken.symbol : this.props.demandToken.symbol}
                  name="total"
                  onChange={this.handleTotalChange} />
            </div>
          </div>
          <button type="button" className="btn btn-success pull-right" onClick={this.createOrder}>Create order</button>
        </form>
      );
  }
};

