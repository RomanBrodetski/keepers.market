class Trade {
  constructor(blockchainEventTrade) {
    this.time = new Date(web3.eth.getBlock(blockchainEventTrade.blockNumber).timestamp * 1000).toLocaleString()
    this.supplyAmount = blockchainEventTrade.args.supplyAmount.toNumber()
    this.supplyToken = blockchainEventTrade.args.supplyToken.toString()
    this.demandAmount = blockchainEventTrade.args.demandAmount.toNumber()
    this.demandToken = blockchainEventTrade.args.demandToken.toString()
  }

  volume(address) {
    return address == this.supplyToken ? this.supplyAmount : this.demandAmount
  }

  price(address) {
    return Math.pow(this.supplyAmount / this.demandAmount, (address == this.supplyToken ? -1 : 1))
  }
}
