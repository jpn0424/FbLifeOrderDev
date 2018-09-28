import React, { Component } from 'react'

import {
    Container,
    Navbar,
    NavbarBrand,
 } from 'reactstrap';

class Header extends Component {
  render() {
    return (
      <Container>
        <Navbar color="light" light expand="md" fixed="true">
          <NavbarBrand href="/">Fb Order PlatForm</NavbarBrand>
            {this.props.children}
          </Navbar>
      </Container>
    );
  }
}

export default Header