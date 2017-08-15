import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Login from './bj_login.js';
import InitGame from './bj_initGame.js';
import Hit from './bj_hit.js';
import Stand from './bj_stand.js';
import Deck from './bj_deck.js';
import PlayerList from './bj_playerList.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      playerHand: [],
      playerScore: 0,
      gameOver: null,
      gameState: null,
      sessId: 0,
      listOfPlayers: [],
      correctLogin: false,
      disabled: false,
      hitClicked: false,
      standClicked: false,
      playAgainClicked: false
    };
    this.inputValUn = this.inputValUn.bind(this);
    this.inputValPw = this.inputValPw.bind(this);
    this.setSessId = this.setSessId.bind(this);
    this.setCorrectLogin = this.setCorrectLogin.bind(this);
    this.disableLogin = this.disableLogin.bind(this);
    this.hitClicked = this.hitClicked.bind(this);
    this.standClicked = this.standClicked.bind(this);
    this.resetInfo = this.resetInfo.bind(this);
    this.playAgainClicked = this.playAgainClicked.bind(this);
    this.updatePlayerList = this.updatePlayerList.bind(this);
    this.requestLogin = this.requestLogin.bind(this);
    this.requestInitGame = this.requestInitGame.bind(this);
    this.requestHit = this.requestHit.bind(this);
    this.requestStand = this.requestStand.bind(this);
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

  setSessId(sId) {
    this.setState({
      sessId: sId
    });
  }

  setCorrectLogin(boolLogin) {
    this.setState({
      correctLogin: boolLogin
    });
  }

  disableLogin() {
    this.setState({
      disabled: true
    });
  }

  resetInfo() {
    this.setState({
      playerHand: [],
      playerScore: 0,
      gameOver: null,
      gameState: null,
      sessId: 0
    });
  }

  hitClicked() {
    this.setState({
      hitClicked: true,
      standClicked: false
    });
  }

  standClicked() {
    this.setState({
      standClicked: true,
      hitClicked: false
    });
  }

  playAgainClicked() {
    this.setState({
      playAgainClicked: true,
      hitClicked: false,
      standClicked: false
    });
  }

  updatePlayerList() {
    let that = this;
    let url = 'http://52.54.181.235:3000/api/updatePlayers';
    fetch(url).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
        that.setState({
          listOfPlayers: data.listOfPlayers
        });
      }).catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
      });
  }

  requestLogin() {
    let that = this;
    let url = 'http://52.54.181.235:3000/api/login?username=' + this.state.username + '&password=' + this.state.password;
    fetch(url).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
        if (data.statement !== "") {
          that.setState({
            correctLogin: true,
            currentUn: data.user,
            statement: data.statement,
            sessId: data.sessId
          });
        }
        that.setState({
          loginStatement: that.state.correctLogin ? "Hello " + that.state.currentUn + "! " + that.state.statement + " Press 'Submit' again to begin playing." : "Your password is invalid. Refresh the page and try again."
        });
      }).catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
      });
  }

  requestInitGame() {
    let that = this;
    let url = 'http://52.54.181.235:3000/api/init?sessId=' + this.state.sessId + '&username=' + this.state.username;
    fetch(url).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
      var temp = null;
      temp = data.playerHand;
      that.setState({
        playerHand: temp,
        playerScore: data.playerScore,
        gameOver: data.gameOver,
        gameState: data.gameState
      });
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  requestHit() {
    let that = this;
    let url = 'http://52.54.181.235:3000/api/hit?sessId=' + this.state.sessId + '&username=' + this.state.username;
    fetch(url).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
      var temp = null;
      temp = data.playerHand;
      that.setState({
        playerHand: temp,
        playerScore: data.playerScore,
        gameOver: data.gameOver,
        gameState: data.gameState
      });
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  requestStand() {
    let that = this;
    let url = 'http://52.54.181.235:3000/api/stand?sessId=' + this.state.sessId + '&username=' + this.state.username;
    fetch(url).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
      that.setState({
        gameOver: data.gameOver,
        dealerHit: data.dealerHit,
        gameState: data.gameState,
        standStatement: data.gameOver && data.bust ? "The dealer took " + data.dealerHit + " hit(s) and then busted. " + data.gameState : data.gameOver ? "The dealer took " + data.dealerHit + " hit(s) and then stood. " + data.gameState : null
      });
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  forceUpdate() {
    this.disableLogin();
    this.state.sessId !== 0 && this.requestInitGame();
    this.updatePlayerList();
  }

  render() {
    return (
      <div id="background" className="App-background">
        <div id="gamePlay" className="App-gamePlay">
          <h1><img id="image" className="App-image" src="https://www.gentingcasino.com/images/uploads/games/blackjack.jpg" alt="Blackjack logo" /></h1>
          <h3>
            Username: <input type="text" id="username" value={this.state.username} onChange={this.inputValUn} disabled={this.state.disabled} className="App-username"></input>
          </h3>
          <h3>
            Password: <input type="password" id="password" value={this.state.password} onChange={this.inputValPw} disabled={this.state.disabled} className="App-password"></input>
          </h3>
          <br/>
          <button id="submit" className="App-submit" type="submit" disabled={!(this.state.username && this.state.password) || this.state.playerHand.length > 0} onClick={() => {
            this.requestLogin();
            this.forceUpdate();
          }}>Submit</button>
          <div id="gameInfo" className="App-gameInfo">
            {!this.state.hitClicked && !this.state.standClicked && <Login loginStatement={this.state.loginStatement} />}
            {this.state.playerHand.length < 3 && !this.state.standClicked && <InitGame playerHand={this.state.playerHand} playerScore={this.state.playerScore} gameState={this.state.gameState} />}
            {this.state.hitClicked && <Hit playerHand={this.state.playerHand} playerScore={this.state.playerScore} gameState={this.state.gameState} />}
            {this.state.standClicked && <Stand standStatement={this.state.standStatement} />}
          </div>
          <div id="hitOrStand" className="App-hitOrStand">
            <p>What move do you want to take?</p>
            <button id="hit" className="App-hit" name="move" disabled={(this.state.gameOver || !this.state.correctLogin || !(this.state.playerHand.length > 0))}
            onClick={() => {
              this.hitClicked();
              this.requestHit();
            }}>Hit</button>
            <div className="App-divider" />
            <button id="stand" className="App-stand" name="move" disabled={(this.state.gameOver || !this.state.correctLogin || !(this.state.playerHand.length > 0))}
            onClick={() => {
              this.standClicked();
              this.requestStand();
            }}>Stand</button>
          </div>
          <div id="deck" className="App-deck">
            {this.state.playerHand.length > 0 && <Deck playerHand={this.state.playerHand} />}
          </div>
          <button id="playAgain" className="App-playAgain" disabled={!(this.state.username && this.state.password) || !this.state.gameOver} onClick={() => {
            this.resetInfo();
            this.playAgainClicked();
            this.requestLogin();
            this.forceUpdate();
          }}>Play Again</button>
        </div>
        <div id="users" className="App-users">
          <h3>Players:</h3>
          <ul id="playerList" className="App-playerList">
            <PlayerList listOfPlayers={this.state.listOfPlayers} />
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
