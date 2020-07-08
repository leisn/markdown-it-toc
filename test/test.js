'use strict';
const fs = require('fs');
const path = require('path');

const mi = require('markdown-it');
const me = require('../');

describe('markdown-it-toc', function () {
    it("should be empty toc", function () {
        let md = mi().use(me);
        let content = md.render('[toc]');
        content.should.be.String();
        content.includes('[toc]').should.be.exactly(false);
        content.includes('id="toc"').should.be.exactly(true);
        content.includes('<ul>').should.be.exactly(false);
    });

    describe('test.md', function () {
        var doc = '';

        before(function () {
            doc = fs.readFileSync(path.join(__dirname, 'test.md'), 'utf-8');

            let file = path.join(__dirname, 'test.html');
            if (!fs.existsSync(file)) {
                let content = mi().use(me).render(doc);
                content = '<!doctype html><html><head><title>Test [TOC]</title>\
                <link rel="stylesheet" href="./toc.css"></head><body>' +
                    content + '</body></html>';
                fs.writeFileSync(file, content);
                console.log('render done.');
            }
        });

        it("should be a default toc", function () {
            let md = mi().use(me);
            let content = md.render(doc);
            content.should.be.String();
            content.includes('[toc]').should.be.exactly(false);
            content.includes('id="toc"').should.be.exactly(true);
            content.includes('<ul>').should.be.exactly(true);
            content.includes('<li>').should.be.exactly(true);
            content.includes('toc-item-index').should.be.exactly(true);
            content.includes('toc-heading').should.be.exactly(true);
            content.includes('toc-heading-prefix').should.be.exactly(true);
            content.includes('toc-heading-content').should.be.exactly(true);
            content.includes('toc-heading-suffix').should.be.exactly(true);
        });

        it("should no heading-suffix", function () {
            let md = mi().use(me, {
                getHeadingSuffix: function () {
                    return '';
                }
            });
            let content = md.render(doc);
            content.should.be.String();
            content.includes('[toc]').should.be.exactly(false);
            content.includes('id="toc"').should.be.exactly(true);
            content.includes('<ul>').should.be.exactly(true);
            content.includes('<li>').should.be.exactly(true);
            content.includes('toc-item-index').should.be.exactly(true);
            content.includes('toc-heading').should.be.exactly(true);
            content.includes('toc-heading-prefix').should.be.exactly(true);
            content.includes('toc-heading-content').should.be.exactly(true);
            content.includes('toc-heading-suffix').should.be.exactly(false);
        });
    });
});