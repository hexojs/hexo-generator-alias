# hexo-generator-alias

[![Build Status](https://travis-ci.org/hexojs/hexo-generator-alias.svg?branch=master)](https://travis-ci.org/hexojs/hexo-generator-alias)  [![NPM version](https://badge.fury.io/js/hexo-generator-alias.svg)](http://badge.fury.io/js/hexo-generator-alias) [![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-generator-alias.svg)](https://coveralls.io/r/hexojs/hexo-generator-alias?branch=master)

Generates alias pages for redirecting to posts, pages or URL.

## Install

``` bash
$ npm install hexo-generator-alias --save
```

## Usage

You can specify aliases in post files:

``` yaml
alias: about/index.html

alias:
- about/index.html
- bar/index.html
```

or in `_config.yml`:

``` yaml
alias:
  api/index.html: api/classes/Hexo.html
  plugins/index.html: https://github.com/tommy351/hexo/wiki/Plugins
```
