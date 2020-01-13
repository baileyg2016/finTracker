import React, { Component, } from 'react';
import axios from 'axios';

import Graph from './graph.component';
import TransactionList from './transactionList.component';

export default class Wrapper extends Component {
    constructor(props) {
        super(props);
        // this.mapInsert = this.mapInsert.bind(this);
        this.state = {
            transactions: [],
            categories: [{category: "", amount: 0}],
            balance: 0
        };
    }

    // function mapInsert(map, element) {
        
    // }

    componentDidMount() {
        var content = {};
        var categories = new Map();
        axios.get("http://localhost:5000/balance").then(res => {
            content= {account: res.data.balance.accounts[0], 
                balance: (res.data.balance.accounts[0].balances.available != null ? 
                    res.data.balance.accounts[0].balances.available : res.data.balance.accounts[0].account.balances.current),
                transactions: []};
        }).then(() => {
            var transactions = [];
            axios.get("http://localhost:5000/transactions").then(res => {
                res.data.transactions.transactions.forEach(function(txn, idx) {
                    transactions.push({ts: txn.date, text: txn.name, amount: txn.amount, categories: txn.category});
                    if (categories.has(txn.category[0])) {
                        var currAmount = categories.get(txn.category[0]);
                        categories.set(txn.category[0], ++currAmount);
                    }
                    else {
                        categories.set(txn.category[0], 1);
                    }
                });
                // console.log("wrapper: " + categories);
                this.setState({transactions: transactions, balance: content.balance, categories: categories});
            });
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                
                <TransactionList transactions={this.state.transactions} />
                <Graph balance={this.state.balance} categories={this.state.categories} />
            </div>
        );
    }
}