import React from 'react';
import ReactDOM from 'react-dom';

class Hit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerHand: this.props.playerInfo[0],
      playerScore: this.props.playerInfo[1],
      gameOver: this.props.playerInfo[2],
      gameState: this.props.playerInfo[3]
    };

    this.passingPlayerInfo = this.passingPlayerInfo.bind(this);
  }

  passingPlayerInfo() {
    let playerInfo = [this.state.playerHand, this.state.playerScore, this.state.gameOver, this.state.gameState];
    this.props.callbackPlayerInfo(playerInfo);
  }

  componentWillMount() {
    let url = 'http://52.54.181.235:3000/api/hit?sessId=' + this.props.sessId + '&username=' + this.props.un;
    fetch(url).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
      /*for (var i = 0; i < data.playerHand.length; i++) {
        this.setState({
          playerHand: this.state.playerHand.push(data.playerHand[i])
        });
      }*/
      var temp = this.state.playerHand.slice();
      temp.push(data.playerHand);
      this.setState({
        playerHand: temp,
        playerScore: data.playerScore,
        gameOver: data.gameOver,
        gameState: data.gameState
      });
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  componentDidMount() {
    this.passingPlayerInfo();
  }

  render() {
    return <li>You took a hit. Your cards are now {JSON.stringify(this.state.playerHand)} and your score is {this.state.playerScore}. {this.state.gameState}</li>;
  }
}

export default Hit;
