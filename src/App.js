import React, { PureComponent } from 'react';
import Dashboard from './containers/Dashboard';
import './App.scss';


class App extends PureComponent {
  render() {
    return (
      <div className="simple-charts-app">
          <Dashboard />
      </div>
    );
  }
}

export default App;
