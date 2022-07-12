/* global hexo */

'use strict';

hexo.extend.generator.register('alias', require('./lib/generator'));
