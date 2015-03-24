models.push('base', {
  extend: [],
  /**
   * Creates a model for a view
   * @model has: site, file, document and pagger
   */
  create: function(model) {
    return {
      head: {
        title: model.site.title,
        description: model.site.description
      },

      isHomePage: model.file.url === '/'
    };
  }
});

models.push('layout', {
  extend: ['base'],
  /**
   * Creates a model for a view
   * @model has: site, file, document and pagger
   */
  create: function(model, storage) {

    return storage.groups.categories().then(function(categories) {
      model.categories = categories;
      return storage.news.latest({
        limit: 5
      }).then(function(rows) {
        model.latestNews = rows;
        return storage.groups.topTags({
          limit: 16
        }).then(function(rows) {
          model.topTags = rows;
        });
      });
    });

  }
});

models.push('news-item', {
  extend: ['layout'],
  /**
   * Creates a model for a view
   * @model has: site, file, document and pagger
   */
  create: function(model) {

    model.head.title = model.document.title;
    model.head.description = model.document.summary;

  }
});


models.push('index', {
  extend: ['layout'],
  /**
   * Creates a model for a view
   * @model has: site, file, document and pagger
   */
  create: function(model, storage, Promise) {
    model.newsByCategory = {};
    return Promise.map(model.categories || [], function(category) {
      return storage.news.latestByCategorySlug({
        slug: category.slug,
        limit: 5
      }).then(function(news) {
        model.newsByCategory[category.slug] = news || [];
      });
    });

  }
});

models.push('tag', {
  extend: ['layout'],
  /**
   * Creates a model for a view
   * @model has: site, file, document and pagger
   */
  create: function(model, storage) {
    return storage.news.latestByGroupItemId({
      id: model.document.id,
      limit: 5
    }).then(function(news) {
      model.news = news || [];
    });
  }
});
