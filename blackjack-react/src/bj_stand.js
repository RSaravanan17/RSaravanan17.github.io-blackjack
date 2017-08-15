import React from 'react';
import ReactDOM from 'react-dom';

class Stand extends React.Component {
  render() {
    if (this.props.standStatement) {
      return <li>You took a stand. {this.props.standStatement}</li>;
    } else {
      return null;
    }
  }
}

export default Stand;
