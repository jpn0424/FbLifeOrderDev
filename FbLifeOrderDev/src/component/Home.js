import React, { Component } from 'react'
import { Link } from "react-router-dom";
import UserWalletID from './UserWalletID'
import QrImg from './QrWallet'

import {
    Container,
    Row,
    Col,
    Button
} from 'reactstrap';

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      PwalletID: 0
    }
  }

  transferWallID(pPwalletID) {
    this.setState({PwalletID : pPwalletID})
  }

  render() {
    return (
      <Container>
        <UserWalletID transferWallID={ pPwalletID => this.transferWallID(pPwalletID)}/>
        <br/>
        <Row>
          <Col>          
            <Button color="primary"><Link to="/SearchActivity">Search Activity</Link></Button>{' '}
          </Col> 
            <br/>
          <Col>
              <Button color="primary"><Link to="/creatActivity">Creat Activity</Link></Button>{' '}
          </Col>
            <br/> 
          <Col>
            <Button color="primary"><Link to="/MyActivity">My Activity</Link></Button>{' '}            
          </Col>
            <br/> 
          <Col>  
            <QrImg walletID={this.state.PwalletID} />
          </Col>
        </Row>      
      </Container>
    );
  }
}

export default Home