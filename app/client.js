import $ from 'jquery';

var defaults = {
  apiBase: 'https://glacial-tor-4248.herokuapp.com/api/v1'
};

class ApiClient {
  constructor (opts) {
    opts = opts || {};
    this.opts = $.extend({}, defaults, opts);
  }

  fetch (def) {
    var deferred = $.Deferred();
    var defaultDef = {
      method: 'GET',
    };

    def = $.extend({}, defaultDef, def);

    def.url = this.opts.apiBase + def.url;

    $.ajax(def).success(function (data) {
      deferred.resolve(data.meta, data.data);
    }).error(function (data) {
      deferred.reject(data.meta, data.data);
    });

    return deferred.promise();
  }

  getArticles (params) {
    var defaultParams = {
      count: 20,
    };

    params = $.extend({}, defaultParams, params);
    return this.fetch({
      url: '/articles',
      data: params
    });
  }

  getAllArticles (count) {
    var deferred = $.Deferred();
    var _this = this;

    var inner = function (params) {
      _this.getArticles(params).done(function (meta, data) {
        if (meta.has_more) {
          deferred.notify(meta, data);
          inner({before_id: meta.min_id});
        } else {
          deferred.resolve();
        }
      }).fail(function (meta, data) {
         deferred.reject(meta, data);
      });
    };

    inner({
      count: count || 50
    });

    return deferred.promise();
  }
}


export default ApiClient;

export var client = new ApiClient();
