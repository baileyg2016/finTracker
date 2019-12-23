import React, { Component } from 'react';
import axios from 'axios';

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
          html: ''
        };
    }

    componentDidMount() {
        var content = '<tr><td><strong>Name</strong></td><td><strong>Amount</strong></td><td><strong>Date</strong></td></tr>';
        axios.get("http://localhost:5000/transactions").then(res => {
            res.data.transactions.transactions.forEach(function(txn, idx) {
                content += '<tr>';
                content += '<td>' + txn.name + '</td>';
                content += '<td>$' + txn.amount + '</td>';
                content += '<td>' + txn.date + '</td>';
                content += '</tr>';
                console.log(content);
            });
        }).then( () => {
            console.log(content); 
            this.setState({html: content})
        }).then(console.log(this.state.html));
    }

    render() {
        return (
            <div>
                {this.state.html}
            </div>
        );
    }
}