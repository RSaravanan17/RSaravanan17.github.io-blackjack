import React from 'react';
import ReactDOM from 'react-dom';

class InitGame extends React.Component {
  render() {
    if (this.props.playerHand.length > 0) {
      return <li>Your cards are {JSON.stringify(this.props.playerHand)} and your score is {this.props.playerScore}. {this.props.gameState}</li>;
    } else {
      return null;
    }
  }
}

export default InitGame;
