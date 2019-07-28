'use strict';

const should = require('chai').should(); // eslint-disable-line
const Hexo = require('hexo');

describe('hexo-generator-alias', () => {
  const hexo = new Hexo(__dirname);
  const Post = hexo.model('Post');
  const Page = hexo.model('Page');
  const generator = require('../lib/generator').bind(hexo);

  before(() => hexo.init());

  beforeEach(() => {
    hexo.locals.invalidate();
  });

  it('posts', () => {
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
    ]).then(() => {
      const result = generator(hexo.locals.toObject());

      result.map(item => {
        return item.path;
      }).should.have.members(['foo1', 'bar1', 'bar2', 'bar3', 'baz1', 'boo1', 'boo2', 'boo3']);
    }).finally(() => {
      return Post.remove({});
    });
  });

  // it('posts.aliases - array');

  it('pages', () => {
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
    ]).then(() => {
      const result = generator(hexo.locals.toObject());

      result.map(item => {
        return item.path;
      }).should.have.members(['foo1', 'bar1', 'bar2', 'bar3', 'baz1', 'boo1', 'boo2', 'boo3']);
    }).finally(() => {
      return Page.remove({});
    });
  });

  it('config.alias', () => {
    hexo.config.alias = {
      'api/index.html': 'api/classes/Hexo.html',
      'plugins/index.html': 'https://github.com/tommy351/hexo/wiki/Plugins'
    };

    const result = generator(hexo.locals.toObject());

    result[0].path.should.eql('api/index.html');
    result[0].data.should.include('api/classes/Hexo.html');

    result[1].path.should.eql('plugins/index.html');
    result[1].data.should.include('https://github.com/tommy351/hexo/wiki/Plugins');

    hexo.config.alias = null;
  });

  it('config.aliases', () => {
    hexo.config.aliases = {
      'api/index.html': 'api/classes/Hexo.html',
      'plugins/index.html': 'https://github.com/tommy351/hexo/wiki/Plugins'
    };

    const result = generator(hexo.locals.toObject());

    result[0].path.should.eql('api/index.html');
    result[0].data.should.include('/api/classes/Hexo.html');

    result[1].path.should.eql('plugins/index.html');
    result[1].data.should.include('https://github.com/tommy351/hexo/wiki/Plugins');

    hexo.config.alias = null;
  });

  it('non-default root', () => {
    hexo.config.root = '/test/';
    hexo.config.alias = {
      'api/index.html': 'api/classes/Hexo.html'
    };

    const result = generator(hexo.locals.toObject());

    result[0].path.should.eql('api/index.html');
    result[0].data.should.include(hexo.config.root + 'api/classes/Hexo.html');

    hexo.config.root = '/';
    hexo.config.alias = null;
  });

  it('external path', () => {
    hexo.config.alias = {
      'http': 'http://hexo.io/',
      'https': 'https://hexo.io/',
      'relative': '//hexo.io/',
      'ftp': 'ftp://hexo.io/'
    };

    const result = generator(hexo.locals.toObject());

    result[0].data.should.include('http://hexo.io/');
    result[1].data.should.include('https://hexo.io/');
    result[2].data.should.include('//hexo.io/');
    result[3].data.should.include('ftp://hexo.io/');

    hexo.config.alias = null;
  });

  it('remove index.html suffix', () => {
    hexo.config.alias = {
      'test': 'fooo/index.html'
    };

    const result = generator(hexo.locals.toObject());

    result[0].data.should.include('fooo/');
    result[0].data.should.not.include('fooo/index.html');

    hexo.config.alias = null;
  });
});
