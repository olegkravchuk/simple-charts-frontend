import React, { Component } from 'react';
import Dashboard from './containers/Dashboard';
import './App.scss';


class App extends Component {
  render() {
    return (
      <div className="simple-charts-app">
          <Dashboard />
      </div>
    );
  }
}

export default App;
