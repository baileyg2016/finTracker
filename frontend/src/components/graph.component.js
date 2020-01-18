import React, { Component } from 'react';
import {Doughnut, Bar} from 'react-chartjs-2';

// const container = {
    // background: '#fff',
    // margin: '0 auto',
    // position: 'center',
    // boxShadow: '0 4px 4px',
    // borderTop: 'none',
    // width: '500px',
    // height: '500px'
// };

const wrapper = {
    width: '905px',
    // marginLeft: '150px'
    margin: '0 auto'
}

const left = {
    border: '1px solid white',
    float: 'right',
    // minHeight: '450px',
    color: 'white',
    width: '450px',
}

const right = {
    border: '1px solid white',
    float: 'right',
    // minHeight: '450px',
    color: 'white',
    width: '450px',
}

export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.randomColor = this.randomColor.bind(this);
        this.state = {
            doughnutData: {},
            barData: {}
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
        for (var i = 0; i < this.props.doughnutValues.length; i++) {
            colors.push(this.randomColor());
        }
        var mDoughnutData = {
            labels: this.props.doughnutLabels,
            datasets: [{
              label: "Your current spending",
              backgroundColor: colors,
              borderColor: 'rgb(255, 255, 255)',
              data: this.props.doughnutValues,
              borderWidth: 1
            }],
            options: {
                title: {
                    display: true,
                    text: 'Current Spending'
                }
            }
        }

        var mBarData = {
            labels: this.props.barLabels,
            datasets: [{
                label: "Frequency of Payments",    
                backgroundColor: colors,
                data: this.props.barValues,
                minBarLength: 1
            }],
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
        this.setState({doughnutData: mDoughnutData, barData: mBarData});
    }

    render () {
        return (
            <div style={wrapper}>
                <div style={right} >
                    {/* <h1>this.props.doughnutText} ${this.props.balance</h1> */}
                    <Doughnut
                        width={this.props.width} 
                        height={this.props.height}
                        data={this.state.doughnutData} />
                </div>
                <div style={left} >
                    {/* <h1>this.props.barText</h1> */}
                    <Bar
                        width={this.props.width} 
                        height={this.props.height}
                        data={this.state.barData} />
                </div>
            </div>
        )
    }
}
