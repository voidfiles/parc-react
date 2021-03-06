import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import articleActions from '../actions/articleActions';
import Router from 'react-router';
import moment from 'moment';

import ActionBar from './action_bar.jsx!';
// import AppInfoStore from '../stores/appinfo';

var Link = Router.Link;


export default React.createClass({
  getInitialState: function () {
      return {
        hover: false,
      };
  },
  storeDidChange: function () {
    return;
  },
  handleClick: function (event) {
    articleActions.selectArticle(this.props.story);
  },

  shouldComponentUpdate: function(nextProps, nextState, nextContext) {
    var story = !this.props.story || !nextProps.story || this.props.story != nextProps.story;
    var hover = this.state.hover !== nextState.hover;
    return !!(story || hover);
  },
  mouseEnter: function () {
    this.setState({hover: true});
  },
  mouseExit: function () {
    this.setState({hover: false});
  },
  render: function() {
    var divStyle = {cursor:'pointer'};
    var formatedDateSaved = moment(this.props.story.get('date_saved_parsed')).format('ll');
    var rowClassName = 'fade ';
    if (this.state.hover) {
      rowClassName = rowClassName + 'in';

    }

    return (
      <Row onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseExit}>
        <Col xs={12}>
            <div style={divStyle} className='list-view-item'>
              <h3>
                <Link to="article" params={{articleId: this.props.story.get('id')}} className='article'>
                  {this.props.story.get('title')}
                </Link>
              </h3>
              <p class='article-meta'>{formatedDateSaved} - {this.props.story.get('origin').get('url')}</p>
              <div className={rowClassName}>
                <ActionBar story={this.props.story}/>
              </div>
              <hr />
            </div>
        </Col>
      </Row>
    );
  }
});
