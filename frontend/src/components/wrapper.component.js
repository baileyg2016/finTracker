import React, { Component, } from 'react';
import axios from 'axios';
import Timeline from 'react-time-line';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Graphs from './graph.component';
import Loading from './loading.component';


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
        this.getBalance = this.getBalance.bind(this);
        this.getTransRequest = this.getTransRequest.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.getYearToDate = this.getYearToDate.bind(this);
        this.state = {
            transactions: [],
            categories: {},
            categoryFreq: {},
            labels: [],
            balance: 0,
            loggedIn: false
        };
    }

    getBalance() {
        return axios.get("http://localhost:5000/balance");
    }

    getTransRequest(days) {
        return axios.get("http://localhost:5000/transactions/" + days);
    }

    getTransactions(transRes) {
        var trans = [];
        var categories = new Map();
        var categoryFreq = new Map();
        var colors = [];
        transRes.data.transactions.transactions.forEach((txn, idx) => {
            trans.push({ts: txn.date, text: txn.name, amount: txn.amount, categories: txn.category});
            
            if (categories.has(txn.category[0])) {
                var currAmount = categories.get(txn.category[0]);
                categories.set(txn.category[0], txn.amount + currAmount);
            }
            else {
                categories.set(txn.category[0], txn.amount);
            }

            if (categoryFreq.has(txn.category[0])) {
                var currTime = categoryFreq.get(txn.category[0]);
                categoryFreq.set(txn.category[0], ++currTime);
            }
            else {
                categoryFreq.set(txn.category[0], 1);
            }
        });
        return {transactions: trans, categories: categories, categoryFreq: categoryFreq, colors: colors};
    }

    componentDidMount() {
        console.log("mounting");
        var balance = 0;
        axios.all([this.getBalance(), this.getTransRequest(30)])
            .then(axios.spread((balanceRes, transRes) => {
                // get the balance
                balance = (balanceRes.data.balance.accounts[0].balances.available != null ? 
                    balanceRes.data.balance.accounts[0].balances.available : balanceRes.data.balance.accounts[0].account.balances.current)
                
                // get transaction data
                var data = this.getTransactions(transRes);
                // var completeData = this.addData(data.categoryFreq, data.transactions);
                this.setState({transactions: data.transactions, 
                    balance: balance, 
                    categoryFreq: data.categoryFreq,
                    categories: data.categories,
                    loggedIn: true});  
            })
        )
    }

    updatePage(days) {
        console.log("updating")
        this.getTransRequest(days).then(res => {
            var data = this.getTransactions(res);
            // var completeData = this.addData(data.categoryFreq, data.transactions);
            this.setState({transactions: data.transactions, 
                balance: this.state.balance, 
                categoryFreq: data.categoryFreq,
                categories: data.categories,
                loggedIn: true});  
        });    
    }

    getYearToDate() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <div>
                    <div>
                        <Container>
                            <Jumbotron>
                                <ButtonToolbar style={nav}>
                                    <Button style={navButton} onClick={() => this.updatePage(2)}>Yesterday</Button>
                                    <Button style={navButton} onClick={() => this.updatePage(7)}>Past Week</Button>
                                    <Button style={navButton} onClick={() => this.updatePage(30)}>Past Month</Button>
                                    <Button style={navButton} onClick={() => this.updatePage(90)}>Past Three Months</Button>
                                    <Button style={navButton} onClick={() => this.updatePage(365)}>Past Year</Button>
                                    <Button style={navButton} onClick={() => this.updatePage(this.getYearToDate())}>Year to Date</Button>
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
                                barLabels={Array.from(this.state.categoryFreq.keys())}
                                barValues={Array.from(this.state.categoryFreq.values())}
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
                <Loading />
            )
        }
    }
}