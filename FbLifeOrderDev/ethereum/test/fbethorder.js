/*
	Mocha, truffle 不能import (不確定是否是BUG)
	測試程式的合約地址會和./bulid中的json描述的部一樣。
	測試程式中 '合約.deployed' 會重新佈署合約。
*/
//import abi from "ethjs-abi"
const abi = require('ethjs-abi');
//import FbEthOrderContract from 'json-loader!../build/contracts/Fbethorder.json'
const FbEthOrderContract = require('../build/contracts/Fbethorder.json');

var Fbethorder = artifacts.require("./Fbethorder.sol");

contract('Fbethorder', function(accounts) {

	var NowAttend = 0;
	
	it("Fborder1 attend activity and send ether", function() {

		var fbownercont;
		var Fborder1 = accounts[1];
		var pAttend;
		
		return Fbethorder.deployed().then(function(instance) {
			fbownercont = instance;
			return fbownercont.sendTransaction({from:Fborder1, value:1000000000000000000});
		}).then(function() {
			return fbownercont.userAmount.call();
		}).then(function(ppAttend) {
			pAttend = ppAttend.toNumber();
		}).then(function() {
			NowAttend++;
			assert.equal(pAttend, NowAttend, "The value is true.");
		});
	});

	it("Fborder2 attend activity and send ether", function() {

		var fbownercont;
		var Fborder2 = accounts[2];
		var pAttend;

		return Fbethorder.deployed().then(function(instance) {
			fbownercont = instance;
			return fbownercont.sendTransaction({from:Fborder2, value:1000000000000000000});
		}).then(function() {
			return fbownercont.userAmount.call();
		}).then(function(ppAttend) {
			pAttend = ppAttend.toNumber();
		}).then(function() {
			NowAttend++;
			assert.equal(pAttend, NowAttend, "The value is true.");
		});
	});

	it("Owner set start time", function() {
		
		var fbownercont;
		var pntimestamp = Date.now()/1000;;
		var pEndTimeFun = FbEthOrderContract.abi.filter(function(name) {
			return name.name === "EndTime";
		});
		
		/* '參數1'要物件 */
		pEndTimeFun = pEndTimeFun[0];
		const setInputBytecode = abi.encodeMethod(pEndTimeFun, [pntimestamp]);
		// console.log(pEndTimeFun);
		// console.log(setInputBytecode);
		
		return Fbethorder.deployed().then(function(instance) {
			fbownercont = instance;
			return fbownercont.sendTransaction({from:accounts[0], data:setInputBytecode, gas: 1000000, gasPrice: 10});
		});		
	});

	it("Fborder attach", function() {

		var fbownercont;
		var pUserAtt = FbEthOrderContract.abi.filter(function(name) {
			return name.name === "Useratt";
		});

		pUserAtt = pUserAtt[0];	
		const setInputBytecode = abi.encodeMethod(pUserAtt,[]);
		// console.log(pUserAtt);
		// console.log(setInputBytecode);

		/* 報到是屬於交易 */
		return Fbethorder.deployed().then(function(instance) {
			fbownercont = instance;
			return fbownercont.sendTransaction({from:accounts[1], data:setInputBytecode, gas: 1000000, gasPrice: 10});
		}).then(function() {
			return fbownercont.sendTransaction({from:accounts[2], data:setInputBytecode, gas: 1000000, gasPrice: 10});
		});	
	});

	it("Owner withdraw", function() {

		var fbownercont;
		var pWithdraw = FbEthOrderContract.abi.filter(function(name) {
			return name.name === "withdraw";
		});

		pWithdraw = pWithdraw[0];
		const setInputBytecode = abi.encodeMethod(pWithdraw,[]);
		// console.log(pWithdraw);
		// console.log(setInputBytecode);

		return Fbethorder.deployed().then(function(instance) {
			fbownercont = instance;
			return fbownercont.sendTransaction({from:accounts[0], data:setInputBytecode, gas: 1000000, gasPrice: 10});
		});	
	});

});