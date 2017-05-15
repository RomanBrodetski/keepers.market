class OrderBook extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Price</th>
            <th>{this.props.primaryToken.symbol}</th>
            <th>{"vol. " + (this.props.primaryToken.symbol)}</th>
            <th>{"vol. " + (this.props.secondaryToken.symbol)}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.orders.map((order) => (
            <OrderRow primaryToken={this.props.primaryToken} secondaryToken={this.props.secondaryToken} order={order} key={order.id} onTrade={this.props.onTrade}/>
          ))}
        </tbody>
      </table>
    );
  }
};

