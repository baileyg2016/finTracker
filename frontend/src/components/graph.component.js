import React, { Component } from 'react';
import {Doughnut, Bar} from 'react-chartjs-2';

const wrapper = {
    width: '980px',
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

const barOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                callback: (value) => {if (value % 1 === 0) {return value;}}
            }
        }]
    }
};

export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.randomColor = this.randomColor.bind(this);
        this.getColors = this.getColors.bind(this);
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

    getColors() {
        var colors = [];
        for (var i = 0; i < this.props.doughnutValues.length; i++) {
            colors.push(this.randomColor());
        }
        return colors;
    }

    componentDidMount() {
        var colors = this.getColors();
        
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
            }]
        }
        this.setState({doughnutData: mDoughnutData, barData: mBarData});
    }

    // this runs because the props changed
    componentDidUpdate(prevProps) {
        if (this.props.doughnutValues !== prevProps.doughnutValues ||
            this.props.barValues !== prevProps.barValues) {
                var colors = this.getColors();
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
                    }]
                }
                this.setState({doughnutData: mDoughnutData, barData: mBarData});
        }
    }

    render () {
        return (
            <div style={wrapper}>
                <div style={right} >
                    <Doughnut
                        width={this.props.width} 
                        height={this.props.height}
                        data={this.state.doughnutData} />
                </div>
                <div style={left} >
                    <Bar
                        width={this.props.width} 
                        height={this.props.height}
                        data={this.state.barData}
                        options={barOptions} />
                </div>
            </div>
        )
    }
}
