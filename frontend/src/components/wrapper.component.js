import React, { Component, } from 'react';
import axios from 'axios';
import Timeline from 'react-time-line';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Graphs from './graph.component';
// import Loading from './loading.component';


const nav = {
    display: 'inline !important'
};

const navButton = {
    marginRight: '1rem'
};

const leftSide = {
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'auto',
};

const rightSide = {
    float: 'right',
    marginLeft: '350px', 
    justifyContent: 'right',
    position: 'fixed'
};

export default class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.getYesterday = this.getYesterday.bind(this);
        this.getYear = this.getYear.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        this.state = {
            transactions: [],
            categories: {},
            catTime: {},
            labels: [],
            balance: 0,
            loggedIn: false
        };
    }

    getBalance() {
        return axios.get("http://localhost:5000/balance");
    }

    getTransactions() {
        return axios.get("http://localhost:5000/transactions");
    }

    componentDidMount() {
        var balance = 0;
        var categories = new Map();
        var catNumTimes = new Map();
        var trans = [];
        axios.all([this.getBalance(), this.getTransactions()])
            .then(axios.spread((balanceRes, transRes) => {
                // get the balance
                balance = (balanceRes.data.balance.accounts[0].balances.available != null ? 
                    balanceRes.data.balance.accounts[0].balances.available : balanceRes.data.balance.accounts[0].account.balances.current)
                
                // get transaction data
                transRes.data.transactions.transactions.forEach((txn, idx) => {
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

                this.setState({transactions: trans, 
                    balance: balance, 
                    categories: categories, 
                    catTime: catNumTimes,
                    loggedIn: true});  
            })
        )
    }

    getYesterday() {
        console.log("Getting yesterdays info");
        var content = {};
        var categories = new Map();
        var catNumTimes = new Map();
        var trans = [];
        
            axios.get("http://localhost:5000/yesterday", res => {
            console.log("in get request")
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
            console.log(trans)
            if (categories.size > 0 && trans.length > 0) {
                console.log("set state too")
                this.setState({transactions: trans, 
                    balance: content.balance, 
                    categories: categories, 
                    catTime: catNumTimes,
                    loggedIn: true});   
            }
        });
        
        
    }

    getYear() {
        console.log("Getting years info");
        var content = {};
        var categories = new Map();
        var catNumTimes = new Map();
        var trans = [];
        axios.get("http://localhost:5000/transactions/", res => {
            console.log("The res")
            
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
            console.log(trans)
            if (categories.size > 0 && trans.length > 0) {
                console.log("set state too")
                this.setState({transactions: trans, 
                    balance: content.balance, 
                    categories: categories, 
                    catTime: catNumTimes,
                    loggedIn: true});   
            }
        });
        console.log("at the end of the request")
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <div>
                    <div>
                        <Container>
                            <Jumbotron>
                                <ButtonToolbar style={nav}>
                                    <Button style={navButton} onClick={this.getYesterday}>Yesterday</Button>
                                    <Button style={navButton}>Past Week</Button>
                                    <Button style={navButton}>Past Month</Button>
                                    <Button style={navButton}>Past Three Months</Button>
                                    <Button style={navButton} onClick={this.getYear}>Past Year</Button>
                                    <Button style={navButton}>Year to Date</Button>
                                </ButtonToolbar>
                            </Jumbotron>
                        </Container>
                    </div>
                    <div style={leftSide}>
                        <div style={{float: 'left', overflow: 'auto'}}>
                            <Timeline 
                                items={this.state.transactions}
                            />
                        </div>
                        <div style={rightSide}>
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