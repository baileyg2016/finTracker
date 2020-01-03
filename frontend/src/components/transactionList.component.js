import React, { Component, } from 'react';
import axios from 'axios';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


export default class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          transactions: [],
          balance: 0,
          items: [1,2,3]
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
            var transactions = [];
            axios.get("http://localhost:5000/transactions").then(res => {
                res.data.transactions.transactions.forEach(function(txn, idx) {
                    transactions.push({name: txn.name, amount: txn.amount, date: txn.date});
                    // item.push("hey");
                });
                this.setState({transactions: transactions, balance: content.balance});
            });
            
            console.log(transactions)
            console.log("before")
            transactions.map((item) => {
                return console.log("testing: ");
            });
            console.log("after")
        }).catch(err => console.log(err));
    }

    render() {
        console.log("items" + this.state.items);
        var list = this.state.transactions.map((item, id) => {
            return (
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                    date={item.date}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    key={id}
                >
                    <h3 className="vertical-timeline-element-title">{item.name}</h3>
                    <h4 className="vertical-timeline-element-subtitle">${item.amount}</h4>
                </VerticalTimelineElement>
            );
        });
        
        return (
            <VerticalTimeline>
                {list}
            </VerticalTimeline>
        );
    }
}