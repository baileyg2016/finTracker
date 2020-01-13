import React, { Component, } from 'react';

export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
          categories: [],
          balance: 0
        };
    }

    componentDidMount() {
        // for (var i in this.props.categories) {
        //     console.log(i);
        // }
    }

    render() {
        var o = Object.fromEntries(this.props.categories);
        console.log(o);
        return (
            <div>
                <h1>Here is your current balance: ${this.props.balance}</h1>
                <h2>Here is a graph of your spending:</h2>
            </div>
        );
    }
}