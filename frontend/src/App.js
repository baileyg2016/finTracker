import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

import Info from './components/info.component';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.handleOnExit = this.handleOnExit.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    this.state = {
      loggedIn: false
    };
  }

  // handleClick(res) {
  //   axios.get("http://localhost:5000/transactions").then(res => {
  //     this.setState({ transactions: res.data.transactions });
  //     var html = '<tr><td><strong>Name</strong></td><td><strong>Amount</strong></td><td><strong>Date</strong></td></tr>';
  //     res.data.transactions.transactions.forEach(function(txn, idx) {
  //       // html += '<tr>';
  //       // html += '<td>' + txn.name + '</td>';
  //       // html += '<td>$' + txn.amount + '</td>';
  //       // html += '<td>' + txn.date + '</td>';
  //       // html += '</tr>';
  //       console.log(txn.name + " " + txn.amount + " " + txn.date);
  //     });
  //   });
  // }

  handleOnSuccess(public_token, metadata) {
    // send token to client server
    axios.post("http://localhost:5000/get_access_token", {
      public_token: public_token
    }).then(console.log("You made it in."))
    .then(this.setState({loggedIn: true}))
    .catch(err => console.log(err));

  }
  handleOnExit() {
    // handle the case when your user exits Link
  }
  render() {
    var content;
    if (!this.state.loggedIn) {
      content = <PlaidLink
        clientName="Finance Tracker"
        env="sandbox"
        product={["auth", "transactions"]}
        publicKey="f15bc21748457e1c76cdf0a4692947"
        onExit={this.handleOnExit}
        onSuccess={this.handleOnSuccess}>
        Open Link and connect your bank!
      </PlaidLink>;
    }
    else {
      content = <Info />;
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}
export default App