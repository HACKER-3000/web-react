import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import CookieConsent, { Cookies } from "react-cookie-consent";
import ReactPiwik from 'react-piwik';
import history from './history.js'

import Nav from './common/Nav.js'
import Footer from './common/Footer.js'

import Home from './page/Home.js'
import Impressum from './page/Impressum.js'
import Datenschutz from './page/Datenschutz.js'
import Downloads from './page/Downloads.js';
import FAQ from './page/FAQ.js'
import MitgliedWerden from './page/MitgliedWerden.js';
import Page404 from './page/404.js';

import './App.css';

const piwik = new ReactPiwik({
    url: 'https://matomo.vspace.one',
    siteId: 1,
    trackErrors: true,
    enableLinkTracking: true,
});

class App extends Component {

    constructor(props){
        super(props)

        this.state = {
            spaceapi: [],
            route: ""
        } 
    }

    getInitialState() {
        return {
            route: window.location.hash.substr(1)
        }
    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.setState({
                spaceapi: [],
                route: window.location.hash.substr(1)
            })
        })

        // Repeat status fetch every second
        this.interval = setInterval(() => {
            fetch('/spaceapi.json')
            .then(response => response.json())
            .then(json => {
                this.setState({
                    spaceapi: json,
                    route: window.location.hash.substr(1)
                })                
            })
        }, 30000);
    }

    componentWillUnmount() {
        // Remove interval for fetching state after unmount
        clearInterval(this.interval);
    }

    render() {
        return (
        <Router history={piwik.connectToHistory(history)}>
            <div>
            <Route 
                path="/"                 
                render={routeProps => (
                    <div>
                        <Nav {...routeProps} state={this.state.spaceapi.state}/>
                    </div>
                )} 
            />

            <Switch>
                <Route 
                    path="/" exact 
                    render={routeProps => (
                        <Home {...routeProps} spaceapi={this.state.spaceapi}/>
                    )}  
                />

                <Route 
                    path="/impressum" exact 
                    render={routeProps => (
                        <Impressum {...routeProps} spaceapi={this.state.spaceapi}/>
                    )}  
                />

                <Route 
                    path="/datenschutz" exact 
                    render={routeProps => (
                        <Datenschutz {...routeProps} spaceapi={this.state.spaceapi}/>
                    )}  
                />

                <Route 
                    path="/downloads" exact 
                    render={routeProps => (
                        <Downloads {...routeProps} spaceapi={this.state.spaceapi}/>
                    )}  
                />

                <Route 
                    path="/faq" exact 
                    render={routeProps => (
                        <FAQ {...routeProps} spaceapi={this.state.spaceapi}/>
                    )}  
                />

                <Route 
                    path="/mitgliedwerden" exact 
                    render={routeProps => (
                        <MitgliedWerden {...routeProps} spaceapi={this.state.spaceapi}/>
                    )}  
                />

                <Route
                    component={Page404}/>
            </Switch>
            

            <Route path="/" component={Footer} />

            <CookieConsent
                location="bottom"
                buttonText="Einverstanden"
                declineButtonText="Nicht Einverstanden"
                enableDeclineButton
                cookieName="cookieConsent"
                style={{ background: "#2B373B" }}
                buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                declineButtonStyle={{ fontSize: "13px" }}
            >
                Wir benutzen Cookies um diese Seite schöner zu machen.
                Siehe <Link to="/datenschutz">Datenschutzerklärung</Link>.
            </CookieConsent>

            </div>            
        </Router>
        );
    }
}

export default App;
