import React, { Component } from 'react'
import Eth from 'ethjs'
import Ethabi from 'ethjs-abi'
import '../css/attachactivity.css'
import QrImg from './QrWallet'
import UserWalletID from './UserWalletID'

import {
  CONTRACT_ABI
} from '../utils/contractDetail.js'

import {
	Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'

export class JoinActivity extends Component {
    
  constructor(props) {
    super(props)
    this.state = {
      pActivityDetail : 0,
      pContractAddress : 0
    }
  }

	transferWallID(pPwalletID) {
    this.setState({PwalletID : pPwalletID})
	}
  
  AttachActivity = async () => {
    const eth = new Eth(window.web3.currentProvider)
    var pActivityDetail = this.state.pActivityDetail

    await eth.accounts().then((accounts) => {
      var paccount = accounts[0]
      return paccount
    }).then((paccount) => {
      const transObject = new Object
      transObject.from = paccount
      transObject.to = pActivityDetail.contract
      transObject.value = 1000000000000000000
      transObject.gas = 3000000
      console.log(transObject)
      return eth.sendTransaction({
        from: paccount,
        to: pActivityDetail.contract,
        value: '1000000000000000000',
        gas: '3000000',
        data: '0x',
      })
    }).then((result) => {

    })

  }

  CheckinActivity = async () => {
    const eth = new Eth(window.web3.currentProvider)
    var pActivityDetail = this.state.pActivityDetail
    const CONTRACT_ABI = require('../../ethereum/build/contracts/Fbethorder.json')

    var pUserAtt = CONTRACT_ABI.abi.filter(function(name) {
			return name.name === "Useratt";
		});

		pUserAtt = pUserAtt[0];	
		const setInputBytecode = Ethabi.encodeMethod(pUserAtt,[]);
    
    await eth.accounts().then((accounts) => {
      var paccount = accounts[0]
      return paccount
    }).then((paccount) => {
      return eth.sendTransaction({
        from: paccount,
        to: pActivityDetail.contract,
        gas: 3000000,
        data: setInputBytecode,
        gasPrice: 10
      })
    }).then((result) => {

    })
  }

  componentDidMount() { 
    var pActivityDetail = this.state.pActivityDetail
    console.log(pActivityDetail)
  }

  componentWillMount() {
    var pActivityDetail = this.props.location.state.activity
    this.setState({pActivityDetail:pActivityDetail})
    this.setState({pContractAddress:pActivityDetail.contract})
  }

  render() {
    return (
			<Container>
        <UserWalletID transferWallID={ pPwalletID => this.transferWallID(pPwalletID)}/>
        <br/>
        <Row>
          <Col>
            <Button color="primary" onClick={this.AttachActivity}>參加活動</Button> {''}
          </Col>
            <br/>
          <Col>
            <Button color="primary" onClick={this.CheckinActivity}>報到</Button> {''}
          </Col>
        </Row>      
      </Container>
    )
  }
}

export class SetActivity extends Component {
    
  constructor(props) {
    super(props)
    this.state = {
      PwalletID : 0,
      pContractAddress : 0,
      ActivityStartTime  : 0
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name;
    let value

    switch(target.type) {
      case 'number':
        value = target.value;
        break;
      case 'textarea':
        value = target.value;
        break;
      default :
    }
     
    this.setState({
      [name]: value
    });
  }

	transferWallID(pPwalletID) {
    this.setState({PwalletID : pPwalletID})
	}
  
  startActivity = async () => {
    const eth = new Eth(window.web3.currentProvider)
    const CONTRACT_ABI = require('../../ethereum/build/contracts/Fbethorder.json')
    
		var pEndTimeFun = CONTRACT_ABI.abi.filter(function(name) {
			return name.name === "EndTime";
    });

    if(this.state.ActivityStartTime == 0) {
      this.state.ActivityStartTime = Date.now()/1000
    }

    var pntimestamp = this.state.ActivityStartTime

    pEndTimeFun = pEndTimeFun[0];
		const setInputBytecode = Ethabi.encodeMethod(pEndTimeFun, [pntimestamp]);
    
    eth.accounts().then((accounts) => {
      var paccount = accounts[0]
      return paccount
    }).then((paccount) => {
      return eth.sendTransaction({from:paccount, to:this.state.pContractAddress ,data:setInputBytecode, gas: 1000000, gasPrice: 10});
    }).then((result) => {

    })
  }

  withdraw = async () => {
    const eth = new Eth(window.web3.currentProvider)
    const CONTRACT_ABI = require('../../ethereum/build/contracts/Fbethorder.json')

    var pWithdraw = CONTRACT_ABI.abi.filter(function(name) {
			return name.name === "withdraw";
		});

		pWithdraw = pWithdraw[0];
		const setInputBytecode = Ethabi.encodeMethod(pWithdraw,[]);

    eth.accounts().then((accounts) => {
      var paccount = accounts[0]
      return paccount
    }).then((paccount) => {
      return eth.sendTransaction({from:paccount, to:this.state.pContractAddress ,data:setInputBytecode, gas: 1000000, gasPrice: 10});
    }).then((result) => {

    })

  }

  componentDidMount() { 
    
  }

  componentWillMount() {
    var pActivityDetail = this.props.location.state.activity
    this.setState({pContractAddress:pActivityDetail.contract})
  }

  render() {
    return (
			<Container>
        <UserWalletID transferWallID={ pPwalletID => this.transferWallID(pPwalletID)}/>
        <br/>
        <div>  
          <InputGroup className='input-group'>活動開始時間︰
          <Input type="number" name="ActivityStartTime" id="ActivityStartTime" placeholder="UnixTime" onChange={this.handleInputChange} />
            <InputGroupAddon addonType="prepend">
              <Button onClick={this.startActivity} className="btn btn-secondary">送出</Button>
            </InputGroupAddon>
          </InputGroup> 
          <br/>
          <Button onClick={this.withdraw} className="btn btn-secondary">活動結束</Button>
        </div>  
      </Container>
    )
  }
}
