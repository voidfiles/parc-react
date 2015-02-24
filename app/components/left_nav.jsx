import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';

var handleSelect = function () {

};

export default React.createClass({
  render: function () {

    return (
      <Nav bsStyle="pills" stacked activeKey={1} onSelect={handleSelect}>
        <NavItem eventKey={1} href="/home">Homw</NavItem>
        <NavItem eventKey={2} title="Item">Archive</NavItem>
        <hr />
        <NavItem eventKey={2} title="Item">Label 1</NavItem>
      </Nav>
    );
  }
});



