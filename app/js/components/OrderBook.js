class OrderBook extends React.Component {
  render() {
    return (<table className="table">
              <tbody>
                {this.props.orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      {order.price(this.props.mode)}
                    </td>
                    <td>
                      {order.volume(this.props.mode)}
                    </td>
                  </tr>
                ))}
              </tbody>
      </table>);
  }
};

