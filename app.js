const express = require('express');
const app = express();
const request = require('request');
const bodyparser = require('body-parser');

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
var today = new Date();
var daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January', 'February','March','April','May','June','July','August','September','October','November','December'];
                  
var thisDay = daysOfWeek[today.getDay()];
var thisMonth = months[today.getMonth()];
var thisDate = today.getDate();
var thisYear = today.getFullYear();
var thisFullDate = thisDay + ', ' + thisMonth + ' ' + thisDate + ', ' + thisYear;


//Cryptowatch price request
request({
	url: "https://api.cryptowat.ch/markets/bitstamp/btcusd/price",
	json: true
},
	function(error, response, body) {
		btcPrice = body.result.price;
		finPrice = body.result.price / 10000
});

//Cryptowatch ohlc request
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
		console.log(dmaTwoHundred);
	});

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
		today: today

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
		// thisYear: thisYear,
		// thisDate: thisDate,
		// thisDay: thisDay,
		// thisMonth: thisMonth,
		thisFullDate: thisFullDate
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