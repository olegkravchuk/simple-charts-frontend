import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../Home';
import CustomChart from '../CustomChart';
import Header from '../../components/Header';
import './styles.scss';


class Dashboard extends Component {
    render() {
        return (
            <div className="dashboard">
                <Router>
                    <div>
                        <Header />
                        <Route exact path="/" component={Home} />
                        <Route path="/custom-chart" component={CustomChart} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default Dashboard;