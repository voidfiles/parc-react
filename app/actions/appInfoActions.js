import mcFly from '../dispatcher';

var AppInfoActions = mcFly.createActions({
  updateAppInfo: function(appInfo) {
    return {
      actionType: 'UPDATE_APP_STATE',
      appInfo: appInfo
    }
  }
});

export default AppInfoActions;
