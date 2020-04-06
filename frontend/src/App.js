import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

import Wrapper from './components/wrapper.component';

const style = {
  height: '30px',
  width: '200px',
  left: '50%',
  top: '50%',
  marginTop: '-15px',
  marginLeft: '-100px',
  position: 'fixed'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.handleOnExit = this.handleOnExit.bind(this);
    this.state = {
      loggedIn: false
    };
  }

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
        style={style}
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
      content = <Wrapper test="hello" />
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}
export default App