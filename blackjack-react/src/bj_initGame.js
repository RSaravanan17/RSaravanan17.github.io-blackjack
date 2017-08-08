import React from 'react';
import ReactDOM from 'react-dom';

class InitGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerHand: [],
      playerScore: null,
      gameOver: null,
      gameState: null
    };

    this.passingPlayerInfo = this.passingPlayerInfo.bind(this);
  }

  passingPlayerInfo() {
    let playerInfo = [this.state.playerHand, this.state.playerScore, this.state.gameOver, this.state.gameState];
    this.props.callbackPlayerInfo(playerInfo);
  }

  componentWillMount() {
    let url = 'http://52.54.181.235:3000/api/init?sessId=' + this.props.sessId + '&username=' + this.props.un;
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

    /*let cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
    var deck = [];
    for (var i = 0; i < cardNums.length; i++) {
      deck.push(cardNums[i] + " of Clubs");
      deck.push(cardNums[i] + " of Spades");
      deck.push(cardNums[i] + " of Diamonds");
      deck.push(cardNums[i] + " of Hearts");
    }
    var index = Math.floor(Math.random() * deck.length);
    var card1 = deck[index];
    deck.splice(index, 1);
    index = Math.floor(Math.random() * deck.length);
    var card2 = deck[index];
    deck.splice(index, 1);
    this.setState({
      playerHand: [card1, card2],
      playerScore: 99,
      gameOver: false,
      gameState: "qwerty"
    });*/
  }

  componentDidMount() {
    this.passingPlayerInfo();
  }

  render() {
    return <li>Your cards are {JSON.stringify(this.state.playerHand)} and your score is {this.state.playerScore}. {this.state.gameState}</li>;
  }
}

export default InitGame;