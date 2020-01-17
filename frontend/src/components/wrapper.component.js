import React, { Component, } from 'react';
import axios from 'axios';

import Graph from './graph.component';
import TransactionList from './transactionList.component';
// import Loading from './loading.component';

const leftSide = {
    display: 'flex',
    flexDirection: 'row'
};

const rightSide = {
    float: 'right',
    marginLeft: '675px', 
    justifyContent: 'right',
    position: 'fixed'
};

export default class Wrapper extends Component {
    constructor(props) {
        super(props);
        // this.mapInsert = this.mapInsert.bind(this);
        this.state = {
            transactions: [],
            categories: {},
            labels: [],
            balance: 0,
            loggedIn: false
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
            var trans = [];
            axios.get("http://localhost:5000/transactions").then(res => {
                res.data.transactions.transactions.forEach(function(txn, idx) {
                    trans.push({ts: txn.date, text: txn.name, amount: txn.amount, categories: txn.category});
                    if (categories.has(txn.category[0])) {
                        var currAmount = categories.get(txn.category[0]);
                        categories.set(txn.category[0], txn.amount + currAmount);
                    }
                    else {
                        categories.set(txn.category[0], txn.amount);
                    }
                });
                if (categories.size > 0 && trans.length > 0) {
                    this.setState({transactions: trans, 
                        balance: content.balance, 
                        categories: categories, 
                        loggedIn: true});   
                }
            });
        }).catch(err => console.log(err));
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <div style={leftSide}>
                    <div style={{float: 'left', overflow: 'auto'}}>
                        <TransactionList 
                            transactions={this.state.transactions}
                        />
                    </div>
                    <div style={rightSide}>
                        <Graph 
                            balance={this.state.balance} 
                            categories={this.state.categories} 
                            labels={Array.from(this.state.categories.keys())}
                            values={Array.from(this.state.categories.values())}
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            );
        }
        else {
            return (
                <h1>We are loading your information</h1>
            )
        }
    }
}