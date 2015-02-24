import mcFly from '../dispatcher'
import Immutable from 'immutable'
import $ from 'jquery'
import localforage from 'localforage';
import articleActions from '../actions/articleActions';

var _articles = Immutable.List();

localforage.getItem('articles', function (err, value) {
  if (!value) {
    return;
  }
  value = JSON.parse(value);
  articleActions.addArticles(value);
});

var plumpArticle = function (article) {
  article.date_saved_parsed = new Date(article.date_saved);
  article.date_updated_parsed = new Date(article.date_updated);
  return article;
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
  in_list.push(article.id);
  _articles = _articles.push(Immutable.fromJS(article));

  updateCache();
}

function addArticles (articles) {
  _articles = _articles.withMutations(function (map) {
    $.each(articles, function (i, article) {
      if (article && article.id && idInList(article.id)) {
        return;
      }
      article = plumpArticle(article);
      in_list.push(article.id);
      map = map.push(Immutable.fromJS(article));
    });
  });
  updateCache();
}

function selectArticle (article) {
  selectedArticle = article;
}

function archiveArticle (article) {
  var articleIndex = _articles.indexOf(article);
  if (articleIndex >= 0) {
    _articles = _articles.update(articleIndex, function (_article) {
      return _article.set('archived', true);
    });
    updateCache();
  }
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
    addArticles(payload.articles);
    ArticleStore.emitChange();
  } else if (payload.actionType === 'SELECT_ARTICLE') {
    selectArticle(payload.article);
    ArticleStore.emitChange();
  } else if (payload.actionType === 'ARCHIVE_ARTICLE') {
    console.log('yo 3');
    archiveArticle(payload.article);
    ArticleStore.emitChange();
  }

  return true;

});


export default ArticleStore;
