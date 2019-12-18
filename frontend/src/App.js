import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.handleOnExit = this.handleOnExit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      transactions: []
    };
  }

  handleClick(res) {
    axios.get("http://localhost:5000/transactions").then(res => {
      this.setState({ transactions: res.data });
    }).then(console.log(this.state.transactions));
  }

  handleOnSuccess(public_token, metadata) {
    // send token to client server
    axios.post("http://localhost:5000/get_access_token", {
      public_token: public_token
    }).then(console.log("You made it in.")).catch(err => console.log(err));

  }
  handleOnExit() {
    // handle the case when your user exits Link
  }
  render() {
    return (
      <div>
        <PlaidLink
          clientName="Finance Tracker"
          env="sandbox"
          product={["auth", "transactions"]}
          publicKey="f15bc21748457e1c76cdf0a4692947"
          onExit={this.handleOnExit}
          onSuccess={this.handleOnSuccess}>
          Open Link and connect your bank!
        </PlaidLink>
        <div>
          <button onClick={this.handleClick}>Get Transactions</button>
        </div>
      </div>
    )
  }
}
export default App