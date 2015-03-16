import React from 'react';

import Row from 'react-bootstrap/Row';
import Router from 'react-router';
import Input from 'react-bootstrap/Input';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Glyphicon from 'react-bootstrap/Glyphicon';
import MenuItem from 'react-bootstrap/MenuItem';
import Button from 'react-bootstrap/Button';


import AppInfoStore from '../stores/appinfo';
import ArticleStore from '../stores/articles';

import ListView from './list_view.jsx!';
import DetailView from './detail_view.jsx!';
import AppInfoActions from '../actions/appInfoActions';

var getState = function () {
  return {
    appInfo: AppInfoStore.getAppInfo(),
  };
};

var App = React.createClass({
  mixins: [AppInfoStore.mixin],
  getInitialState: function () {
    return getState();
  },
  onKeyUp: function (event) {
    AppInfoActions.updateAppInfo({
      searchQuery: event.target.value,
    });
  },
  storeDidChange: function() {
    this.setState(getState());
  },
  changeSort: function (selection) {
    AppInfoActions.updateAppInfo({sortOrder: selection});
  },
  changeFolder: function (selection) {
    AppInfoActions.updateAppInfo({folder: selection});
  },
  render: function () {

    var buttonAfter = (
        <DropdownButton bsStyle="default" title="Menu"
                        noCaret onSelect={this.changeSort}>
          <MenuItem key="1" eventKey='oldest'>Sort Oldest First</MenuItem>
          <MenuItem key="2" eventKey='newest'>Sort Newest First</MenuItem>
        </DropdownButton>
    );

    var buttonBeforeTitle = (
      <span><i className="fa fa-search"></i>&nbsp;Parc</span>
    );

    var buttonBefore = (
        <DropdownButton bsStyle="default" title={buttonBeforeTitle}
                        noCaret onSelect={this.changeFolder}>
          <MenuItem key="1" eventKey='inbox'>Inbox</MenuItem>
          <MenuItem key="2" eventKey='archive'>Archive</MenuItem>
        </DropdownButton>
    );

    return (
      <div>
        <header>
          <nav className="navbar navbar-default">
            <div className="container">
              <form className="navbar-form navbar-left" role="search">
                <Input type="Search" onKeyUp={this.onKeyUp} buttonBefore={buttonBefore} />
              </form>
              <form className="navbar-form navbar-right" role="search">
                {buttonAfter}
              </form>
            </div>
          </nav>
        </header>
        <div className="container">
          <Router.RouteHandler/>
        </div>
      </div>
    );
  }
});

var Route = Router.Route;

var routes = (
  <Route handler={App} path="/">
    <Route name="articles" path="/" handler={ListView} />
    <Route name="article" path="/article/:articleId" handler={DetailView} />
  </Route>
);



export default function () {
  // Use this Router.HistoryLocation to enable, pushState
  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });
};


