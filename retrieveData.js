//required includes
const request = require('request');
const bodyparser = require('body-parser');
const moment = require('moment');


//variable declaration

const data = {btcPrice:null,
 finPrice:null,
 days:null,
 dmaTwoHundred:null,
 chainSize:null,
 cmc_data:null,
 cmc_last:null,
 vol24:null,
 marketCap:null,
 cm_price:null,
 bn_data:null,
 last:null,
 nodes:null,
 txFee24:null,
 most_recent:null,
 lnNodes:null,
 lnChannels:null,
 height:null,
 ghData:null,
 ghFirst:null,
 created:null,
 closed:null,
 mayerMultiple:null}

 var transcript = null;

var now = moment();
var nowHuman = moment(now).format("dddd, MMMM Do YYYY");



//async test


//Cryptowatch request
function cryptowatch() {
	request({
	url: "https://api.cryptowat.ch/markets/bitstamp/btcusd/price",
	json: true
},
	function(error, response, body) {
		data.btcPrice = accounting.formatMoney(body.result.price);
		data.finPrice = accounting.formatMoney(body.result.price / 10000);
		console.log("Current price: $" + btcPrice);
});
	request({
	url: "https://api.cryptowat.ch/markets/bitstamp/btcusd/ohlc",
	json: true
},
	function(error, response, body) {
		
		data.days = body.results['86400'];
				
		var sum = 0;
		
		for(var i=1; i<201; i++) {
			aDay = days[days.length-i];
			close = aDay[4];
			sum = sum + close;
			
		};
		data.dmaTwoHundred = accounting.formatMoney(sum/200);
		//console.log(dmaTwoHundred);
	});
};

//CoinmarketCap request
function coinMarketCap() {
	request({
		url: "https://api.coinmarketcap.com/v1/ticker/bitcoin/",
		json: true
	}, 
		function(error, response, body) {
			cmc_data = body;
			data.cmc_last = cmc_data[0];
			data.vol24 = accounting.formatMoney(data.cmc_last['24h_volume_usd']);
			data.marketCap = accounting.formatMoney(data.cmc_last.market_cap_usd);
			data.cm_price = data.cmc_last.price_usd;
	});
};

//Bitnodes request
function bitnodes() {
	request({
		url: "https://bitnodes.earn.com/api/v1/snapshots/",
		json: true
	},
		function(error, response, body) {
			bn_data = body.results;
			last = bn_data[0];
			nodes = last.total_nodes;		
	});
}

//Bitcoin()com request
function bci() {

	request({
		url: "https://charts.bitcoin.com/api/recent",
		json: true
	},
		function(error, response, body) {
			data = body;
			txFee24 = data[1]["fee-rate"];
		}
	);
}

//Shabang request
function shabang() {
	request({
		url: "https://shabang.io/stats.json",
		json: true
	},
	function(error, response, body) {
		data = body;
		most_recent = data[0];
		lnNodes = most_recent.lightning_nodes;
		lnChannels = most_recent.lightning_channels;
		height = most_recent.height;
	});
}

//Bitcoin Github new pull request
function corePulseNew() {
	request({
		url: "https://api.github.com/repos/bitcoin/bitcoin/pulls?state=open?sort=created?page=1&per_page=100",
		json: true,
		headers: {
			'User-Agent': 'https://github.com/handymanJH'
		}
	},
		function(error, response, body) {
			ghData = body;
			ghFirst = ghData[0];
			created = ghFirst.created_at;
			//console.log(githubLast);
			//githubURL = githubLast.url;
			console.log("most recent issue created at " + created);
	});
}

//Bitcoin Github closed request
function corePulseClosed() {
	request({
		url: "https://api.github.com/repos/bitcoin/bitcoin/pulls?state=closed?sort=updated?page=1&per_page=100",
		json: true,
		headers: {
			'User-Agent': 'https://github.com/handymanJH'
		}
	},
		function(error, response, body) {
			ghData = body;
			ghFirst = ghData[0];
			closed = ghFirst.closed_at;
			//console.log(githubLast);
			//githubURL = githubLast.url;
			console.log("most recent issued closed at " + closed);
	});
}

function assembleText() {
	transcript = `You're listening to the Market Minute, a resource from Bottomshelf Bitcoin. \
	Good morning bitcoiners, today is ` +  nowHuman + `The price of bitcoin is ` + data.btcPrice +
	`U.S. dollars, putting the price of a Finney at ` + data.finPrice + `. \ 
	The two hundred day moving average is ` + data.dmaTwoHundred + `, making the Mayer Multiple ` + data.mayerMultiple + `x. \
	Twenty-four hour volume was ` + data.vol24 + `and the market cap is currently ` + data.marketCap `. \
	On the main net, there are currently ` + data.nodes +` active nodes, ` + data.lnNodes + `publically reachable lightning nodes, and ` + data.lnChannels + `lightning channels. \
	Average transaction fees were ` + data.txFee24 + `Satoshis per byte over the last twenty-four hours.`;
}