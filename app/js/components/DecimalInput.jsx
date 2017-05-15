// class DecimalInput extends React.Component {

//   constructor(props) {
//     super(props)

//     this.state = {
//       caption: this.props.value / Math.pow(10, Decimals)
//     }

//     this.handleCaptionChange = this.handleCaptionChange.bind(this)
//   }

//   handleCaptionChange(event) {
//     const caption = parseFloat(event.target.value) == NaN ? 0 : parseFloat(event.target.value)
//     const value = caption * Math.pow(10, Decimals)

//     this.setState({
//       caption: caption
//     })
//     this.props.onUpdate(value)
//     // const primary = (event.target.name == "primary") ? value : value * this.props.order.price(this.props.secondaryToken.symbol)
//     // const secondary = (event.target.name == "secondary") ? value : value * this.props.order.price(this.props.primaryToken.symbol)

//     // this.setState({
//     //   primary: primary,
//     //   secondary: secondary
//     // })
//   }

//   trade() {
//     // const value = this.props.inverted ? this.state.volume : this.state.volume * this.props.order.price(this.props.inverted)
//     // console.log(value)
//     // OrdersDAO
//     //   .trade(this.props.order.id, value)
//     //   .then(this.props.onTrade)
//   }

//   render() {
//     return (
//             <div>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={this.state.caption}
//                 onChange={this.handleCaptionChange} />
//               <span>{this.props.value}</span>
//               </div>
//           )
//   }
// };

