"use strict";
function MarkdownItToc(md, options) {
    var opt = Object.assign({
        tocRegexp: /\[toc\]/im,
        tocTag: 'div',
        tocAttrs: 'id="toc" class="toc-wrapper"',
        headingAttrs: 'class="toc-heading"',
        headingContentAttrs: 'class="toc-heading-content"',
        getPathId: function (info) {
            return 'toc.' + info.paths.join('-');
        },
        getTocItemContent: function (info) {
            return '<span class="toc-item-index">' + info.paths.join('.') + '</span>' + info.content;
        },
        getHeadingPrefix: function (info) {
            return '<span class="toc-heading-prefix">' + info.paths.join('.') + '</span>';
        },
        getHeadingSuffix: function (info) {
            return '<a href="#toc" class="toc-heading-suffix">#</a>';
        },
    }, options);
    var hInfos = [];
    md.inline.ruler.after('emphasis', 'toc', (state, silent) => {
        if (silent)
            return false;
        let src = state.src;
        let match = opt.tocRegexp.exec(src);
        if (!match)
            return false;
        match.filter(m => {
            return m;
        });
        const mk = match.pop();
        if (!mk)
            return false;
        let token = state.push("toc_open", "toc", 1);
        token.markup = mk;
        token = state.push("toc_body", "", 0);
        token.content = mk;
        token = state.push("toc_close", "toc", -1);
        state.pos = state.pos + mk.length;
        return true;
    });
    md.core.ruler.push('init_toc', state => {
        let heads = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let tokens = state.tokens;
        tokens.forEach((token, index) => {
            if (token.type === 'heading_open') {
                let level = Math.max(parseInt(token.tag[1]), token.markup.length);
                if (level > 9) // ######### title
                    level = 9;
                heads[level] += 1;
                let subPath = [];
                for (let i = 1; i < heads.length; i++) {
                    if (i <= level)
                        subPath.push(heads[i]);
                    else
                        heads[i] = 0;
                }
                let hPath = {
                    paths: subPath,
                    tag: token.tag,
                    markup: token.markup,
                    content: tokens[index + 1].content,
                };
                hInfos.push(hPath);
            }
        });
        return true;
    });
    md.renderer.rules.toc_open = () => {
        let toc = '<' + opt.tocTag + ' ';
        toc += opt.tocAttrs;
        return toc + ' >';
    };
    md.renderer.rules.toc_close = () => {
        return '</' + opt.tocTag + '>';
    };
    md.renderer.rules.toc_body = () => {
        let result = [];
        let lastLevel = 0;
        for (let i = 0; i < hInfos.length; i++) {
            let hinfo = hInfos[i];
            let xpath = hinfo.paths;
            let diff = xpath.length - lastLevel;
            if (diff > 0) {
                for (let _ = 0; _ < diff; _++)
                    result.push('<ul>');
            }
            else if (diff < 0) {
                for (let _ = 0; _ > diff; _--)
                    result.push('</ul>');
            }
            let litem = '<li><a href="#' + opt.getPathId(hinfo) + '">';
            litem += opt.getTocItemContent(hinfo);
            litem += '</a></li>';
            result.push(litem);
            lastLevel = xpath.length;
        }
        for (let i = 0; i < lastLevel; i++) {
            result.push('</ul>');
        }
        let html = result.join('');
        if (opt.getToc) {
            if (!opt.getToc(html))
                return '';
        }
        return html;
    };
    md.renderer.rules.heading_open = (tokens, index) => {
        let token = tokens[index];
        let hinfo = hInfos[0];
        if (!hinfo)
            return '<' + token.tag + ">";
        let result = '<' + token.tag + ' id="' + opt.getPathId(hinfo) + '" ' + opt.headingAttrs + '>';
        result += opt.getHeadingPrefix(hinfo);
        result += '<span ' + opt.headingContentAttrs + ' >';
        return result;
    };
    md.renderer.rules.heading_close = (tokens, index) => {
        let token = tokens[index];
        let hinfo = hInfos.shift();
        if (!hinfo)
            return '</span></' + token.tag + ">";
        return '</span>' + opt.getHeadingSuffix(hinfo) + '</' + token.tag + '>';
    };
}
module.exports = MarkdownItToc;
//# sourceMappingURL=index.js.map