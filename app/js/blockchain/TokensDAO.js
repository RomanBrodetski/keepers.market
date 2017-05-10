class TokensDAO {
  static loadStatistics(tokenContract) {
    return Promise.all([
      tokenContract.balanceOf(web3.eth.defaultAccount),
      tokenContract.allowance(web3.eth.defaultAccount, KeepersMarket.address)
    ]).then((results) => ({
        balance: results[0].toNumber() / Math.pow(10, Decimals),
        allowance: results[1].toNumber() / Math.pow(10, Decimals)
      }))
  }

  static setAllowance(tokenContract, amount) {
    return tokenContract.approve(KeepersMarket.address, amount * Math.pow(10, Decimals))
  }
}
