import React, { Component } from 'react'
import Eth from 'ethjs'
import '../App.css'

import {
  NETWORK_ID,
} from '../utils/contractDetail.js'

import {
  Row,
  Col
} from 'reactstrap'

class UserWalletID extends Component {
    
  constructor(props) {
    super(props)
    this.state = {
      walletID: 0,
    }
  }

  componentDidMount() {
    this.checkWeb3IntervalId = setInterval(async () => {
      const newState = {}
      try {
        const web3 = window.web3
        newState.web3 = web3
        if (web3) {
          newState.validNetwork = (web3.version.network === NETWORK_ID)
          const eth = new Eth(window.web3.currentProvider)
          const accounts = await eth.accounts()
          const wallet = accounts[0]
          newState.wallet = wallet
          this.setState({walletID: newState.wallet});
          setTimeout(() => {this.props.transferWallID(this.state.walletID)}, 10)
        }
        newState.initialized = true
        this.checkWeb3IntervalId && this.setState({ ...this.state, ...newState })
      } catch (error) {
        newState.web3 = false
        newState.initialized = true
        this.checkWeb3IntervalId && this.setState({ ...this.state, ...newState })
      }
    },1000)
  }

  componentWillUnmount() {
    clearInterval(this.checkWeb3IntervalId)
  }

  render() {
    return (
      <div>
          <Row className='purefont'>
            <Col xs='auto' sm="12" md={{size:'auto'}}>Your ID is:{this.state.walletID}</Col>     
          </Row>
      </div>
    );
  }
}

export default UserWalletID