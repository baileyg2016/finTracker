import React, { Component, } from 'react';
import axios from 'axios';

import Graph from './graph.component';
import TransactionList from './transactionList.component';

export default class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            categories: [],
            balance: 0
        };
    }

    componentDidMount() {
        var content = {};
        var categories =[];
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
                    categories.push(txn.category + "|");
                });
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