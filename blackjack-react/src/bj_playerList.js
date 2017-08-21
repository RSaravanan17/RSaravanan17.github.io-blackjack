import React from 'react';
import ReactDOM from 'react-dom';

class PlayerList extends React.Component {
  render() {
    if (this.props.listOfPlayers.length > 0) {
      /*let orderPlayers = [];
      let localPlayers = this.props.listOfPlayers;
      let tempWin = -1;
      let tempIndex = -1;
      while (localPlayers.length > 0) {
        for (var i = 0; i < localPlayers.length; i++) {
          if (localPlayers[i] !== undefined) {
            if (tempWin < localPlayers[i].win) {
              tempWin = localPlayers[i].win;
              tempIndex = i;
            }
          }
        }
        orderPlayers.push({
          un: localPlayers[tempIndex].un,
          win: localPlayers[tempIndex].win,
          loss: localPlayers[tempIndex].loss
        });
        localPlayers.splice(tempIndex, 1);
      }*/
      return (
        <div>
        {
          this.props.listOfPlayers.map((player, i) => {
            return <li key={i} id={player.un}>User: {player.un} | Won: {player.win} | Lost: {player.loss}</li>;
          })
        }
        </div>
      );
    } else {
      return null;
    }
  }
}

export default PlayerList;
