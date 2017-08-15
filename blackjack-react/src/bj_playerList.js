import React from 'react';
import ReactDOM from 'react-dom';

class PlayerList extends React.Component {
  render() {
    if (this.props.listOfPlayers.length > 0) {
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
