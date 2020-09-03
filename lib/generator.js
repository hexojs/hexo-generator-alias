'use strict';

const { Cache, full_url_for } = require('hexo-util');

const templateCache = new Cache();
const template = hexo => path => templateCache.apply(path, () => {
  const target = full_url_for.call(hexo, path);
  return '<!DOCTYPE html>'
  + '<html>'
  + '<head>'
    + '<meta charset="utf-8">'
    + '<title>Redirecting...</title>'
    + '<link rel="canonical" href="' + target + '">'
    + '<meta http-equiv="refresh" content="0; url=' + target + '">'
  + '</head>'
  + '</html>';
});

function redirGenerator(data) {
  const { alias, aliases } = data;
  let { redirect } = data;
  if (redirect && !alias && !aliases) {
    if (!redirect.includes('/')) {
      const Post = this.model('Post');
      const post = Post.findOne({ slug: redirect });
      if (post) redirect = post.path;
    }
    data.layout = '';
    data.content = template(this)(redirect);
  }
  return data;
}

function aliasGenerator(locals) {
  const { config } = this;
  const result = [];

  [].concat(locals.posts.toArray(), locals.pages.toArray()).filter(post => {
    return post.alias || post.aliases;
  }).forEach(post => {
    let aliases = post.alias || post.aliases;
    if (!Array.isArray(aliases)) aliases = [aliases];
    if (!aliases.length) return;

    const data = template(this)(post.path);

    aliases.forEach(alias => {
      result.push({
        path: alias,
        data
      });
    });
  });

  const aliasConfig = config.alias || config.aliases;

  if (typeof aliasConfig === 'object') {
    Object.keys(aliasConfig).forEach(key => {
      result.push({
        path: key,
        data: template(this)(aliasConfig[key])
      });
    });
  }

  return result;
}

module.exports = {
  aliasGenerator,
  redirGenerator
};
