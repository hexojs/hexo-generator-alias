/* global hexo */

'use strict';

hexo.extend.generator.register('alias', require('./lib/generator').aliasGenerator);
hexo.extend.filter.register('after_post_render', require('./lib/generator').redirGenerator);
