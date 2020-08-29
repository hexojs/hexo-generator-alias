'use strict';

require('chai').should();
const Hexo = require('hexo');
const { full_url_for } = require('hexo-util');

describe('hexo-generator-alias', () => {
  describe('alias', () => {
    const hexo = new Hexo(__dirname);
    const Post = hexo.model('Post');
    const Page = hexo.model('Page');
    const generator = require('../lib/generator').aliasGenerator.bind(hexo);
    const defaultCfg = JSON.parse(JSON.stringify(hexo.config));

    before(() => hexo.init());

    beforeEach(() => {
      hexo.locals.invalidate();
      hexo.config = JSON.parse(JSON.stringify(defaultCfg));
    });

    it('posts', async () => {
      try {
        await Post.insert([
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
        ]);

        const result = generator(hexo.locals.toObject());

        result.map(item => {
          return item.path;
        }).should.have.members(['foo1', 'bar1', 'bar2', 'bar3', 'baz1', 'boo1', 'boo2', 'boo3']);
      } finally {
        await Post.remove({});
      }
    });

    it('pages', async () => {
      try {
        await Page.insert([
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
        ]);

        const result = generator(hexo.locals.toObject());

        result.map(item => {
          return item.path;
        }).should.have.members(['foo1', 'bar1', 'bar2', 'bar3', 'baz1', 'boo1', 'boo2', 'boo3']);
      } finally {
        await Page.remove({});
      }
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
    });

    it('non-default root', () => {
      hexo.config.url = 'http://yoursite.com/root';
      hexo.config.alias = {
        'lorem/index.html': 'lorem/classes/Hexo.html'
      };

      const result = generator(hexo.locals.toObject());

      result[0].path.should.eql('lorem/index.html');
      result[0].data.should.include(hexo.config.url + '/lorem/classes/Hexo.html');
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
    });

    it('pretty_urls - true', () => {
      hexo.config.pretty_urls.trailing_index = true;
      hexo.config.alias = {
        'test': 'foo/index.html'
      };

      const result = generator(hexo.locals.toObject());

      result[0].data.should.include('foo/index.html');
    });

    it('pretty_urls - false', () => {
      hexo.config.pretty_urls.trailing_index = false;
      hexo.config.alias = {
        'test': 'bar/index.html'
      };

      const result = generator(hexo.locals.toObject());

      result[0].data.should.include('bar/');
      result[0].data.should.not.include('bar/index.html');
    });
  });

  describe('redirect', () => {
    const hexo = new Hexo(__dirname, { silent: true });
    const Post = hexo.model('Post');
    const Page = hexo.model('Page');
    const r = require('../lib/generator').redirGenerator.bind(hexo);

    before(() => hexo.init());

    afterEach(async () => {
      await Post.remove({});
      await Page.remove({});
    });

    it('post', async () => {
      const target = 'http://bar.com';
      const post = await Post.insert({
        source: 'foo',
        slug: 'foo',
        redirect: target
      });

      const result = r(post);
      result.content.should.include('<meta http-equiv="refresh" content="0; url=' + target + '">');
    });

    it('page', async () => {
      const target = 'http://bar.com';
      const page = await Page.insert({
        source: 'foo',
        path: 'foo',
        redirect: target
      });

      const result = r(page);
      result.content.should.include('<meta http-equiv="refresh" content="0; url=' + target + '">');
    });

    it('should output absolute url', async () => {
      const target = '/bar/';
      const post = await Post.insert({
        source: 'foo',
        slug: 'foo',
        redirect: target
      });

      const result = r(post);
      result.content.should.include('<meta http-equiv="refresh" content="0; url=' + full_url_for.call(hexo, target) + '">');
    });

    it('prioritize alias', async () => {
      const target = 'http://bar.com';
      const content = 'lorem';
      const post = await Post.insert({
        source: 'foo',
        slug: 'foo',
        content,
        alias: 'foo1',
        redirect: target
      });

      const result = r(post);
      result.content.should.eql(content);
    });

    it('prioritize aliases', async () => {
      const target = 'http://bar.com';
      const content = 'lorem';
      const post = await Post.insert({
        source: 'foo',
        slug: 'foo',
        content,
        aliases: ['foo1'],
        redirect: target
      });

      const result = r(post);
      result.content.should.eql(content);
    });
  });
});
