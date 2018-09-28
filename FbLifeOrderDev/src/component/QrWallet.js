import React, { Component } from 'react'
import qrcode from 'qrcode-generator'

import {
  Col
} from 'reactstrap'

class QrImg extends Component {

    constructor(props) {
      super(props)
      this.state = {
        QrCreatData:0
      }
    }
    
    componentDidUpdate() {
      var typeNumber = 4
      var errorCorrectionLevel = 'L'
      var qr = qrcode(typeNumber, errorCorrectionLevel)
      qr.addData(this.props.walletID.toString())
      qr.make()
      document.getElementById('placeHolder').innerHTML = qr.createImgTag()
    }

    render() {
      return (
        <Col id='placeHolder'/>
      );
    }
}

export default QrImg