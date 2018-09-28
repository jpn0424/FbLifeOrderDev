import React, { Component } from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import {
  BrowserRouter as Router,
  Route,
  Switch 
} from 'react-router-dom'

import Header from './component/Header'
import Home from './component/Home'
import CreatActivity from './component/CreatActivity'
import MyActivity from './component/MyActivity'
import SearchActivity from './component/SearchActivity'
import {
  JoinActivity,
  SetActivity 
} from './component/AttachActivity'


class App extends Component {   
   
  constructor(props) {
    super(props) 
    this.state = {

		}
  }
  
  render() {
    return (
    <Router>
      <div>
        <Header />
        <Switch>           
          <Route path="/" exact component={Home} />
          <Route path="/creatActivity" component={CreatActivity} />
          <Route path="/MyActivity" exact component={MyActivity} />
          <Route path="/SearchActivity" exact component={SearchActivity} />
          <Route path="/SearchActivity/JoinActivity" component={JoinActivity} />
          <Route path="/MyActivity/SetActivity" component={SetActivity} />
        </Switch>
      </div>      
    </Router>
    ); 
  }
}

export default App
