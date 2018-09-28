import Eth from 'ethjs'
import Ethabi from 'ethjs-abi'

// 抓該帳戶所有的Trans 或鏈上所有Trans
export function getTransactionsByAccount(web3, myaccount, startBlockNumber, endBlockNumber, blockDetail, walletHistory) {
  
  var pcount = 0
  if (endBlockNumber === null) {
    (() => {web3.eth.getBlockNumber(function(e, r) {
        endBlockNumber = r
        //console.log(endBlockNumber)
      })
    })()
  }

  var checkendBlockNumber = setInterval(() => { 
    if (endBlockNumber != 0) {
      clearInterval(checkendBlockNumber)
      if (startBlockNumber === null) {
        startBlockNumber = (endBlockNumber >= 1000)?endBlockNumber-1000:0
        //console.log("Using startBlockNumber: " + startBlockNumber)
      }     
      for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        if (i % 1000 == 0) {
          console.log("Searching block " + i)
        }
        //var checkEachAlready = setInterval(() => {
            //clearInterval(checkEachAlready)
            web3.eth.getBlock(i, true, function(e, block){      
            if (block != null && block.transactions != null) {
              block.transactions.forEach(function(e) {
                if (myaccount == "*" || myaccount == e.from) {
                  if ( blockDetail == true) {
                    console.log(
                      "   tx hash         : " + e.hash + "\n"
                  //  + "   nonce           : " + e.nonce + "\n"
                  //  + "   blockHash       : " + e.blockHash + "\n"
                    + "   blockNumber     : " + e.blockNumber + "\n"
                  //  + "   transactionIndex: " + e.transactionIndex + "\n"
                    + "   from            : " + e.from + "\n" 
                    + "   to              : " + e.to + "\n"
                  //  + "   value           : " + e.value + "\n"
                  //  + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
                  //  + "   gasPrice        : " + e.gasPrice + "\n"
                  //  + "   gas             : " + e.gas + "\n"
                  //  + "   input           : " + e.input
                    );
                  } else {
                      var pTrans = new Object
                      walletHistory.pTrans.push(pTrans)
                      walletHistory.pTrans[pcount].pTransHash = e.hash
                      walletHistory.pTrans[pcount].pFrom = e.from
                      walletHistory.pTrans[pcount].pTo = e.to
                      pcount++
                      walletHistory.pcount = pcount
                      //console.log(walletHistory.pTrans)
                  }
                }
              })
            }})
        //},1000)
      }
    }
  }, 10)

  var checkwalletHistory = setInterval(() => { 
    if(walletHistory.pTransHash !== 0){
      clearInterval(checkwalletHistory)
    }
  },10)
}

// 抓所有Contract
export function detectAllActitivy(transDetail, contractDetail) {

  const CONTRACT_ABI = require('../../ethereum/build/contracts/Fbethorder.json')
  const eth = new Eth(window.web3.currentProvider)
  var pactivityDetail = []
  var pcount = 0
  for(var i = 0; i < transDetail.length; i++) {
    eth.getTransactionReceipt(transDetail[i].pTransHash).then((receipt) => {
      var pcontractAddress = JSON.stringify(receipt.contractAddress)
      if(pcontractAddress != 'null' && receipt.contractAddress != "0x32cf1f3a98aeaf57b88b3740875d19912a522c1a") {
        var preceipts = JSON.stringify(receipt)
        var object = new Object
        pactivityDetail.push(object)
        pactivityDetail[pcount].contractAddress = JSON.parse(pcontractAddress)
        pactivityDetail[pcount].receipts = JSON.parse(preceipts)
        pcount++
      }
    })
  }

  var check = new Object
  check.pcheck = false
  var pcheck = setInterval(() => {
    if(pactivityDetail.length == pcount) {
      clearInterval(pcheck)
      /*pactivityDetail[pcount].TransHash = transDetail[i].pTransHash
      pactivityDetail[pcount].From = transDetail[i].pFrom
      pactivityDetail[pcount].To = transDetail[i].pTo
      //console.log(pactivityDetail)*/
      check.pcheck = true
    }
  },10)
/*
  for( var i = 0; i < pcount; i++){
    if(pactivityDetail.length == pcount)
    check.pcheck = true
  }*/
  
  var ppcheck = setInterval(() => { 
    if( check.pcheck == true) {
      clearInterval(ppcheck)
      return contractDetail(pactivityDetail)
    }
  },10)
}

