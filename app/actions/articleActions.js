import mcFly from '../dispatcher';

var ArticleActions = mcFly.createActions({
  addArticle: function(article) {
    return {
      actionType: 'ADD_ARTICLE',
      article: article
    };
  },
  addArticles: function(articles) {
    return {
      actionType: 'ADD_ARTICLES',
      articles: articles
    };
  },
  selectArticle: function(article) {
    return {
      actionType: 'SELECT_ARTICLE',
      article: article
    };
  },
  archiveArticle: function (article) {
    console.log("Yo 2");
    return {
      actionType: 'ARCHIVE_ARTICLE',
      article: article
    };
  }
});

export default ArticleActions;
