import React from 'react';
import OverlayMixin from 'react-bootstrap/OverlayMixin';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import articleActions from '../actions/articleActions';
import AppInfoStore from '../stores/appinfo';

// Our custom component is managing whether the Modal is visible
var RemoveArticleButton = React.createClass({
  mixins: [OverlayMixin],

  getInitialState: function () {
    return {
      isModalOpen: false
    };
  },

  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  removeArticle: function () {
    articleActions.removeArticle(this.props.story);
    this.handleToggle();
    if (this.props.callback) {
      this.props.callback();
    }
  },
  render: function () {
    return (
      <a className='fa fa-trash fa-fw' title='Remove' onClick={this.handleToggle}></a>
    );
  },

  // This is called by the `OverlayMixin` when this component
  // is mounted or updated and the return value is appended to the body.
  renderOverlay: function () {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    return (
        <Modal title="Do you want to remove this article?" onRequestHide={this.handleToggle}>
          <div className="modal-body">
            Seriously
          </div>
          <div className="modal-footer">
            <Button onClick={this.handleToggle}>Close</Button>
            <Button onClick={this.removeArticle} bsStyle="danger">Remove</Button>
          </div>
        </Modal>
      );
  }
});


export default React.createClass({
  // mixins: [AppInfoStore.mixin],
  storeDidChange: function () {
    return;
  },
  archiveArticle: function () {
    if (this.props.story.get('archived') === false) {
      articleActions.archiveArticle(this.props.story);
    } else {
      articleActions.unArchiveArticle(this.props.story);
    }
  },
  render: function () {
    var bookmarkClass = 'fa fa-fw fa-bookmark-o';
    var bookmarkTitle = 'Bookmark';
    if (this.props.story.get('archived') === true) {
      bookmarkClass = 'fa fa-fw fa-bookmark';
      bookmarkTitle = 'Remove Bookmark';
    }
    return (
      <ul className='list-inline'>
        <li><a className={bookmarkClass} onClick={this.archiveArticle} title={bookmarkTitle}></a></li>
        <li><RemoveArticleButton story={this.props.story} callback={this.props.callback}/></li>
        <li><a className='fa fa-share fa-fw' title='Share'></a></li>
      </ul>
    );
  },
});