import React from 'react';
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

var mBarOptions = {
    options: {
        title: {
            display: true,
            text: "Here is how often you spend money at these places: "
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: (value) => {if (value % 1 === 0) {return value;}}
                }
            }]
        }
    }
};

var mDoughnutOptions = {
    options: {
        title: {
            display: true,
            text: 'Current Spending'
        }
    }
};

const Graph = (props) => {
    // constructor(props) {
    //     super(props);
    //     this.randomColor = this.randomColor.bind(this);
    //     this.state = {
    //         doughnutData: {},
    //         barData: {}
    //     };
    // }


    // componentWillReceiveProps() {
    //     var colors = []
    //     for (var i = 0; i < this.props.doughnutValues.length; i++) {
    //         colors.push(this.randomColor());
    //     }
    //     var mDoughnutData = {
    //         labels: this.props.doughnutLabels,
    //         datasets: [{
    //           label: "Your current spending",
    //           backgroundColor: colors,
    //           borderColor: 'rgb(255, 255, 255)',
    //           data: this.props.doughnutValues,
    //           borderWidth: 1
    //         }],
    //         options: {
    //             title: {
    //                 display: true,
    //                 text: 'Current Spending'
    //             }
    //         }
    //     }

    //     var mBarData = {
    //         labels: this.props.barLabels,
    //         datasets: [{
    //             label: "Frequency of Payments",    
    //             backgroundColor: colors,
    //             data: this.props.barValues,
    //             minBarLength: 1
    //         }]
    //     }
    //     this.setState({doughnutData: mDoughnutData, barData: mBarData});
    // }

    
    return (
        <div style={wrapper}>
            <div style={right} >
                <Doughnut
                    width={this.props.width} 
                    height={this.props.height}
                    data={this.props.doughnutData}
                    options={mDoughnutOptions} />
            </div>
            <div style={left} >
                <Bar
                    width={this.props.width} 
                    height={this.props.height}
                    data={this.props.barData}
                    options={mBarOptions} />
            </div>
        </div>
    )
    
}

export default Graph;