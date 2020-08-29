'use strict';

const { full_url_for } = require('hexo-util');

module.exports = function(data) {
  const { alias, aliases, redirect } = data;
  if (redirect && !alias && !aliases) {
    const target = full_url_for.call(this, redirect);
    data.layout = '';
    data.content = '<!DOCTYPE html>'
    + '<html>'
    + '<head>'
      + '<meta charset="utf-8">'
      + '<title>Redirecting...</title>'
      + '<link rel="canonical" href="' + target + '">'
      + '<meta http-equiv="refresh" content="0; url=' + target + '">'
    + '</head>'
    + '</html>';
  }
  return data;
};
