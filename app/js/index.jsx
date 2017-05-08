ReactDOM.render(<App alt={"hui"}/>, document.getElementById('root'));


// var Tokens = {
//   ETH: EthToken,
//   XBT: XbtToken
// }

// var Decimals = 6

// console.log(web3.eth.defaultAccount)

// function updateAccountsInfo() {
//   _.values(Tokens).forEach(function(token) {
//     Promise
//       .all([token.symbol(),
//             token.balanceOf(web3.eth.defaultAccount),
//             token.allowance(web3.eth.defaultAccount, KeepersMarket.address)])
//       .then(function(r) {
//         var token = r[0].toString()
//         $(".js-" + token + "-available").val(r[1].toNumber() / Math.pow(10, Decimals))
//         $(".js-" + token + "-allowed").val(r[2].toNumber() / Math.pow(10, Decimals))
//       })
//   })
// }

// function generateOrderHtml(orders, container, pow) {
//   _(orders).each((order) => {
//     let html = $(".js-order-template").clone().removeClass("js-order-template").attr("data-order-id", order.id)
//     html.find(".js-order-volume").html(pow == 1 ? order.demand_amount : order.supply_amount)
//     let price = Math.pow(order.supply_amount / order.demand_amount, pow)
//     html.find(".js-order-price").html(price.toFixed(4)).attr("data-price", price)
//     html.appendTo(container)
//   })
// }

// function updateOrdersInfo() {
//   OrderBook.loadOrders().then((pair) => {
//     $(".js-buy-orders tbody,.js-sell-orders tbody").children().remove()
//     generateOrderHtml(pair[0], $(".js-buy-orders tbody"), 1)
//     generateOrderHtml(pair[1], $(".js-sell-orders tbody"), -1)
//   })
// }

// $(document).on("click", ".js-set-all", function(event) {
//   var token = Tokens[$(event.target).data("token")]
//   var amount = $(event.target).closest(".input-group").find("input[name='set-to-addon']").val()
//   console.log(amount)
//   token.approve(KeepersMarket.address, amount * Math.pow(10, Decimals)).then((r) => {
//     console.log(r)
//     updateAccountsInfo()
//     updateOrdersInfo()
//   })
// })

// $(document).on("change", ".js-update-supply", function(event) {
//   var form   = $(event.target).closest("form")

//   var inverse = form.data("update-supply-invert")

//   var demand = parseFloat(form.find("input[name='" + (inverse ? "supply" : "demand") + "-amount']").val())
//   var price  = parseFloat(form.find("input[name='price']").val())
//   if (!(isNaN(demand) || isNaN(price))) {
//     form.find("input[name='" + (inverse ? "demand" : "supply" )+ "-amount']").val(demand * price);
//   }
// })


// $(document).on("submit", ".js-create-order-form", function(event) {
//   event.preventDefault()

//   var form   = $(event.target).closest("form")
//   var demandAmount = parseFloat(form.find("input[name='demand-amount']").val())
//   var supplyAmount = parseFloat(form.find("input[name='supply-amount']").val())

//   var demandToken = Tokens[form.find("input[name='demand-token']").val()]
//   var supplyToken = Tokens[form.find("input[name='supply-token']").val()]
//   if (!(isNaN(demandAmount) || isNaN(supplyAmount) || !demandToken || !supplyToken)) {
//     KeepersMarket.createLimitOrder(supplyAmount * Math.pow(10, Decimals), supplyToken.address, demandAmount * Math.pow(10, Decimals), demandToken.address).then(function(result){
//       console.log(result)
//       updateOrdersInfo()
//       updateAccountsInfo()
//     })
//   }
// })


// $(document).on("click", ".js-order-execute button", function(event){
//   var tr = $(event.target).closest("tr")
//   var order_id = tr.data("order-id")
//   var amount = parseFloat(tr.find(".js-order-execute-amount").val())
//   console.log(order_id)
//   if(!(isNaN(order_id) || isNaN(amount))) {
//     if (tr.closest("table").hasClass("js-buy-orders")) {
//       amount *= parseFloat(tr.closest("table").find(".js-order-price").data("price"))
//     }
//     console.log(amount)
//     KeepersMarket.executeOrder(order_id, amount * Math.pow(10, Decimals)).then(updateAccountsInfo).then(updateOrdersInfo)
//   }
// })

