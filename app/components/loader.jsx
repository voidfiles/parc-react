import React from 'react';
import Spinner from 'react-spinner';

export default React.createClass({
  getInitialState: function () {
    return {
      loading: false
    };
  },
  shouldComponentUpdate: function(nextProps, nextState, nextContext) {
    return this.props.loading != nextProps.loading;
  },
  render: function() {
    if (this.props.loading) {
      return (<Spinner />);
    } else {
      return (<div></div>);
    }
  }
});
