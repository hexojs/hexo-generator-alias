'use strict';

var rProtocol = /^(\w+:)?\/\//;

function aliasGenerator(locals) {
  var config = this.config;
  var route = this.route;
  var result = [];
  var templateCache = {};

  function template(path) {
    path = rProtocol.test(path) ? path : config.root + route.format(path);
    path = path.replace(/index\.html$/, '');

    if (templateCache.hasOwnProperty(path)) return templateCache[path];

    var result = templateCache[path] = '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<meta charset="utf-8">' +
        '<title>Redirecting...</title>' +
        '<link rel="canonical" href="' + path + '">' +
        `<script>(function(){
          window.location.replace('${path}' + window.location.hash)
        })()</script>` +
        '<meta http-equiv="refresh" content="0; url=' + path + '">' +
      '</head>' +
      '</html>';

    return result;
  }

  [].concat(locals.posts.toArray(), locals.pages.toArray()).filter(function(post) {
    return post.alias || post.aliases;
  }).forEach(function(post) {
    var aliases = post.alias || post.aliases;
    if (!Array.isArray(aliases)) aliases = [aliases];
    if (!aliases.length) return;

    var data = template(post.path);

    aliases.forEach(function(alias) {
      result.push({
        path: alias,
        data: data
      });
    });
  });

  var aliasConfig = config.alias || config.aliases;

  if (typeof aliasConfig === 'object') {
    Object.keys(aliasConfig).forEach(function(key) {
      result.push({
        path: key,
        data: template(aliasConfig[key])
      });
    });
  }

  return result;
}

module.exports = aliasGenerator;
