import mcFly from '../dispatcher'
import Immutable from 'immutable'
import $ from 'jquery'
import localforage from 'localforage';
import AppInfoActions from '../actions/appInfoActions';


var defaults = {
  searchQuery: '',
  sortOrder: 'oldest',
  articlesReady: false,
};

var appInfo = Immutable.Map();

localforage.getItem('appInfo', function (err, value) {
  if (!value) {
    value = defaults;
  } else {
    value = JSON.parse(value);
    value = $.extend({}, defaults, value);
  }
  AppInfoActions.updateAppInfo(value);
});

var updateCache = function () {
  // localforage.setItem('appInfo', JSON.stringify(appInfo.toObject()));
  localforage.setItem('appInfo', '');
};

var updateAppInfo = function (newState) {
  var _immutableState = Immutable.fromJS(newState);
  appInfo = appInfo.mergeDeep(_immutableState);
  updateCache();
}

var AppInfoStore = mcFly.createStore({

  getAppInfo: function() {
    return appInfo;
  }

}, function(payload){

  if (payload.actionType === 'UPDATE_APP_STATE') {
    updateAppInfo(payload.appInfo);
    AppInfoStore.emitChange();
  }

  return true;

});



export default AppInfoStore;
