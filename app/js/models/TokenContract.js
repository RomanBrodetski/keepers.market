class TokenContract {
  constructor(symbol, contract) {
    this.symbol = symbol
    this.contract = contract
  }

  // loadTokenStatisticsAsync() {
  //   return Promise.all([
  //           this.contract.balanceOf(web3.eth.defaultAccount),
  //           this.contract.allowance(web3.eth.defaultAccount, KeepersMarket.address)
  //         ]).then((results) => new TokenStatistics(
  //             results[0].toNumber() / Math.pow(10, Decimals),
  //             results[1].toNumber() / Math.pow(10, Decimals)
  //           )
  //         )
  // }
}
