# hexo-generator-alias

[![Build Status](https://travis-ci.org/hexojs/hexo-generator-alias.svg?branch=master)](https://travis-ci.org/hexojs/hexo-generator-alias)
[![NPM version](https://badge.fury.io/js/hexo-generator-alias.svg)](https://www.npmjs.com/package/hexo-generator-alias)
[![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-generator-alias.svg)](https://coveralls.io/r/hexojs/hexo-generator-alias?branch=master)

Generates alias pages for redirecting to posts, pages or URL.

## Install

``` bash
$ npm install hexo-generator-alias --save
```

- Hexo 3 & 4: >= 1.0
- Hexo 2: 0.1.x

## Usage

You can specify aliases in `_config.yml`:

``` yaml
alias:
  api/index.html: api/classes/Hexo.html
  plugins/index.html: https://github.com/tommy351/hexo/wiki/Plugins
```

In the above example, when you access http://example.com/api/, you will be redirected to http://example.com/api/classes/Hexo.html

You could also configure it in your post and page files:

``` diff
source/cv/index.md
---
title: some title
date: some date
+ alias: about/index.html

+ alias:
+ - foo/index.html
+ - bar/index.html
---
```

In the above example, when you access http://example.com/about/, you will be redirected to http://example.com/cv/

You could also configure multiple aliases. So in the second example,

- http://example.com/foo/ ⇒ http://example.com/cv/
- http://example.com/bar/ ⇒ http://example.com/cv/

Alias must ends with `.html`, examples of valid value include:

- "about/index.html" (alias is http://example.com/about/)
- "foo/bar.html" (alias is http://example.com/foo/bar)

## Redirect

Available in post and page.

``` diff
source/cv/index.md
---
title: some title
date: some date
+ redirect: http://target-site.com/
---
```

http://example.com/cv/ ⇒ http://target-site.com/

``` diff
source/_posts/foo.md
---
title: foo
date: 2020-01-02 00:00:00
+ redirect: /2020/03/04/bar/
---
```

http://example.com/2020/01/02/foo/ ⇒ http://example.com/2020/03/04/bar/

### Redirect to a post

If you specify a value without any slash, the article will be redirected to a post with that filename.

For example, there is an existing post "source/_posts/foo-post.md" that is available at http://example.com/2020/01/02/foo-post/,

``` diff
source/baz-page.md
---
title: baz
+ redirect: foo-post
---
```

http://example.com/baz-page ⇒ http://example.com/2020/01/02/foo-post/

_If a post could not be located (due to incorrect value), the article will be redirected to http://example.com/foo-post_
