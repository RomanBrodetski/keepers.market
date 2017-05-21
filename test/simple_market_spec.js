var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;

describe("SimpleMarket", function() {
  before(function(done) {
    var contractsConfig = {
      "SimpleMarket": {}
    };
    EmbarkSpec.deployAll(contractsConfig, done);
  });

  it("should be deployed with an empty order book", function(done) {
    SimpleMarket.lastOrderId(function(err, result) {
      assert.equal(result.toNumber(), 100);
      done();
    });
  });

  it("set storage value", function(done) {
    SimpleStorage.set(150, function() {
      SimpleStorage.get(function(err, result) {
        assert.equal(result.toNumber(), 150);
        done();
      });
    });
  });

});
