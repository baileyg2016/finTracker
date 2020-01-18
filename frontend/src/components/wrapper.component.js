import React, { Component, } from 'react';
import axios from 'axios';
import Timeline from 'react-time-line';

import Graphs from './graph.component';
// import Loading from './loading.component';

const leftSide = {
    display: 'flex',
    flexDirection: 'row'
};

const rightSide = {
    float: 'right',
    marginLeft: '350px', 
    justifyContent: 'right',
    // position: 'fixed'
};

export default class Wrapper extends Component {
    constructor(props) {
        super(props);
        // this.mapInsert = this.mapInsert.bind(this);
        this.state = {
            transactions: [],
            categories: {},
            catTime: {},
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
        var catNumTimes = new Map();
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

                    if (catNumTimes.has(txn.category[0])) {
                        var currTime = catNumTimes.get(txn.category[0]);
                        catNumTimes.set(txn.category[0], ++currTime);
                    }
                    else {
                        catNumTimes.set(txn.category[0], 1);
                    }
                });
                if (categories.size > 0 && trans.length > 0) {
                    this.setState({transactions: trans, 
                        balance: content.balance, 
                        categories: categories, 
                        catTime: catNumTimes,
                        loggedIn: true});   
                }
            }).then(() => {

            });
        }).catch(err => console.log(err));
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <div style={leftSide}>
                    <div style={{float: 'left', overflow: 'auto'}}>
                        <Timeline 
                            items={this.state.transactions}
                        />
                    </div>
                    <div style={rightSide}>
                        <div>
                            
                        </div>
                        <Graphs
                            balance={this.state.balance} 
                            doughnut={this.state.categories}
                            doughnutText={"Here is your current balance:"}
                            doughnutLabels={Array.from(this.state.categories.keys())}
                            doughnutValues={Array.from(this.state.categories.values())}
                            barText={"Here is how often you spend money at these places: "}
                            barLabels={Array.from(this.state.catTime.keys())}
                            barValues={Array.from(this.state.catTime.values())}
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