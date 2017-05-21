class Order {
  constructor(blockchainOrder, id) {
    this.id = id
    this.supplyAmount = blockchainOrder[0].toNumber()
    this.supplyToken = blockchainOrder[1].toString()
    this.demandAmount = blockchainOrder[2].toNumber()
    this.demandToken = blockchainOrder[3].toString()
    this.owner = blockchainOrder[4]
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
