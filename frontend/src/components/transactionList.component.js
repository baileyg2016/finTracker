import React, { Component } from 'react';
import axios from 'axios';

export default class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          html: {},
          balance: 0,
        };
    }

    componentDidMount() {
        var content = {};
        axios.get("http://localhost:5000/balance").then(res => {
            // res.data.balance.accounts.forEach((account, idx) => {
            //     content 
            //     // content += '<tr>';
            //     // content += '<td>' + account.name + '</td>';
            //     // content += '<td>$' + (account.balances.available != null ? account.balances.available : account.balances.current) + '</td>'
            //     // content += '<td>' + account.subtype + '</td>';
            //     // content += '<td>' + account.mask + '</td>';
            //     // content += '</tr>';
            // });
            content= {account: res.data.balance.accounts[0], 
                balance: (res.data.balance.accounts[0].balances.available != null ? 
                    res.data.balance.accounts[0].balances.available : res.data.balance.accounts[0].account.balances.current),
                transactions: {}};
        }).then(() => {
            var transactions = {};
            var items = [];
            axios.get("http://localhost:5000/transactions").then(res => {
                var i = 0;
                res.data.transactions.transactions.forEach(function(txn, idx) {
                    transactions[i] = {name: txn.name, amount: txn.amount, date: txn.date};
                    items.push({ts: txn.date, text: txn.name + " " + txn.amout});
                    i++;
                });
            })
            content.transactions = transactions;
            this.setState({html: content, balance: content.balance, txs: items});
        }).then( () => {
            
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}