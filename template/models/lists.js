models.push('rss', {
  extend: ['base'],
  /**
   * Creates a model for a view
   * @model has: site, file, document and pagger
   */
  create: function(model, storage) {

    return storage.news.latest({
      limit: 10
    }).then(function(rows) {
      model.news = rows || [];
    });

  }
});
