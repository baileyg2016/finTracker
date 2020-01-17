import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';

const container = {
    background: '#fff',
    // width: '80%',
    margin: '0 auto',
    position: 'center',
    boxShadow: '0 4px 4px',
    borderTop: 'none'
};

export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.randomColor = this.randomColor.bind(this);
        this.state = {
            data: {},
        };
    }

    randomColor() {
        var rgb = [];

        for(var i = 0; i < 3; i++)
            rgb.push(Math.floor(Math.random() * 255));

        return 'rgb('+ rgb.join(',') +')';
    }

    componentDidMount() {
        var colors = []
        for (var i = 0; i < this.props.values.length; i++) {
            colors.push(this.randomColor());
        }
        var data = {
            labels: this.props.labels,
            datasets: [{
              label: "Your current spending",
              backgroundColor: colors,
              borderColor: 'rgb(255, 255, 255)',
              data: this.props.values,
              borderWidth: 1
            }],
            options: {
                title: {
                    display: true,
                    text: 'Current Spending'
                }
            }
        }
        this.setState({data: data});
    }

    render () {
        return (
            <div style={container}>
                <h1>Here is your balance: ${this.props.balance}</h1>
                <Doughnut
                    width={this.props.width} 
                    height={this.props.height}
                    data={this.state.data} />
            </div>
        )
    }
}
