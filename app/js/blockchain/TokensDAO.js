class TokensDAO {
  static loadStatistics(tokenContract) {
    console.log("load stats invoked")
    return Promise.all([
      tokenContract.balanceOf(web3.eth.defaultAccount),
      tokenContract.allowance(web3.eth.defaultAccount, KeepersMarket.address)
    ]).then((results) => ({
        balance: results[0].toNumber(),
        allowance: results[1].toNumber()
      }))
  }

  static loadInfo(tokenContract) {
    return Promise.all([
      tokenContract.symbol(),
      tokenContract.decimals()
    ]).then((r) => ({
      symbol: r[0].toString(),
      decimals: r[1].toNumber()
    }))
  }

  static loadInfos(tokenContracts) {
    return Promise.all(_(tokenContracts).map((t) => this.loadInfo(t))).then((r) =>
        _.chain(tokenContracts).zip(r)
          .map((pair) => Object.assign(pair[1], {contract: pair[0]}))
          .value()
    )
  }

  static setAllowance(tokenContract, amount) {
    console.log("tokenContract", amount)
    return tokenContract.approve(KeepersMarket.address, amount)
  }
}
