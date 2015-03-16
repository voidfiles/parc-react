import mcFly from '../dispatcher'
import Immutable from 'immutable'
import $ from 'jquery'
import localforage from 'localforage';
import articleActions from '../actions/articleActions';
import {ApiClient, client} from '../utils/client';
import moment from 'moment';

var _articles = Immutable.List();

localforage.getItem('articles', function (err, value) {
  if (!value) {
    return;
  }
  value = JSON.parse(value);
  articleActions.addArticles(value, false);
});

var bumpArticleModTime = function (article) {
  var newTime = moment.utc();
  var date_updated = newTime.toISOString();

  article = article.set('date_updated_parsed', newTime);
  article = article.set('date_updated', date_updated);

  return article;

};

var plumpArticle = function (article) {
  article.date_saved_parsed = moment.utc(article.date_saved);
  article.date_updated_parsed = moment.utc(article.date_updated);
  return article;
};

window.CLEAR_CACHE = function () {
  localforage.setItem('articles', null);
};

var updateCache = function () {
  //localforage.setItem('articles', null);
  localforage.setItem('articles', JSON.stringify(_articles.toArray()));
};

var selectedArticle;

var in_list = [];

var idInList = function (id) {
  return in_list.indexOf(id) >= 0;
};

function addArticle (article) {
  if (article && article.id && idInList(article.id)) {
    return;
  }
  article = plumpArticle(article);
  console.log('Adding article_id', article.id);
  in_list.push(article.id);
  _articles = _articles.push(Immutable.fromJS(article));

  updateCache();
}

function addArticles (articles, syncing) {
  _articles = _articles.withMutations(function (map) {
    $.each(articles, function (i, simple_article) {
      var idIsInList = idInList(simple_article.id);
      var hasId = simple_article && simple_article.id;

      if (idIsInList) {
        return;
      }

      simple_article = plumpArticle(simple_article);
      // Fast Path Just slot that shit in
      if (!idIsInList) {
        in_list.push(simple_article.id);
        map = map.push(Immutable.fromJS(simple_article));
        return;
      }
    });
  });

  if (syncing) {
    $.each(articles, function (i, simple_article) {
      var idIsInList = idInList(simple_article.id);
      var hasId = simple_article && simple_article.id;

      if (idIsInList) {
        return;
      }

      // Slow path, we need to merge two objects
      var current_article = findArticleByArticleID(simple_article.id);
      var immutable_article = Immutable.fromJS(simple_article);
      // The one on the server is more recent then the local copy
      if (immutable_article.get('date_updated_parsed').isBefore(current_article.get('date_updated_parsed'))) {
        return findArticleCommitAction(current_article, function (current_article) {
          return current_article.merge(immutable_article);
        });
      }
    });
  }


  updateCache();
}

function selectArticle (article) {
  selectedArticle = article;
}


function findArticleByArticleID (articleID) {
  var index = _articles.findIndex(function (article, key) {
    return article.get('id') === articleID;
  });
  return _articles.get(index);

};


function findArticleCommitAction(article, action) {
  var articleIndex = _articles.indexOf(article);
  var outerArticle;
  if (articleIndex >= 0) {
    _articles = _articles.update(articleIndex, function (article) {
      article = action(article);
      article = bumpArticleModTime(article);
      outerArticle = article;
      return article;
    });
    updateCache();
    article = outerArticle.toJSON();
    client.saveArticle(article);
  }
}

function archiveArticle (article) {
  return findArticleCommitAction(article, function (_article) {
    return _article.set('archived', true);
  });
}

function unArchiveArticle (article) {
  return findArticleCommitAction(article, function (_article) {
    return _article.set('archived', false);
  });
}

function removeArticle (article) {
  return findArticleCommitAction(article, function (_article) {
    return _article.set('deleted', true);
  });
}


var ArticleStore = mcFly.createStore({

  getArticles: function() {
    return _articles;
  },
  getArticle: function (key) {
    return _articles.findLast(function (article) {
      if (article.get('id') === key) {
        return true;
      } else {
        return false;
      }
    });
  },

  getSelectedArticle: function () {
    return selectedArticle;
  },

}, function(payload){

  if (payload.actionType === 'ADD_ARTICLE') {
    addArticle(payload.article);
    ArticleStore.emitChange();
  } else if (payload.actionType === 'ADD_ARTICLES') {
    addArticles(payload.articles, payload.sync);
    ArticleStore.emitChange();
  } else if (payload.actionType === 'SELECT_ARTICLE') {
    selectArticle(payload.article);
    ArticleStore.emitChange();
  } else if (payload.actionType === 'ARCHIVE_ARTICLE') {
    archiveArticle(payload.article);
    ArticleStore.emitChange();
  } else if (payload.actionType === 'UNARCHIVE_ARTICLE') {
    unArchiveArticle(payload.article);
    ArticleStore.emitChange();
  } else if (payload.actionType === 'REMOVE_ARTICLE') {
    removeArticle(payload.article);
    ArticleStore.emitChange();
  }

  return true;

});

export default ArticleStore;
