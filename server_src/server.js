//@ts-check
const express = require('express');
const bodyParser = require('body-parser');
const RecordsHandler = require('./records_handler');

const PORT = 7331;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);

app.post('/ping', async (req, res) => {
	try {
		//req.body.token
		res.json({result: 'SUCCESS'});
	}
	catch(e) {
		console.error(e);
		res.json({result: 'ERROR'});
	}
});

app.post('/save_result', async (req, res) => {
	try {
		RecordsHandler.reportRecord(req.body);
		res.json({result: 'SUCCESS'});
	}
	catch(e) {
		console.error(e);
		res.json({result: 'ERROR'});
	}
});

app.post('/get_ranking', async (req, res) => {
	try {
		let ranking = RecordsHandler.getRanking();
		let data = [];
		for(let [map_name, records] of ranking)
			data.push({map_name, records});
		res.json({result: 'SUCCESS', data});
	}
	catch(e) {
		console.error(e);
		res.json({result: 'ERROR'});
	}
});

app.listen(PORT, () => console.log(`Server listens on: ${PORT}!`));