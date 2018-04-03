var request = require('request')

function getPrice (x) {
	request({
		url: "https://blockchain.info/stats?format=json",
		json: true
	}, function(err, res, body) {
		var price = body.market_price_usd;
		var blocks = body.n_blocks_total;
		x(price, blocks);
	});
};

function hello(){
	console.log("hello there");
}


getPrice(function(icecream, y) {
	console.log(icecream);
	console.log(y);
	hello();
});