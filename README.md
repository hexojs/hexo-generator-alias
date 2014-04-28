# Alias generator

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