import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListViewItem from './list_view_item.jsx!';
import ArticleStore from  '../stores/articles';
import AppInfoStore from '../stores/appinfo';
import Router from 'react-router';
import moment from 'moment';

export default React.createClass({
  mixins: [Router.State],
  getArticle: function () {
    return ArticleStore.getArticle(this.getParams().articleId);
  },
  render: function() {
    var formatedDateSaved = moment(this.getArticle().get('date_saved_parsed')).format('ll');
    return (
      <Row className="detailView">
        <Col xs={12}>
          <h1>{this.getArticle().get('title')}</h1>
          <p class='article-meta'>{formatedDateSaved} - {this.getArticle().get('origin').get('url')}</p>
          <hr />
          <div dangerouslySetInnerHTML={{__html: this.getArticle().get('html')}}></div>
        </Col>
      </Row>
    );
  }
});
