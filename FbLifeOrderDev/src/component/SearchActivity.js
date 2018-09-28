import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Web3 from 'web3'
import '../utils/TransParse.js'

import UserWalletID from './UserWalletID'

import {

} from '../utils/contractDetail.js'

import {
	Container,
	Button,
	Row,
	Col,
	Table 
} from 'reactstrap'

import {
	getTransactionsByAccount,
	detectAllActitivy,
	detectMyActitivy,
	detectAttndActitivy,
	contractreceipts
} from '../utils/TransParse.js';

class User extends Component {
  render () {
    const { activity, i } = this.props
    return (
			<Col>
				<div key='2'>
					No : {i+1}
					<Button color="primary"><Link to={{
						pathname:'/SearchActivity/JoinActivity', state:{activity:activity}}}>報名參加</Link>
					</Button>{' '}
				</div>
				<br />
				<div key='3'>報名日期：{activity.receiptsResult.RegisterDay}</div>
				<br />
				<div key='4'>地點：{activity.receiptsResult.location}</div>
				<br />
				<div key='5'>活動資訊：{activity.receiptsResult.Abstract}</div>
				<br />	
			</Col>
    )
  }
}

class User2 extends Component {
  render () {
    const { activity, i } = this.props
    return (
			<Col>
				<div key='2'>
					No : {i+1}
					<Button color="primary"><Link to={{
						pathname:'/SearchActivity/JoinActivity', state:{activity:activity}}}>活動設定</Link>
					</Button>{' '}
				</div>
				<br />
				<div key='3'>報名日期：{activity.receiptsResult.RegisterDay}</div>
				<br />
				<div key='4'>地點：{activity.receiptsResult.location}</div>
				<br />
				<div key='5'>活動資訊：{activity.receiptsResult.Abstract}</div>
				<br />	
			</Col>
    )
  }
}

class SearchActivity extends Component {

	constructor(props) {
		super(props)
		this.state = {
			PwalletID : 0,
			TransHash : [],
			TransTo : [],
			ActivitDetail : [],
			AllActivity : [],
			MyActivity : []
		}
	}

	transferWallID(pPwalletID) {
		this.setState({PwalletID : pPwalletID})
	}

	componentDidMount() {
		var pPwalletID = 0
		var pcount = 0
		var pwalletHistoryDetail = {
			pTrans : [],
			pactivityallContract : [],		// 所有活動合約
			pactivityMyDetail : [],
			pactivityAttachDetail : [],
			pWalletID : 0,
			pcount : 0,
			pMyContract : [],
			pOtherContract : [],
			MyActivity : [],
			AllActivity : []
		}

		var getactivityallDetail = (result) => {
			pwalletHistoryDetail.pactivityallContract = result
		}

		var web3 = new Web3(window.web3.currentProvider)

		var checkPwalletID = setInterval(() => {		// 這個用來確保有錢包地址
			if(this.state.PwalletID !== 0) {																	
				clearInterval(checkPwalletID)
				pPwalletID = this.state.PwalletID
				pwalletHistoryDetail.pWalletID = pPwalletID
				console.log(pPwalletID)
				getTransactionsByAccount(web3, '*', null, null, false, pwalletHistoryDetail)
				var checkTransHash = setInterval(() => {
					if (pwalletHistoryDetail.pTrans.length == pwalletHistoryDetail.pcount && pwalletHistoryDetail.pTrans.length != 0) {						
						if(pcount == 30) {	
							clearInterval(checkTransHash)
							console.log(pwalletHistoryDetail.pTrans)							// 所有傳送
							let pTransLength = pwalletHistoryDetail.pTrans.length
							//console.log(pTransLength)
							detectAllActitivy(pwalletHistoryDetail.pTrans, getactivityallDetail)
							var pcheckactivityDetail = setInterval(() => {
								if(pwalletHistoryDetail.pactivityallContract.length != 0){
									clearInterval(pcheckactivityDetail)
									console.log(pwalletHistoryDetail.pactivityallContract)
									detectMyActitivy(pPwalletID,pwalletHistoryDetail.pTrans,pwalletHistoryDetail.pactivityallContract,pwalletHistoryDetail.pMyContract, pwalletHistoryDetail.pOtherContract)
									//console.log(pwalletHistoryDetail.pMyContract)			// 我建的活動
									//console.log(pwalletHistoryDetail.pOtherContract)	// 不是我建的活動
									detectAttndActitivy(pPwalletID, pwalletHistoryDetail.pTrans, pwalletHistoryDetail.pOtherContract, pwalletHistoryDetail.MyActivity, pwalletHistoryDetail.AllActivity)
									//console.log(pwalletHistoryDetail.MyActivity)			// 有參加
									//console.log(pwalletHistoryDetail.AllActivity)			// 未參加
									//console.log(pwalletHistoryDetail.AllActivity.length)
									if(pwalletHistoryDetail.MyActivity.length != 0) {
										contractreceipts(pwalletHistoryDetail.MyActivity)
										this.setState({
											MyActivity : pwalletHistoryDetail.MyActivity
										})
									}
									if(pwalletHistoryDetail.AllActivity.length != 0) {
										contractreceipts(pwalletHistoryDetail.AllActivity)
										this.setState({
											AllActivity : pwalletHistoryDetail.AllActivity
										})
									}
								}
							},10)
						}
						pcount++
					}
				},30)
				//所有的合約
				/*detectAllActitivy(pwalletHistoryDetail.pTrans.pTransHash, getactivityallDetail)
				if(pwalletHistoryDetail.pactivityallDetail.length !== 0) {
					clearInterval(checkTransHash)
					this.setState({ActivitDetail:pwalletHistoryDetail.pactivityallDetail})
					console.log(pwalletHistoryDetail.pactivityallDetail)
				}	*/
			}
		}, 10)
	}

	render() {
		return(
			<Container>
				<UserWalletID transferWallID={pPwalletID => this.transferWallID(pPwalletID)}/>
				<Row>
					<Col>
						<h1>所有活動 : </h1>
					</Col>
					<Col>
						<div>
							{this.state.AllActivity.map((activity,i) => {
								return (
									<User activity={activity} key={i} i = {i}/>
								)
							})}
						</div>											
					</Col>
					<Col>
						<h1>我的活動 : </h1>
					</Col>
					<Col>
						<div>
							{this.state.MyActivity.map((activity,i) => {
								return (
									<User2 activity={activity} key={i} i = {i}/>
								)
							})}
						</div>											
					</Col>
				</Row>					
			</Container>
		)
	}
}

export default SearchActivity