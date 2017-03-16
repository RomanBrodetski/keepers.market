var Tokens = {
  ETH: EthToken,
  XBT: XbtToken
}

function updateAccountsInfo() {
  $(".js-wallet-info").children().remove()
  web3.eth.accounts.slice(0,3).forEach(function(address){
    var info = $(".js-wallet-info-template").clone().removeClass("hide js-wallet-info-template").addClass("js-address-" + address)
    info.find(".js-address").html(address)
    info.appendTo(".js-wallet-info")
    Object.values(Tokens).forEach(function(token) {
      Promise
        .all([token.symbol(),
              token.balanceOf(address),
              token.allowance(address, SimpleMarket.address)])
        .then(function(r) {
          var li = $(".js-token-info-template").clone().removeClass("hide js-token-info-template")
          li.find(".js-token").html(r[0].toString())
          li.find(".js-token-amount").html(r[1].toNumber())
          li.find(".js-token-all").html(r[2].toNumber())
          if (address == web3.eth.defaultAccount) {
            li.find(".js-set-all").removeClass("hide").attr("data-address", address).data("token", r[0].toString())
          }
          li.appendTo($(".js-address-" + address).find("ul"))
        })
    })
  })
}

function updateOrdersInfo() {
  $(".js-buy-orders,.js-sell-orders").children().remove()
  SimpleMarket.last_order_id().then(function(last_order_id) {
    console.log(last_order_id)
    Promise
      .all(Array.apply(null, {length: last_order_id}).map(Number.call, Number).map(function(id){
          SimpleMarket.orders(id)
        }))
      .then(function(orders){
        debugger
        Console.log(orders)
      })
  })
}

$(document).on("click", ".js-set-all a", function(event) {
  var token = Tokens[$(event.target).closest("span").data("token")]
  var amount = $(event.target).closest("span").find("input").val()
  token.approve(SimpleMarket.address, amount).then(function(r){
    console.log(r)
    updateAccountsInfo()
    updateOrdersInfo()
  })
})

$(document).on("change", ".js-update-supply", function(event) {
  var form   = $(event.target).closest("form")
  var demand = parseFloat(form.find("input[name='demand-amount']").val())
  var price  = parseFloat(form.find("input[name='price']").val())

  if (!(isNaN(demand) || isNaN(price))) {
    form.find("input[name='supply-amount']").val(demand * price);
  }
})


$(document).on("submit", ".js-create-order-form", function(event) {
  event.preventDefault()
  event.stopPropagation();
  var form   = $(event.target).closest("form")
  var demandAmount = parseFloat(form.find("input[name='demand-amount']").val())
  var supplyAmount = parseFloat(form.find("input[name='supply-amount']").val())

  var demandToken = Tokens[form.find("input[name='demand-token']").val()]
  var supplyToken = Tokens[form.find("input[name='supply-token']").val()]

  if (!(isNaN(demandAmount) || isNaN(supplyAmount) || !demandToken || !supplyToken)) {
    SimpleMarket.createOrder(supplyAmount, supplyToken.address, demandAmount, demandToken.address).then(function(result){
      console.log(result)
    })
  }
})


$(document).ready(function() {
  $(".js-cur-address").html(web3.eth.defaultAccount);
  $(".js-market-address").html(SimpleMarket.address);

  updateAccountsInfo();
  updateOrdersInfo();
});

// ===========================
// Storage (IPFS) example
// ===========================
// $(document).ready(function() {
//   // automatic set if config/storage.json has "enabled": true and "provider": "ipfs"
//   //EmbarkJS.Storage.setProvider('ipfs',{server: 'localhost', port: '5001'});

//   $("#storage .error").hide();
//   EmbarkJS.Storage.ipfsConnection.ping()
//     .then(function(){
//         $("#status-storage").addClass('status-online');
//         $("#storage-controls").show();
//     })
//     .catch(function(err) {
//       if(err){
//         console.log("IPFS Connection Error => " + err.message);
//         $("#storage .error").show();
//         $("#status-storage").addClass('status-offline');
//         $("#storage-controls").hide();
//       }
//   });

//   $("#storage button.setIpfsText").click(function() {
//     var value = $("#storage input.ipfsText").val();
//     EmbarkJS.Storage.saveText(value).then(function(hash) {
//       $("span.textHash").html(hash);
//       $("input.textHash").val(hash);
//     });
//     addToLog("#storage", "EmbarkJS.Storage.saveText('" + value + "').then(function(hash) { })");
//   });

//   $("#storage button.loadIpfsHash").click(function() {
//     var value = $("#storage input.textHash").val();
//     EmbarkJS.Storage.get(value).then(function(content) {
//       $("span.ipfsText").html(content);
//     });
//     addToLog("#storage", "EmbarkJS.Storage.get('" + value + "').then(function(content) { })");
//   });

//   $("#storage button.uploadFile").click(function() {
//     var input = $("#storage input[type=file]");
//     EmbarkJS.Storage.uploadFile(input).then(function(hash) {
//       $("span.fileIpfsHash").html(hash);
//       $("input.fileIpfsHash").val(hash);
//     });
//     addToLog("#storage", "EmbarkJS.Storage.uploadFile($('input[type=file]')).then(function(hash) { })");
//   });

//   $("#storage button.loadIpfsFile").click(function() {
//     var hash = $("#storage input.fileIpfsHash").val();
//     var url = EmbarkJS.Storage.getUrl(hash);
//     var link = '<a href="' + url + '" target="_blank">' + url + '</a>';
//     $("span.ipfsFileUrl").html(link);
//     $(".ipfsImage").attr('src', url);
//     addToLog("#storage", "EmbarkJS.Storage.getUrl('" + hash + "')");
//   });

// });

// // ===========================
// // Communication (Whisper) example
// // ===========================
// $(document).ready(function() {

//   $("#communication .error").hide();
//   web3.version.getWhisper(function(err, res) {
//     if (err) {
//       $("#communication .error").show();
//       $("#communication-controls").hide();
// +     $("#status-communication").addClass('status-offline');
//     } else {
//       EmbarkJS.Messages.setProvider('whisper');
//       $("#status-communication").addClass('status-online');
//     }
//   });

//   $("#communication button.listenToChannel").click(function() {
//     var channel = $("#communication .listen input.channel").val();
//     $("#communication #subscribeList").append("<br> subscribed to " + channel + " now try sending a message");
//     EmbarkJS.Messages.listenTo({topic: [channel]}).then(function(message) {
//       $("#communication #messagesList").append("<br> channel: " + channel + " message: " + message);
//     });
//     addToLog("#communication", "EmbarkJS.Messages.listenTo({topic: ['" + channel + "']}).then(function(message) {})");
//   });

//   $("#communication button.sendMessage").click(function() {
//     var channel = $("#communication .send input.channel").val();
//     var message = $("#communication .send input.message").val();
//     EmbarkJS.Messages.sendMessage({topic: channel, data: message});
//     addToLog("#communication", "EmbarkJS.Messages.sendMessage({topic: '" + channel + "', data: '" + message + "'})");
//   });

// });
