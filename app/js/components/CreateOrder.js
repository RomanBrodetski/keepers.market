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
      balance: "",
      allowance: "",
      newAllowance: "",
      price: "",
      amount: "",
      total: ""
    }
    this.supplyContract = Tokens[this.props.supplyToken]
    this.demandContract = Tokens[this.props.demandToken]
    this.reloadInfo()

    this.handleInputChange = this.handleInputChange.bind(this)
    this.setAllowance      = this.setAllowance.bind(this)
    this.reloadInfo        = this.reloadInfo.bind(this)
    this.createOrder       = this.createOrder.bind(this)
  }

  reloadInfo() {
    TokensDAO.loadStatistics(this.supplyContract).then((r) => (this.setState(
      {
        balance: r.balance,
        allowance: r.allowance,
        newAllowance: r.allowance
      }
      )))
  }

  handleInputChange(event) {
    const value = event.target.value
    const name = event.target.name
    const upd = {
      [name]: value
    };
    if (name == "total") {
      Object.assign(upd, {
        amount: parseFloat(value) / parseFloat(this.state.price)
      })
    }
    if (name == "amount") {
      Object.assign(upd, {
        total: parseFloat(value) * parseFloat(this.state.price)
      })
    }
    if (name == "price") {
      Object.assign(upd, {
        total: parseFloat(this.state.amount) * parseFloat(value)
      })
    }
    this.setState(upd)
  }

  setAllowance() {
    TokensDAO.setAllowance(this.supplyContract, this.state.newAllowance).then(this.reloadInfo)
  }

  createOrder() {
    const demandAmount = this.props.mode === "BUY" ? this.state.amount : this.state.total
    const supplyAmount = this.props.mode === "BUY" ? this.state.total : this.state.amount
    OrdersDAO.createOrder(demandAmount, supplyAmount, this.demandContract, this.supplyContract).then(() => {
      this.props.updateOrders()
      this.reloadInfo()
    })
  }

  render() {
    return (
        <form className="form-horizontal" >
          <div className="form-group">
            <label className="col-md-3 control-label">Balance</label>
            <div className="col-md-9">
              <InputGroup value={this.state.balance} caption={this.props.supplyToken} name="balance" disabled={true}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Allowance</label>
            <div className="col-md-5">
              <InputGroup value={this.state.allowance} caption={this.props.supplyToken} name="allowance" disabled={true}/>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <input type="text" className="form-control" name="newAllowance" value={this.state.newAllowance}  onChange={this.handleInputChange} />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button" onClick={this.setAllowance}>Set</button>
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Price</label>
            <div className="col-md-9">
              <InputGroup value={this.state.price} caption={this.props.mode === "BUY" ? this.props.supplyToken : this.props.demandToken} name="price" onChange={this.handleInputChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Amount</label>
            <div className="col-md-9">
              <InputGroup value={this.state.amount} caption={this.props.mode === "BUY" ? this.props.demandToken : this.props.supplyToken} name="amount" onChange={this.handleInputChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label">Total</label>
               <div className="col-md-9">
                <InputGroup value={this.state.total} caption={this.props.mode === "BUY" ? this.props.supplyToken : this.props.demandToken} name="total" onChange={this.handleInputChange}/>
            </div>
          </div>
          <button type="button" className="btn btn-success pull-right" onClick={this.createOrder}>Create order</button>
        </form>
      );
  }
};

