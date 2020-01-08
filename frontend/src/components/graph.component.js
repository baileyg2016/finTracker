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
        
    }

    render() {
        console.log("cats: " + this.props.categories);
        return (
            <h1>We are getting started</h1>
        );
    }
}