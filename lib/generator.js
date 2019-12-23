'use strict';

const rProtocol = /^(\w+:)?\/\//;

function aliasGenerator(locals) {
  const config = this.config;
  const route = this.route;
  const result = [];
  const templateCache = {};

  function template(path) {
    path = rProtocol.test(path) ? path : config.root + route.format(path);
    path = path.replace(/index\.html$/, '');

    if (Object.prototype.hasOwnProperty.call(templateCache, path)) return templateCache[path];

    const result = '<!DOCTYPE html>'
      + '<html>'
      + '<head>'
        + '<meta charset="utf-8">'
        + '<title>Redirecting...</title>'
        + '<link rel="canonical" href="' + path + '">'
        + '<meta http-equiv="refresh" content="0; url=' + path + '">'
      + '</head>'
      + '</html>';

    templateCache[path] = result;
    return result;
  }

  [].concat(locals.posts.toArray(), locals.pages.toArray()).filter(post => {
    return post.alias || post.aliases;
  }).forEach(post => {
    let aliases = post.alias || post.aliases;
    if (!Array.isArray(aliases)) aliases = [aliases];
    if (!aliases.length) return;

    const data = template(post.path);

    aliases.forEach(alias => {
      result.push({
        path: alias,
        data: data
      });
    });
  });

  const aliasConfig = config.alias || config.aliases;

  if (typeof aliasConfig === 'object') {
    Object.keys(aliasConfig).forEach(key => {
      result.push({
        path: key,
        data: template(aliasConfig[key])
      });
    });
  }

  return result;
}

module.exports = aliasGenerator;
