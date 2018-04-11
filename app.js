const express = require('express');
const app = express();
const request = require('request');
const bodyparser = require('body-parser');
const moment = require('moment');

app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(bodyparser.json());
app.set("view engine", "ejs");


//function to simplify large numbers
function simplify (labelValue) {
	// Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? Math.round(Math.abs(Number(labelValue)) / 1.0e+9) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

    : Math.abs(Number(labelValue));
}


//make current date human readable
var now = moment();
var nowHuman = moment(now).format("dddd, MMMM Do YYYY");



//Data Requests//

//Cryptowatch price request
function cryptowatch() {
	request({
	url: "https://api.cryptowat.ch/markets/bitstamp/btcusd/price",
	json: true
},
	function(error, response, body) {
		btcPrice = body.result.price;
		finPrice = body.result.price / 10000;
		console.log("Current price: $" + btcPrice);
});
	request({
	url: "https://api.cryptowat.ch/markets/bitstamp/btcusd/ohlc",
	json: true
},
	function(error, response, body) {
		results = body.result;
		days = results['86400'];
				
		var sum = 0;
		
		for(var i=1; i<201; i++) {
			aDay = days[days.length-i];
			close = aDay[4];
			sum = sum + close;
			
		};
		dmaTwoHundred = sum/200;
		//console.log(dmaTwoHundred);
	});
};

cryptowatch();
var cryptowat_ch = setInterval(cryptowatch, 300000);

//Cryptowatch ohlc request


//CoinmarketCap request
request({
	url: "https://api.coinmarketcap.com/v1/ticker/bitcoin/",
	json: true
}, 
	function(error, response, body) {
		cmc_data = body;
		cmc_last = cmc_data[0];
		vol24 = simplify(cmc_last['24h_volume_usd']);
		marketCap = simplify(cmc_last.market_cap_usd);
		cm_price = cmc_last.price_usd;
});

//Bitnodes request
request({
	url: "https://bitnodes.earn.com/api/v1/snapshots/",
	json: true
},
	function(error, response, body) {
		bn_data = body.results;
		last = bn_data[0];
		nodes = last.total_nodes;		
});

//Bitcoin()com request
request({
	url: "https://charts.bitcoin.com/api/recent",
	json: true
},
	function(error, response, body) {
		data = body;
		txFee24 = data[1]["fee-rate"];
	}
);

//Shabang request
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

//Bitcoin Github new pull request
request({
	url: "https://api.github.com/repos/bitcoin/bitcoin/pulls?state=open?sort=created?page=1&per_page=100",
	json: true,
	headers: {
		'User-Agent': 'https://github.com/handymanJH'
	}
},
	function(error, response, body) {
		ghData = body;
		ghfirst = ghData[0];
		created = ghfirst.created_at;
		//console.log(githubLast);
		//githubURL = githubLast.url;
		console.log("most recent issue created at " + created);
});

//Bitcoin Github closed request
request({
	url: "https://api.github.com/repos/bitcoin/bitcoin/pulls?state=closed?sort=updated?page=1&per_page=100",
	json: true,
	headers: {
		'User-Agent': 'https://github.com/handymanJH'
	}
},
	function(error, response, body) {
		ghData = body;
		ghfirst = ghData[0];
		closed = ghfirst.closed_at;
		//console.log(githubLast);
		//githubURL = githubLast.url;
		console.log("most recent issued closed at " + closed);
});


//Render Pages//


//index render
app.get('/', function(req, res) {
	res.render("index", {
		btcPrice: btcPrice,
		finPrice: finPrice,
		lnNodes: lnNodes,
		lnChannels: lnChannels,
		height: height,
		vol24: vol24,
		marketCap: marketCap,
		nodes: nodes,
		cm_price: cm_price,
		dmaTwoHundred: dmaTwoHundred,
		txFee24: txFee24,
		nowHuman:nowHuman
	});
});

//transcript render
app.get('/transcript', function(req, res) {
	res.render("transcript", {
		btcPrice: btcPrice,
		finPrice: finPrice,
		lnNodes: lnNodes,
		lnChannels: lnChannels,
		height: height,
		vol24: vol24,
		marketCap: marketCap,
		nodes: nodes,
		cm_price: cm_price,
		dmaTwoHundred: dmaTwoHundred,
		nowHuman:nowHuman,
		txFee24: txFee24
	});
});

//converter render
app.get('/converter', function(req, res) {
	res.render("converter", {
		btcPrice: btcPrice,
		finPrice: finPrice
	});
});

//sources render
app.get('/sources', function(req, res) {
	res.render("sources", {
		btcPrice: btcPrice,
		finPrice: finPrice
	});
});

app.listen(3000, function () {
	console.log('listening on port 3000...');
	
});