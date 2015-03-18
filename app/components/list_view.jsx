import React from 'react';

import $ from 'jquery';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll';

import Row from 'react-bootstrap/Row';
import Input from 'react-bootstrap/Input';
import DropdownButton from 'react-bootstrap/DropdownButton';
import MenuItem from 'react-bootstrap/MenuItem';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import {ApiClient, client} from '../utils/client';
import Loader from './loader.jsx!';
import ListViewItem from './list_view_item.jsx!';
import ArticleStore from '../stores/articles';
import AppInfoStore from '../stores/appinfo';
import articleActions from '../actions/articleActions';
import syncManager from '../utils/sync';

var getState = function() {

    var articles = ArticleStore.getArticles();
    var appInfo = AppInfoStore.getAppInfo();
    articles = articles.sort(function (a, b) {
      return a.get('date_saved_parsed').utc().valueOf() - b.get('date_saved_parsed').utc().valueOf();
    });

    var searchQuery = appInfo.get('searchQuery');
    if (searchQuery) {
      articles = articles.filter(function (article) {
        return article.get('title').toLowerCase().indexOf(searchQuery) >= 0 || article.get('html').toLowerCase().indexOf(searchQuery) >= 0;
      });
    }

    var folder = appInfo.get('folder') || 'inbox';
    articles = articles.filter(function (article) {
      return article.get('deleted') === false;
    });
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
};

var lastMeta;

if (!syncManager.isSyncing()) {
  var lastSync = syncManager.lastSyncTime();
  var sync = syncManager.sync();
  if (!sync) {
    console.log("Sync manager is locked");
  }

  sync.progress(function (meta, data) {
    // We are adding articles, and this is a sync operation
    if (data) {
      articleActions.addArticles(data, true);
    }
  }).done(function () {
    var lastSyncDate = moment.utc(lastSync);
    ArticleStore.getArticles().filter(function (article) {
      if (article.get('date_updated_parsed').isBefore(lastSyncDate)) {
        console.log('Trying to update an article');
        //client.saveArticle(article.toJSON());
      }
    });
  });
}

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
    console.log("Comparing app state", this.state.appInfo);
    if (this.state.appInfo.get('articlesReady') !== nextState.appInfo.get('articlesReady')) {
      return true;
    }

    return !!(!this.state.articles || !nextState.articles || this.state.articles != nextState.articles);
  },
  render: function() {
    var _this = this;
    var listViewItems = '';
    if (this.state.appInfo.get('articlesReady')) {
      listViewItems = this.state.articles.map(function (story) {
        return <ListViewItem story={story} key={story.get('id')} />;
      });

      listViewItems = listViewItems.toJS();
    }

    return (
      <div>
        {listViewItems}
        <Loader key="loader" loading={this.state.loading} />
      </div>
    );
  }
});
