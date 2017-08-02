import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Login from './bj_login.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null
    };
    this.inputValUn = this.inputValUn.bind(this);
    this.inputValPw = this.inputValPw.bind(this);
  }

  inputValUn({ target }) {
    this.setState({
      username: target.value
    });
  }

  inputValPw({ target }) {
    this.setState({
      password: target.value
    });
  }

  render() {
    return (
      <div id="background" className="App-background">
        <div id="gamePlay" className="App-gamePlay">
          {
          //<script src="https://www.gstatic.com/firebasejs/4.1.3/firebase.js"></script>
          //<script src="blackjack.js"></script>
          }
          <h1><img id="image" className="App-image" src="https://www.gentingcasino.com/images/uploads/games/blackjack.jpg" alt="Blackjack logo" /></h1>
          <h3>
            Username: <input type="text" id="username" onChange={ this.inputValUn } className="App-username"></input>
          </h3>
          <h3>
            Password: <input type="password" id="password" onChange={ this.inputValPw } className="App-password"></input>
          </h3>
          <br/>
          <button id="submit" className="App-submit" type="submit" onClick={() => { ReactDOM.render(<Login un={this.state.username} pw={this.state.password} loggedIn="false"/>, document.getElementById('gameInfo')); }}>Submit</button>
          {
            //<h4 id="sessionId" className="App-sessionId"></h4>
          }
          <ul id="gameInfo" className="App-gameInfo"></ul>
          <div id="hitOrStand" className="App-hitOrStand">
            <p>What move do you want to take?</p>
            <button id="hit" className="App-hit" name="move">Hit</button>
            <button id="stand" className="App-stand" name="move">Stand</button>
          </div>
          <div id="deck" className="App-deck">
            <p>Your Cards:</p>
          </div>
          <button id="playAgain" className="App-playAgain" onClick={() => { ReactDOM.render(<Login un={this.state.username} pw={this.state.password} loggedIn="true"/>, document.getElementById('gameInfo')); }}>Play Again</button>
        </div>
        <div id="users" className="App-users">
          <h3>Players:</h3>
          <ul id="playerList" className="App-playerList"></ul>
        </div>
      </div>
    );
  }
}

export default App;
