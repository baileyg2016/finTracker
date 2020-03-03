'use strict';

const util = require('util');
var bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const plaid = require('plaid');
const moment = require('moment');
var CategoriesDB = require('./models/categories.model');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// We store the access_token in memory - in production, store it in a secure
// persistent data store
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

app.use(cors());
app.use(bodyParser.json());

// setting up the mongo database
const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log("MongoDB database conenctino established succesfully");
// }).catch((err) => {
//     console.log("Not Connected to Database ERROR! ", err);
// });

// setting up the plaid client
var client = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV],
    {version: '2019-05-29', clientApp: 'Bailey\'s Finanace Tracker'}
);

app.post('/get_access_token', function(request, response) {
    PUBLIC_TOKEN = request.body.public_token;
    console.log("Token: " + PUBLIC_TOKEN);
    client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
        if (error != null) {
            prettyPrintResponse(error);
            return response.json({
                error: error,
            });
        }
        ACCESS_TOKEN = tokenResponse.access_token;
        ITEM_ID = tokenResponse.item_id;
        prettyPrintResponse(tokenResponse);
        response.json({
            access_token: ACCESS_TOKEN,
            item_id: ITEM_ID,
            error: null,
        });
    });
});

app.post('/set_access_token', function(request, response, next) {
    ACCESS_TOKEN = request.body.access_token;
    client.getItem(ACCESS_TOKEN, function(error, itemResponse) {
        response.json({
            item_id: itemResponse.item.item_id,
            error: false,
        });
    });
});

// Retrieve Identity for an Item
// https://plaid.com/docs/#identity
app.get('/identity', function(request, response, next) {
    client.getIdentity(ACCESS_TOKEN, function(error, identityResponse) {
      if (error != null) {
            prettyPrintResponse(error);
                return response.json({
                error: error,
            });
        }
        prettyPrintResponse(identityResponse);
        response.json({error: null, identity: identityResponse});
    });
});

// Retrieve real-time Balances for each of an Item's accounts
// https://plaid.com/docs/#balance
app.get('/balance', function(request, response, next) {
    client.getBalance(ACCESS_TOKEN, function(error, balanceResponse) {
        if (error != null) {
            prettyPrintResponse(error);
            return response.json({
                error: error,
            });
        }
        prettyPrintResponse(balanceResponse);
        response.json({error: null, balance: balanceResponse});
    });
});

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
app.get('/transactions/:days', function(request, response, next) {
    // Pull transactions for the Item for the last 30 days
    var startDate = moment().subtract(request.params.days, 'days').format('YYYY-MM-DD');
    var endDate = moment().format('YYYY-MM-DD');
    client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
        count: 250,
        offset: 0,
    }, function(error, transactionsResponse) {
        if (error != null) {
            prettyPrintResponse(error);
            return response.json({
            error: error
            });
        } else {
            // prettyPrintResponse(transactionsResponse);
            response.json({error: null, transactions: transactionsResponse});
        }
    });
});

app.post('/categories', (req, res) => {
    CategoriesDB.findOneAndUpdate({category: req.body.category}, {$inc: { amount: 1 }}, {new: true, upsert: true})
        .then(() => res.json('Category added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// setting up the server on port 5000
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

var prettyPrintResponse = response => {
    console.log(util.inspect(response, {colors: true, depth: 4}));
};