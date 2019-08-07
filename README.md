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

In the above example, when you access http://yoursite.com/api/, you will be redirected to http://yoursite.com/api/classes/Hexo.html

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

In the above example, when you access http://yoursite.com/about/, you will be redirected to http://yoursite.com/cv/

You could also configure multiple aliases. So in the second example,

- http://yoursite.com/foo/ ⇒ http://yoursite.com/cv/
- http://yoursite.com/bar/ ⇒ http://yoursite.com/cv/
