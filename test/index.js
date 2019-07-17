'use strict';

require('chai').should(); // eslint-disable-line
var Hexo = require('hexo');

describe('hexo-generator-alias', function() {
  var hexo = new Hexo(__dirname);
  var Post = hexo.model('Post');
  var Page = hexo.model('Page');
  var generator = require('../lib/generator').bind(hexo);

  beforeEach(function() {
    hexo.locals.invalidate();
  });

  it('posts', function() {
    return Post.insert([
      // alias - string
      {
        source: 'foo',
        slug: 'foo',
        alias: 'foo1'
      },
      // alias - array
      {
        source: 'bar',
        slug: 'bar',
        alias: ['bar1', 'bar2', 'bar3']
      },
      // aliases - string
      {
        source: 'baz',
        slug: 'baz',
        aliases: 'baz1'
      },
      // aliases - array
      {
        source: 'boo',
        slug: 'boo',
        aliases: ['boo1', 'boo2', 'boo3']
      }
    ]).then(function() {
      var result = generator(hexo.locals.toObject());

      result.map(function(item) {
        return item.path;
      }).should.have.members(['foo1', 'bar1', 'bar2', 'bar3', 'baz1', 'boo1', 'boo2', 'boo3']);
    }).finally(function() {
      return Post.remove({});
    });
  });

  // it('posts.aliases - array');

  it('pages', function() {
    return Page.insert([
      // alias - string
      {
        source: 'foo',
        path: 'foo',
        alias: 'foo1'
      },
      // alias - array
      {
        source: 'bar',
        path: 'bar',
        alias: ['bar1', 'bar2', 'bar3']
      },
      // aliases - string
      {
        source: 'baz',
        path: 'baz',
        aliases: 'baz1'
      },
      // aliases - array
      {
        source: 'boo',
        path: 'boo',
        aliases: ['boo1', 'boo2', 'boo3']
      }
    ]).then(function() {
      var result = generator(hexo.locals.toObject());

      result.map(function(item) {
        return item.path;
      }).should.have.members(['foo1', 'bar1', 'bar2', 'bar3', 'baz1', 'boo1', 'boo2', 'boo3']);
    }).finally(function() {
      return Page.remove({});
    });
  });

  it('config.alias', function() {
    hexo.config.alias = {
      'api/index.html': 'api/classes/Hexo.html',
      'plugins/index.html': 'https://github.com/tommy351/hexo/wiki/Plugins'
    };

    var result = generator(hexo.locals.toObject());

    result[0].path.should.eql('api/index.html');
    result[0].data.should.include('api/classes/Hexo.html');

    result[1].path.should.eql('plugins/index.html');
    result[1].data.should.include('https://github.com/tommy351/hexo/wiki/Plugins');

    hexo.config.alias = null;
  });

  it('config.aliases', function() {
    hexo.config.aliases = {
      'api/index.html': 'api/classes/Hexo.html',
      'plugins/index.html': 'https://github.com/tommy351/hexo/wiki/Plugins'
    };

    var result = generator(hexo.locals.toObject());

    result[0].path.should.eql('api/index.html');
    result[0].data.should.include('/api/classes/Hexo.html');

    result[1].path.should.eql('plugins/index.html');
    result[1].data.should.include('https://github.com/tommy351/hexo/wiki/Plugins');

    hexo.config.alias = null;
  });

  it('non-default root', function() {
    hexo.config.root = '/test/';
    hexo.config.alias = {
      'api/index.html': 'api/classes/Hexo.html'
    };

    var result = generator(hexo.locals.toObject());

    result[0].path.should.eql('api/index.html');
    result[0].data.should.include(hexo.config.root + 'api/classes/Hexo.html');

    hexo.config.root = '/';
    hexo.config.alias = null;
  });

  it('external path', function() {
    hexo.config.alias = {
      'http': 'http://hexo.io/',
      'https': 'https://hexo.io/',
      'relative': '//hexo.io/',
      'ftp': 'ftp://hexo.io/'
    };

    var result = generator(hexo.locals.toObject());

    result[0].data.should.include('http://hexo.io/');
    result[1].data.should.include('https://hexo.io/');
    result[2].data.should.include('//hexo.io/');
    result[3].data.should.include('ftp://hexo.io/');

    hexo.config.alias = null;
  });

  it('remove index.html suffix', function() {
    hexo.config.alias = {
      'test': 'fooo/index.html'
    };

    var result = generator(hexo.locals.toObject());

    result[0].data.should.include('fooo/');
    result[0].data.should.not.include('fooo/index.html');

    hexo.config.alias = null;
  });
});
