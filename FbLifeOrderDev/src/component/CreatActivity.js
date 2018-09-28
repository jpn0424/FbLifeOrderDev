import React, { Component } from 'react'
import Eth from 'ethjs'
import UserWalletID from './UserWalletID'

import {
  CONTRACT_ABI,
  CONTRACT_BYTECODE,
  GAS_LIMIT
} from '../utils/contractDetail.js'

import {
  Container,
  Label, 
  Col,
  Input,
  FormGroup,
  Form,
  Row,
  Button
} from 'reactstrap'

/* 
  建立活動合約
  活動相關資訊存在log中
*/
class CreatActivity extends Component {

		constructor(props) {
			super(props)
			this.state = {
        PwalletID: 0,
        ContractAddress : '',
				RegisterTime : '',
				ActivityTime : 0,
				ActivityLocation : '',
				RegisterLimit : 0,
        Abstract : '',
        logs:''
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
    
    /*  Step 1 : 抓取輸入資訊, 
        Step 2 : 建立智能合約   ps.這邊透過當前地址發布合約,所以當前地址是發布者'PWalletID'
        查receipt:
        var log = JSON.stringify(receipt)
        查ABI:
        var pUserAtt = FbEthOrderContract.abi.filter(function(name) {
			  return name.name === "Useratt";
		});
    */
    CreatActivityToChain = async () => {
      var LocalRegisterTime = parseInt(this.state.RegisterTime, 10) - 86400
      const eth = new Eth(window.web3.currentProvider)
      // console.log(this.state.PwalletID)
      await eth.accounts().then((accounts) => {
        const pContractStore = eth.contract(CONTRACT_ABI, CONTRACT_BYTECODE, {
          from: accounts[0],
          gas: GAS_LIMIT,
        })
        // 輸入參數：發起者地址, 人數限制, 開始時間
        pContractStore.new(accounts[0], this.state.RegisterLimit, LocalRegisterTime, this.state.ActivityLocation, this.state.RegisterTime, this.state.Abstract).then(txHash => {
          const CheckTransaction = setInterval( () =>{ 
            eth.getTransactionReceipt(txHash).then( receipt => {
              if(receipt){
                clearInterval(CheckTransaction)
                // 這邊確認完成後可以跳到我的活動頁面 (還沒實現)
                // pContractStore.at(receipt.contractAddress)
                this.setState({ContractAddress:receipt.contractAddress})
                var preceipt = JSON.stringify(receipt.logs)
                console.log(preceipt)
                var plog = receipt.logs[0].data
                plog = JSON.stringify(plog)
                this.setState({logs:plog})
              }
            }
          )},500)
        })
      })
    }
    
    transferWallID(pPwalletID) {
      this.setState({PwalletID : pPwalletID})
    }

    render(){
      return(
        <Container>
        <Row>            
          <UserWalletID transferWallID={PwalletID => this.transferWallID(PwalletID)}/>
          <Form>
            <FormGroup row>
              <Label for="RegisterTime" sm={2}>報名時間</Label>
              <Col sm={10}>
                <Input type="number" name="RegisterTime" id="RegisterTime" placeholder="2018-08-16 24:00" 
                  onChange={this.handleInputChange}/>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="ActivityTime" sm={2}>活動時間（預計）</Label>
              <Col sm={10}>
                <Input type="number" name="ActivityTime" id="ActivityTime" placeholder="UnixTime" 
                  onChange={this.handleInputChange}/>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="ActivityLocation" sm={2}>活動地點</Label>
              <Col sm={10}>
                <Input type="textarea" name="ActivityLocation" id="ActivityLocation" placeholder="ActivityLocation" 
                  onChange={this.handleInputChange}/>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="Register Limit" sm={2}>人數限制</Label>
              <Col sm={10}>
                <Input type="number" name="RegisterLimit" id="RegisterLimit" placeholder="Register Limit" 
                  onChange={this.handleInputChange}/>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="Abstract" sm={50}>活動摘要</Label>
              <Col sm={50}>
                <Input type="textarea" name="Abstract" id="Abstract" 
                  onChange={this.handleInputChange}/>
              </Col>
            </FormGroup>
            <Button color="primary" onClick={this.CreatActivityToChain}>建立活動</Button> {''}
          </Form>
        </Row>
        <Row>					
          <Col> Here Use to check : </Col>
          <Col sm={50}> {this.state.RegisterTime} </Col>
          <Col sm={50}> {this.state.ActivityTime} </Col>
          <Col sm={50}> {this.state.ActivityLocation} </Col>
          <Col sm={50}> {this.state.RegisterLimit} </Col>
          <Col sm={50}> {this.state.Abstract} </Col>
          <Col sm={50}> {this.state.ContractAddress} </Col>
          <Col sm={50}> {this.state.logs} </Col>
        </Row>
        </Container>  
      )   
    }
}

export default CreatActivity