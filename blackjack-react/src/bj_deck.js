import React from 'react';
import ReactDOM from 'react-dom';

class Deck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerHand: this.props.playerHand
    };
  }

  render() {
    let playerHandcardId = [];
    let playerHandcardColor = [];
    let playerHandcardSymbol = [];
    for (var i = 0; i < this.state.playerHand.length; i++) {
      let cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
      let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

      let rank = this.state.playerHand[i].slice(0, this.state.playerHand[i].indexOf(" "));
      let suit = this.state.playerHand[i].slice(this.state.playerHand[i].lastIndexOf(" ") + 1, this.state.playerHand[i].lastIndexOf(" ") + 2);
      let cardId = rank.toLowerCase() + suit;

      let color = suit === "C" || suit === "S" ? "black" : "red";
      let cardName = cardValues[cardNums.indexOf(rank)];
      let symbol = suit === "C" ? "♣" : suit === "S" ? "♠" : suit === "D" ? "♦" : "♥";

      playerHandcardId.push(cardId);
      playerHandcardColor.push(color);
      playerHandcardSymbol.push(cardName + symbol);
    }
    return (
      <div>
        <p>Your Cards:</p>
        {
          this.state.playerHand.map(function(card, i) {
            return <div key={i} id={playerHandcardId[i]} target={playerHandcardColor[i]}>{playerHandcardSymbol[i]}</div>;
          })
        }
      </div>
    );
  }
}

export default Deck;
