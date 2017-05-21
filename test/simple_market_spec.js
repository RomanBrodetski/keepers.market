var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;

describe("SimpleMarket", function() {
  before(function(done) {
    // var contractsConfig = {
    //   "SimpleMarket": {},
    //   "StandardToken": {gas:999999999},
    //   "MkrToken": {},
    //   // "EthToken": {}

    //   // "XbtToken": {
    //   //   gas: 4712388000,
    //   //   args:[]
    //   // },
    //   // "SimpleMarket": {
    //   //   gas: 4712388000,
    //   //   args:[]
    //   // }
    // };
    // XbtToken.deploy(done);
    EmbarkSpec.deployAll(done);
  });

  it("should be deployed with an empty order book", function(done) {
    console.log("XbtToken.address " + XbtToken.address)
    console.log("MkrToken.address " + MkrToken.address)
    console.log("EthToken.address " + EthToken.address)
    console.log("KeepersMarket.address " + KeepersMarket.address)
    console.log("StandardToken.address " + StandardToken.address)

    SimpleMarket.lastOrderId(function(err, result) {
      assert.equal(result.toNumber(), 0);
      done();
    });
  });

  // it("should create an order properly", function(done) {
  //   SimpleMarket.createLimitOrder(1000000, MkrToken.address, 1100000, EthToken.address)
      // .then(function() {
      //   // return SimpleMarket.lastOrderId().then(function(r) {return r.toNumber()})
      // })
      // .then(function(id) {
      //   return SimpleMarket.orders(id)
      // })
      // .then(function(order) {
      //   console.log(order)
      //   // assert.equal(order[0], 10000);
      //   // assert.equal(order[1], MkrToken.address);
      //   // assert.equal(order[2], 11000);
      //   // assert.equal(order[3], EthToken.address);
      //   done();
      // })
  // });

});
