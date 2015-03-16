import mcFly from '../dispatcher';

var ArticleActions = mcFly.createActions({
  addArticle: function(article) {
    return {
      actionType: 'ADD_ARTICLE',
      article: article
    };
  },
  addArticles: function(articles, sync) {
    return {
      actionType: 'ADD_ARTICLES',
      articles: articles,
      sync: sync
    };
  },
  selectArticle: function(article) {
    return {
      actionType: 'SELECT_ARTICLE',
      article: article
    };
  },
  archiveArticle: function (article) {
    return {
      actionType: 'ARCHIVE_ARTICLE',
      article: article
    };
  },
  unArchiveArticle: function (article) {
    return {
      actionType: 'UNARCHIVE_ARTICLE',
      article: article
    };
  },
  removeArticle: function (article) {
    return {
      actionType: 'REMOVE_ARTICLE',
      article: article
    };
  }
});

export default ArticleActions;
