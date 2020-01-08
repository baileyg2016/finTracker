import React, { Component, } from 'react';
import Timeline from 'react-time-line';


export default class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          transactions: []
        };
    }

    componentDidMount() {
        
    }

    render() {
        // console.log("transaction: " + this.state.transactions.forEach(i => console.log(i)))
        return (
            <Timeline items={this.props.transactions} />
        );
    }
}