import React, { Component } from 'react';
import axios from 'axios';

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
          html: '',
          balance: 0
        };
    }

    componentDidMount() {
        var content = '<tr><td><strong>Name</strong></td><td><strong>Amount</strong></td><td><strong>Date</strong></td></tr>';
        axios.get("http://localhost:5000/balance").then(res => {
            res.data.balance.accounts.forEach((account, idx) => {
                content += '<tr>';
                content += '<td>' + account.name + '</td>';
                content += '<td>$' + (account.balances.available != null ? account.balances.available : account.balances.current) + '</td>'
                content += '<td>' + account.subtype + '</td>';
                content += '<td>' + account.mask + '</td>';
                content += '</tr>';
            });
        }).then(() => {
            axios.get("http://localhost:5000/transactions").then(res => {
                res.data.transactions.transactions.forEach(function(txn, idx) {
                    content += '<tr>';
                    content += '<td>' + txn.name + '</td>';
                    content += '<td>$' + txn.amount + '</td>';
                    content += '<td>' + txn.date + '</td>';
                    content += '</tr>';
                    console.log(content);
                });
            })
        }).then( () => {
            console.log(content); 
            this.setState({html: content})
        }).then(console.log(this.state.html));
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.html }}>
                
            </div>
        );
    }
}