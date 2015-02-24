import React from 'react';
import Row from 'react-bootstrap/Row';
import ListView from './list_view.jsx!';
import FolderView from './folder_view.jsx!';
import DetailView from './detail_view.jsx!';
import ArticleStore from '../stores/articles';
import Router from 'react-router';
import AppInfoStore from '../stores/appinfo';
import Input from 'react-bootstrap/Input';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Glyphicon from 'react-bootstrap/Glyphicon';
import MenuItem from 'react-bootstrap/MenuItem';
import Button from 'react-bootstrap/Button';
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

    return (
      <div>
        <header>
          <nav className="navbar navbar-default">
            <div className="container">
              <Router.Link to="articles" className="navbar-brand">Parc</Router.Link>
              <form className="navbar-form navbar-right" role="search">
                <div className="form-group">
                  <Input type="Search" onKeyUp={this.onKeyUp} addonBefore={<i className="fa fa-search"></i>} buttonAfter={buttonAfter} />
                  <DropdownButton bsStyle="default" title="Folder"
                                  noCaret onSelect={this.changeFolder}>
                    <MenuItem key="1" eventKey='inbox'>Inbox</MenuItem>
                    <MenuItem key="2" eventKey='archive'>Archive</MenuItem>
                  </DropdownButton>
                </div>
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
    <Route name="articles" path="/" handler={FolderView} />
    <Route name="article" path="/article/:articleId" handler={DetailView} />
  </Route>
);



export default function () {
  // Use this Router.HistoryLocation to enable, pushState
  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });
};


