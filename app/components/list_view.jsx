import React from 'react';
import Row from 'react-bootstrap/Row';
import ListViewItem from './list_view_item.jsx!';
import ArticleStore from '../stores/articles';
import AppInfoStore from '../stores/appinfo';
import articleActions from '../actions/articleActions';
import InfiniteScroll from 'react-infinite-scroll';
import {ApiClient, client} from '../client';
import Loader from './loader.jsx!';
import $ from 'jquery';

import Input from 'react-bootstrap/Input';
import DropdownButton from 'react-bootstrap/DropdownButton';
import MenuItem from 'react-bootstrap/MenuItem';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

var getState = function() {

    var articles = ArticleStore.getArticles();
    var appInfo = AppInfoStore.getAppInfo();
    articles = articles.sort(function (a, b) {
      return a.get('date_saved_parsed').getTime() - b.get('date_saved_parsed').getTime();
    });

    var searchQuery = appInfo.get('searchQuery');
    if (searchQuery) {
      articles = articles.filter(function (article) {
        return article.get('title').toLowerCase().indexOf(searchQuery) >= 0 || article.get('html').toLowerCase().indexOf(searchQuery) >= 0;
      });
    }

    var folder = appInfo.get('folder') || 'inbox';
    if (folder === 'archive') {
      articles = articles.filter(function (article) {
        return article.get('archived') === true;
      });
    } else {
      articles = articles.filter(function (article) {
        return article.get('archived') === false;
      });
    }

    var sortOrder = appInfo.get('sortOrder') || 'oldest';
    if (sortOrder === 'newest') {
      articles = articles.reverse();
    }

    return {
      articles: articles,
      appInfo: appInfo
    };
}

var lastMeta;

var loadMoreArticles = function () {
  var params = {};
  client.getAllArticles().progress(function (meta, data) {
    lastMeta = meta;
    articleActions.addArticles(data);
  });
};
loadMoreArticles();

export default React.createClass({
  mixins: [ArticleStore.mixin, AppInfoStore.mixin],
  getInitialState: function () {
    var state = getState();

    state.loading = true;
    state.sortOrder = 'oldest';

    return state;
  },
  componentDidMount: function () {
    this.setState({loading: true});
  },
  storeDidChange: function() {
    this.setState(getState());
  },
  shouldComponentUpdate: function(nextProps, nextState, nextContext) {
    if (this.state.loading != nextState.loading) {
      return true;
    }

    if (this.state.sortOrder != nextState.sortOrder) {
      return true;
    }

    return !!(!this.state.articles || !nextState.articles || this.state.articles != nextState.articles);
  },
  render: function() {
    var _this = this;

    var listViewItems = this.state.articles.map(function (story) {
      return <ListViewItem story={story} key={story.get('id')} />;
    });

    listViewItems = listViewItems.toJS();

    return (
      <div>
        {listViewItems}
        <Loader key="loader" loading={this.state.loading} />
      </div>
    );
  }
});
