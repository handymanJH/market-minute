const express = require('express');
const app = express();
const request = require('request');
const bodyparser = require('body-parser');
const moment = require('moment');
const retrieve = require('./retrieveData');



app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(bodyparser.json());
app.set("view engine", "ejs");


//function to simplify large numbers
// function simplify (labelValue) {
// 	// Nine Zeroes for Billions
//     return Math.abs(Number(labelValue)) >= 1.0e+9
//     ? Math.round(Math.abs(Number(labelValue)) / 1.0e+9) + "B"
//     // Six Zeroes for Millions 
//     : Math.abs(Number(labelValue)) >= 1.0e+6
//     ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
//     // Three Zeroes for Thousands
//     : Math.abs(Number(labelValue)) >= 1.0e+3
//     ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

//     : Math.abs(Number(labelValue));
// }


//make current date human readable



//Data Requests//
coinMarketCap();
bitnodes();
bci();
shabang();
corePulseNew();
corePulseClosed();
cryptowatch();

function getData() {
	cryptowatch();
	coinMarketCap();
	bitnodes();
	bci();
	shabang();
	corePulseNew();
	corePulseClosed();
}


var cryptowat_ch = setInterval(cryptowatch, 300000);



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
		btcPrice,
		finPrice,
		lnNodes,
		lnChannels,
		height,
		vol24,
		marketCap,
		nodes,
		cm_price,
		dmaTwoHundred,
		nowHuman,
		txFee24
	});
});

//converter render
app.get('/converter', function(req, res) {
	res.render("converter", {
		btcPrice,
		finPrice
	});
});

//sources render
app.get('/sources', function(req, res) {
	res.render("sources", {
		btcPrice,
		finPrice
	});
});

app.listen(3000, function () {
	console.log('listening on port 3000...');
	
});