import React from 'react';
import Router from 'react-router';
import moment from 'moment';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ListViewItem from './list_view_item.jsx!';
import ArticleStore from  '../stores/articles';
import ActionBar from './action_bar.jsx!';
import AppInfoStore from '../stores/appinfo';


export default React.createClass({
  mixins: [Router.State, Router.Navigation, AppInfoStore.mixin],
  getArticle: function () {
    return ArticleStore.getArticle(this.getParams().articleId);
  },
  storeDidChange: function() {
    return;
  },
  onDelete: function () {
    this.transitionTo('articles');
  },
  render: function() {
    var formatedDateSaved = moment(this.getArticle().get('date_saved_parsed')).format('ll');
    return (
      <Row className="detailView">
        <Col xs={12}>
          <h1>{this.getArticle().get('title')}</h1>
          <p class='article-meta'>{formatedDateSaved} - {this.getArticle().get('origin').get('url')}</p>
          <ActionBar story={this.getArticle()} callback={this.onDelete}/>
          <hr />
          <div dangerouslySetInnerHTML={{__html: this.getArticle().get('html')}}></div>
        </Col>
      </Row>
    );
  }
});
