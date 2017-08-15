import React from 'react';
import ReactDOM from 'react-dom';

class Hit extends React.Component {
  render() {
    if (this.props.playerHand.length > 0) {
      return <li>You took a hit. Your cards are now {JSON.stringify(this.props.playerHand)} and your score is {this.props.playerScore}. {this.props.gameState}</li>;
    } else {
      return null;
    }
  }
}

export default Hit;
