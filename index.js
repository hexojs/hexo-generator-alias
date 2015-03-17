var url = require('url');

hexo.extend.generator.register('alias', function(locals){
  var route = hexo.route,
    config = hexo.config,
    routes = [];

  var template = function(path){
    path = url.parse(path).protocol ? path : config.root + route.format(path);

    return [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
        '<meta charset="utf-8">',
        '<title>Redirecting...</title>',
        '<link rel="canonical" href="' + path + '">',
        '<meta http-equiv="refresh" content="0; url=' + path + '">',
      '</head>',
      '</html>'
    ].join('');
  };

  [].concat(locals.posts.toArray(), locals.pages.toArray()).forEach(function(item){
    if (!item.alias && !item.aliases) return;

    var aliases = item.alias || item.aliases;
    if (!Array.isArray(aliases)) aliases = [aliases];

    aliases.forEach(function(alias){
      routes.push({path:alias, data:template(item.path)});
    });
  });

  var aliasConfig = config.alias;

  for (var i in aliasConfig){
    routes.push({path:i, data:template(aliasConfig[i])});
  }

  return routes;
});