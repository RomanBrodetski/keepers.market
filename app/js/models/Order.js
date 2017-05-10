class Order {
  constructor(blockchainOrder) {
    this.id = blockchainOrder[1]
    this.supplyAmount = blockchainOrder[0][0].toNumber() / Math.pow(10, Decimals)
    this.supplyToken = _.findKey(Tokens, (tokenC => tokenC.address == blockchainOrder[0][1].toString()))
    this.demandAmount = blockchainOrder[0][2].toNumber() / Math.pow(10, Decimals)
    this.demandToken = _.findKey(Tokens, (tokenC => tokenC.address == blockchainOrder[0][3].toString()))
  }

  volume(mode) {
    return mode == "BUY" ? this.demandAmount : this.supplyAmount
  }

  price (mode) {
    return Math.pow(this.supplyAmount / this.demandAmount, (mode == "BUY" ? 1 : -1))
  }

}
