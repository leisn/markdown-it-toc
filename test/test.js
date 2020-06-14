'use strict';

const assert = require('assert');

const md = require('markdown-it');
const me = require('../');

describe('#no global config', function () {
    var r = md().use(me);
    it("should be empty toc", function () {
        let content = r.render('[toc]');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper"></div></p>\n');
    });
    it("should be one title", function () {
        let content = r.render('# H1');
        assert.equal(content, '<h1><em id="toc-no.1" class="toc-heading-anchor"></em>H1</h1>\n');
    });
    it("should be two title", function () {
        let content = r.render('# H1\n## H2');
        assert.equal(content, '<h1><em id="toc-no.1" class="toc-heading-anchor"></em>H1</h1>\n<h2><em id="toc-no.1-1" class="toc-heading-anchor"></em>H2</h2>\n');
    });

    it("should be toc with two title", function () {
        let content = r.render('[toc]\n# H1\n## H2');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper">' +
            '<li class="toc-item"><a href="#toc-no.1" class="toc-content-anchor">H1</a></li>' +
            '<ul class="toc-list">' +
            '<li class="toc-item"><a href="#toc-no.1-1" class="toc-content-anchor">H2</a></li>' +
            '</ul>' +
            '</div></p>\n' +
            '<h1><em id="toc-no.1" class="toc-heading-anchor"></em>H1</h1>\n<h2><em id="toc-no.1-1" class="toc-heading-anchor"></em>H2</h2>\n');
    });
});

describe('#use anchor string', function () {
    var r = md().use(me, {
        useAnchorString: true,
        anchorSymbol: '#'
    });
    it("should be empty toc", function () {
        let content = r.render('[toc]');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper"></div></p>\n');
    });
    it("should be one title", function () {
        let content = r.render('# H1');
        assert.equal(content, '<h1><em id="toc-no.1" class="toc-heading-anchor"><span class="toc-heading-syl">#</span></em>H1</h1>\n');
    });
    it("should be two title", function () {
        let content = r.render('# H1\n## H2');
        assert.equal(content, '<h1><em id="toc-no.1" class="toc-heading-anchor"><span class="toc-heading-syl">#</span></em>H1</h1>\n' +
            '<h2><em id="toc-no.1-1" class="toc-heading-anchor"><span class="toc-heading-syl">#</span></em>H2</h2>\n');
    });

    it("should be toc with two title", function () {
        let content = r.render('[toc]\n# H1\n## H2');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper">' +
            '<li class="toc-item">' +
            '<a href="#toc-no.1" class="toc-content-anchor">' +
            '<span class="toc-content-syl">#</span>H1</a></li>' +
            '<ul class="toc-list">' +
            '<li class="toc-item"><a href="#toc-no.1-1" class="toc-content-anchor">' +
            '<span class="toc-content-syl">#</span>H2</a></li>' +
            '</ul>' +
            '</div></p>\n' +
            '<h1><em id="toc-no.1" class="toc-heading-anchor"><span class="toc-heading-syl">#</span></em>H1</h1>\n' +
            '<h2><em id="toc-no.1-1" class="toc-heading-anchor"><span class="toc-heading-syl">#</span></em>H2</h2>\n');
    });
});

describe('#use anchor number', function () {
    var r = md().use(me, {
        useAnchorNumber: true,
        getAnchorNumber: function (paths) {
            return paths.join('-') + '_';
        }
    });
    it("should be empty toc", function () {
        let content = r.render('[toc]');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper"></div></p>\n');
    });
    it("should be one title", function () {
        let content = r.render('# H1');
        assert.equal(content, '<h1><em id="toc-no.1" class="toc-heading-anchor"><span class="toc-heading-no">1_</span></em>H1</h1>\n');
    });
    it("should be two title", function () {
        let content = r.render('# H1\n## H2');
        assert.equal(content, '<h1><em id="toc-no.1" class="toc-heading-anchor"><span class="toc-heading-no">1_</span></em>H1</h1>\n' +
            '<h2><em id="toc-no.1-1" class="toc-heading-anchor"><span class="toc-heading-no">1-1_</span></em>H2</h2>\n');
    });

    it("should be toc with two title", function () {
        let content = r.render('[toc]\n# H1\n## H2');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper">' +
            '<li class="toc-item">' +
            '<a href="#toc-no.1" class="toc-content-anchor">' +
            '<span class="toc-content-no">1_</span>H1</a></li>' +
            '<ul class="toc-list">' +
            '<li class="toc-item"><a href="#toc-no.1-1" class="toc-content-anchor">' +
            '<span class="toc-content-no">1-1_</span>H2</a></li>' +
            '</ul>' +
            '</div></p>\n' +
            '<h1><em id="toc-no.1" class="toc-heading-anchor"><span class="toc-heading-no">1_</span></em>H1</h1>\n' +
            '<h2><em id="toc-no.1-1" class="toc-heading-anchor"><span class="toc-heading-no">1-1_</span></em>H2</h2>\n');
    });
});

describe('#use level 2-3', function () {
    var r = md().use(me, {
        hTopLevel: 2,
        hLowLevel: 3
    });

    it("should be empty toc", function () {
        let content = r.render('[toc]');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper"></div></p>\n');
    });

    it("should be h1 no cover title", function () {
        let content = r.render('# H1');
        assert.equal(content, '<h1>H1</h1>\n');
    });

    it("should be only cover h2 title ", function () {
        let content = r.render('# H1\n## H2');
        assert.equal(content, '<h1>H1</h1>\n' +
            '<h2><em id="toc-no.1-1" class="toc-heading-anchor"></em>H2</h2>\n');
    });

    it("should be toc with only cover h2 title", function () {
        let content = r.render('[toc]\n# H1\n## H2');
        assert.equal(content, '<p><div id="toc" class="toc-wrapper">' +
            '<li class="toc-item">' +
            '<a href="#toc-no.1-1" class="toc-content-anchor">H2</a></li>' +
            '</div></p>\n' +
            '<h1>H1</h1>\n' +
            '<h2><em id="toc-no.1-1" class="toc-heading-anchor"></em>H2</h2>\n');
    });
});
