import React, { motion, Component } from 'react';

const ballStyle = {
    display: "block",
    width: "1rem",
    height: "1rem",
    backgroundColor: "black",
    borderRadius: "0.5rem"
};

const bounceTransition = {
    y: {
      duration: 0.4,
      yoyo: Infinity,
      ease: "easeOut"
    },
    backgroundColor: {
      duration: 0,
      yoyo: Infinity,
      ease: "easeOut",
      repeatDelay: 0.8
    }
};

const divStyle = {
    width: "2rem",
    height: "2rem",
    display: "flex",
    justifyContent: "space-around"
}

export default class LoadingBall extends Component {
    render () {
        return (<div style={divStyle}>
            <motion
            style={ballStyle}
            transition={bounceTransition}
            animate={{
                y: ["100%", "-100%"],
                backgroundColor: ["#ff6699", "#6666ff"]
            }}
            />
        </div>
        )
    };
}