// $(document).ready(function() {
//   $(".js-cur-address").html(web3.eth.defaultAccount);
//   $(".js-market-address").html(KeepersMarket.address);
//   KeepersMarket.Log({from: web3.eth.accounts}, 'latest').then(function(event) { console.log(event.args.message+ ": "+event.args.value) });
//   updateAccountsInfo();
//   updateOrdersInfo();
// });

// // ===========================
// // Storage (IPFS) example
// // ===========================
// // $(document).ready(function() {
// //   // automatic set if config/storage.json has "enabled": true and "provider": "ipfs"
// //   //EmbarkJS.Storage.setProvider('ipfs',{server: 'localhost', port: '5001'});

// //   $("#storage .error").hide();
// //   EmbarkJS.Storage.ipfsConnection.ping()
// //     .then(function(){
// //         $("#status-storage").addClass('status-online');
// //         $("#storage-controls").show();
// //     })
// //     .catch(function(err) {
// //       if(err){
// //         console.log("IPFS Connection Error => " + err.message);
// //         $("#storage .error").show();
// //         $("#status-storage").addClass('status-offline');
// //         $("#storage-controls").hide();
// //       }
// //   });

// //   $("#storage button.setIpfsText").click(function() {
// //     var value = $("#storage input.ipfsText").val();
// //     EmbarkJS.Storage.saveText(value).then(function(hash) {
// //       $("span.textHash").html(hash);
// //       $("input.textHash").val(hash);
// //     });
// //     addToLog("#storage", "EmbarkJS.Storage.saveText('" + value + "').then(function(hash) { })");
// //   });

// //   $("#storage button.loadIpfsHash").click(function() {
// //     var value = $("#storage input.textHash").val();
// //     EmbarkJS.Storage.get(value).then(function(content) {
// //       $("span.ipfsText").html(content);
// //     });
// //     addToLog("#storage", "EmbarkJS.Storage.get('" + value + "').then(function(content) { })");
// //   });

// //   $("#storage button.uploadFile").click(function() {
// //     var input = $("#storage input[type=file]");
// //     EmbarkJS.Storage.uploadFile(input).then(function(hash) {
// //       $("span.fileIpfsHash").html(hash);
// //       $("input.fileIpfsHash").val(hash);
// //     });
// //     addToLog("#storage", "EmbarkJS.Storage.uploadFile($('input[type=file]')).then(function(hash) { })");
// //   });

// //   $("#storage button.loadIpfsFile").click(function() {
// //     var hash = $("#storage input.fileIpfsHash").val();
// //     var url = EmbarkJS.Storage.getUrl(hash);
// //     var link = '<a href="' + url + '" target="_blank">' + url + '</a>';
// //     $("span.ipfsFileUrl").html(link);
// //     $(".ipfsImage").attr('src', url);
// //     addToLog("#storage", "EmbarkJS.Storage.getUrl('" + hash + "')");
// //   });

// // });

// // // ===========================
// // // Communication (Whisper) example
// // // ===========================
// // $(document).ready(function() {

// //   $("#communication .error").hide();
// //   web3.version.getWhisper(function(err, res) {
// //     if (err) {
// //       $("#communication .error").show();
// //       $("#communication-controls").hide();
// // +     $("#status-communication").addClass('status-offline');
// //     } else {
// //       EmbarkJS.Messages.setProvider('whisper');
// //       $("#status-communication").addClass('status-online');
// //     }
// //   });

// //   $("#communication button.listenToChannel").click(function() {
// //     var channel = $("#communication .listen input.channel").val();
// //     $("#communication #subscribeList").append("<br> subscribed to " + channel + " now try sending a message");
// //     EmbarkJS.Messages.listenTo({topic: [channel]}).then(function(message) {
// //       $("#communication #messagesList").append("<br> channel: " + channel + " message: " + message);
// //     });
// //     addToLog("#communication", "EmbarkJS.Messages.listenTo({topic: ['" + channel + "']}).then(function(message) {})");
// //   });

// //   $("#communication button.sendMessage").click(function() {
// //     var channel = $("#communication .send input.channel").val();
// //     var message = $("#communication .send input.message").val();
// //     EmbarkJS.Messages.sendMessage({topic: channel, data: message});
// //     addToLog("#communication", "EmbarkJS.Messages.sendMessage({topic: '" + channel + "', data: '" + message + "'})");
// //   });

// // });
