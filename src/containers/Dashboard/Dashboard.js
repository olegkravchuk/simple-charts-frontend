import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../Home';
import Header from '../../components/Header';
import './styles.scss';


class Dashboard extends Component {
    render() {
        return (
            <div className="dashboard">
                <Header />
                <Router>
                    <Route exact path="/" component={Home} />
                </Router>
            </div>
        );
    }
}

export default Dashboard;