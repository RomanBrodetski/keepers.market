class Order {
  constructor(blockchainOrder) {
    console.log("blockchainOrder")
    console.log(blockchainOrder)
    this.id = blockchainOrder[1]
    this.supplyAmount = blockchainOrder[0][0].toNumber()
    this.supplyToken = blockchainOrder[0][1].toString()
    this.demandAmount = blockchainOrder[0][2].toNumber()
    this.demandToken = blockchainOrder[0][3].toString()
    this.owner = blockchainOrder[0][4]
  }

  volume(address) {
    return address == this.supplyToken ? this.supplyAmount : this.demandAmount
  }

  price(address) {
    return Math.pow(this.supplyAmount / this.demandAmount, (address == this.supplyToken ? -1 : 1))
  }

  computeCounterpart(address, amount) {
    const nom   = address == this.supplyToken ? this.demandAmount : this.supplyAmount
    const denom = address == this.supplyToken ? this.supplyAmount : this.demandAmount

    const step  = MathUtil.step(denom, nom)
    const actual = Math.floor(amount / step) * step
    const counterpart = actual * nom / denom
    return [actual, counterpart]
  }

}