// 抓我創造的活動及不是我創造
export function detectMyActitivy(PwalletID, AllTransHash, AllContract, MyContractDetail, OtherContractDetail) {
  const CONTRACT_ABI = require('../../ethereum/build/contracts/Fbethorder.json')
  const eth = new Eth(window.web3.currentProvider)
  var pAllContract = AllContract
  var pAllTransHash = AllTransHash
  var pPwalletID = PwalletID
  pAllTransHash.forEach(function(e){
    if (e.pTo == "0x0" || e.pTo == null) {
      let pTransHash = e.pTransHash
      let pFrom = e.pFrom
      pAllContract.forEach(function(e){
        if(e.receipts.logs[0].transactionHash == pTransHash && pPwalletID == pFrom ) {
          let pMyContractDetail = new Object
          MyContractDetail.push(pMyContractDetail)
          MyContractDetail[MyContractDetail.length-1].contract = e.contractAddress
          MyContractDetail[MyContractDetail.length-1].receipts = e.receipts
          MyContractDetail[MyContractDetail.length-1].From = pFrom
          MyContractDetail[MyContractDetail.length-1].TransHash = pTransHash
        }
        if(e.receipts.logs[0].transactionHash == pTransHash && (e.receipts.logs[0].transactionHash == pTransHash && pPwalletID == pFrom) != true){
          let pOtherContractDetail = new Object
          OtherContractDetail.push(pOtherContractDetail)
          OtherContractDetail[OtherContractDetail.length-1].contract = e.contractAddress
          OtherContractDetail[OtherContractDetail.length-1].receipts = e.receipts
          OtherContractDetail[OtherContractDetail.length-1].From = pFrom
          OtherContractDetail[OtherContractDetail.length-1].TransHash = pTransHash
        }
      })
    } 
  })
}

// 不是我創造 -> 我有參加 及 沒參加
export function detectAttndActitivy(pPwalletID, AllTransHash, OtherContractDetail, MyActivity, AllActivity) {
  const eth = new Eth(window.web3.currentProvider)
  var pAllTransHash = AllTransHash
  var pOtherContractDetail = OtherContractDetail
  
  pOtherContractDetail.forEach((e)=>{
    let pFrom = e.From
    let pContract = e.contract
    let pTransHash = e.TransHash
    let preceipts = e.receipts
    pAllTransHash.forEach((e) =>{
      if(pContract == e.pTo && pPwalletID == e.pFrom){
        let pMyActivity = new Object
        MyActivity.push(pMyActivity)
        MyActivity[MyActivity.length-1].contract = pContract
        MyActivity[MyActivity.length-1].contractFrom = pFrom
        MyActivity[MyActivity.length-1].contractTranshash = pTransHash
        MyActivity[MyActivity.length-1].receipts = preceipts
        MyActivity[MyActivity.length-1].From = e.pFrom
        MyActivity[MyActivity.length-1].To = e.pTo
        MyActivity[MyActivity.length-1].TransHash = e.pTransHash
      }
    })
  })

  if(MyActivity.length == 0){
    pOtherContractDetail.forEach((e) =>{
      let pAllActivity = new Object
      AllActivity.push(pAllActivity)
      AllActivity[AllActivity.length-1].contract = e.contract
      AllActivity[AllActivity.length-1].contractFrom = e.From
      AllActivity[AllActivity.length-1].contractTranshash = e.TransHash
      AllActivity[AllActivity.length-1].receipts = e.receipts
    })
  } else {
    pOtherContractDetail.forEach((e) => {
      let pContract = e.contract
      let pFrom = e.From
      let pTransHash = e.TransHash
      let preceipts = e.receipts
      MyActivity.forEach((e)=>{
        if(pContract != e.contract){
          let pAllActivity = new Object
          AllActivity.push(pAllActivity)
          AllActivity[AllActivity.length-1].contract = pContract
          AllActivity[AllActivity.length-1].contractFrom = pFrom
          AllActivity[AllActivity.length-1].contractTranshash = pTransHash
          AllActivity[AllActivity.length-1].receipts = preceipts
        }
      })
    })
  }
}

export function contractreceipts(contractDetail) {

  const CONTRACT_ABI = require('../../ethereum/build/contracts/Fbethorder.json')
  const eth = new Eth(window.web3.currentProvider)

  var pActivityInfor = CONTRACT_ABI.abi.filter(function(name) {
    return name.name === "ActivityInfor";
  })

  contractDetail.forEach((e)=>{
    e.receiptsResult = new Object
    var a = Ethabi.decodeEvent(pActivityInfor[0],e.receipts.logs[0].data)
    e.receiptsResult.Abstract = a.Abstract
    e.receiptsResult.RegisterDay = a.RegisterDay
    e.receiptsResult.location = a.location
  })  
}
