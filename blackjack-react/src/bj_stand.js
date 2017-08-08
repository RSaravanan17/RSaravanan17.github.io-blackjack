import React from 'react';
import ReactDOM from 'react-dom';

class Stand extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerHand: this.props.playerInfo[0],
      playerScore: this.props.playerInfo[1],
      gameOver: this.props.playerInfo[2],
      gameState: this.props.playerInfo[3],
      dealerHit: null,
      fullStatement: null
    };

    this.passingPlayerInfo = this.passingPlayerInfo.bind(this);
  }

  passingPlayerInfo() {
    let playerInfo = [this.state.playerHand, this.state.playerScore, this.state.gameOver, this.state.gameState];
    this.props.callbackPlayerInfo(playerInfo);
  }

  componentWillMount() {
    let url = 'http://52.54.181.235:3000/api/stand?sessId=' + this.props.sessId + '&username=' + this.props.un;
    fetch(url).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
      this.setState({
        gameOver: data.gameOver,
        dealerHit: data.dealerHit,
        gameState: data.gameState,
        fullStatement: data.gameOver ? "The dealer took " + data.dealerHit + " hit(s). The game is over. " + data.gameState : "The dealer took " + data.dealerHit + " hit(s) and then stood. " + data.gameState
      });
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  componentDidMount() {
    this.passingPlayerInfo();
  }

  render() {
    return <li>You took a stand. {this.state.fullStatement}</li>;
  }
}

export default Stand;
