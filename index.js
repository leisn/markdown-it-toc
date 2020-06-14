'use strict';

const globalOptions = {
    getToc: null,
    tocRegexp: /\[toc\]/im,
    anchorNumberIdPrefix: 'toc-no.',
    hTopLevel: 1,
    hLowLevel: 6,

    //-----------override others-----------//
    anchorClass: undefined,
    useAnchorString: undefined,
    useAnchorNumber: undefined,
    anchorSymbol: undefined,
    anchorSymbolClass: undefined,
    anchorNumberClass: undefined,
    getAnchorNumber: undefined,
};
const contentOptions = {
    //-----------self-----------//
    tocHeader: '',
    tocWrapperId: 'toc',
    tocWrapperClass: 'toc-wrapper',
    tocListClass: 'toc-list',
    tocItemClass: 'toc-item',
    headingInLink: true,

    //-----------global override-----------//
    anchorClass: 'toc-content-anchor',
    useAnchorString: false,
    useAnchorNumber: false,
    anchorSymbol: '# ',
    anchorSymbolClass: 'toc-content-syl',
    anchorNumberClass: "toc-content-no",
    getAnchorNumber: null,
};
const headingOptions = {
    //-----------global override-----------//
    anchorClass: 'toc-heading-anchor',
    useAnchorString: false,
    useAnchorNumber: false,
    anchorSymbol: '§ ',
    anchorSymbolClass: 'toc-heading-syl',
    anchorNumberClass: "toc-heading-no",
    getAnchorNumber: null,
}

module.exports = function (md, gopt, copt, hopt) {
    var gO = Object.assign({}, globalOptions, gopt);
    var cO = Object.assign({}, contentOptions, copt);
    var hO = Object.assign({}, headingOptions, hopt);

    var headPaths = [];

    md.inline.ruler.after('emphasis', 'toc', (state, silent) => {

        let src = state.src;

        if (silent)
            return false;
        let match = gO.tocRegexp.exec(src);
        if (!match)
            return false;
        match.filter(m => {
            return m;
        })
        if (match.length < 1) {
            return false;
        }
        let mk = match.pop();
        let token;
        token = state.push("toc_open", "toc", 1);
        token.markup = mk;
        token = state.push("toc_body", "", 0);
        token.content = mk;
        token = state.push("toc_close", "toc", -1);

        state.pos = state.pos + mk.length;
        return true;
    });

    md.core.ruler.push('init_doc', state => {
        let heads = new Array(10);
        for (let i = 0; i < 10; i++)
            heads[i] = 0;
        let tokens = state.tokens;

        tokens.forEach((t, index) => {
            if (t.type === 'heading_open') {
                let subPath = [];
                let level = Math.max(parseInt(t.tag[1]), t.markup.length);
                heads[level] += 1;
                for (let i = 1; i < heads.length; i++) {
                    if (i <= level)
                        subPath.push(heads[i]);
                    else
                        heads[i] = 0;
                }
                let hPath = {
                    paths: subPath,
                    tag: t.tag,
                    markup: t.markup,
                    content: tokens[index + 1].content,
                }
                headPaths.push(hPath);
            }
        });
        // console.log(headPaths);
    });

    md.renderer.rules.toc_open = function () {
        //toc 开始部分
        let head = '<div ';
        if (cO.tocWrapperId)
            head += 'id="' + cO.tocWrapperId + '" ';
        head += 'class="' + cO.tocWrapperClass + '"';
        head += '>';
        if (cO.tocHeader)
            head += cO.tocHeader;
        return head;
    }

    md.renderer.rules.toc_close = function () {
        return '</div>';
    }

    md.renderer.rules.toc_body = function () {
        let result = [];
        let lastLevel = gO.hTopLevel;
        for (let i = 0; i < headPaths.length; i++) {
            let hpath = headPaths[i];
            let xpath = hpath.paths;
            if (xpath.length < gO.hTopLevel || xpath.length > gO.hLowLevel)
                continue;
            let diff = xpath.length - lastLevel;
            if (diff > 0) {
                for (let _ = 0; _ < diff; _++)
                    result.push('<ul class="' + cO.tocListClass + '">');
            } else if (diff < 0) {
                for (let _ = 0; _ > diff; _--)
                    result.push('</ul>');
            }
            let anchor = gO.anchorNumberIdPrefix + xpath.join('-');
            let li = '<li class="' + cO.tocItemClass + '"><a href="#' + anchor +
                '" class="' + (gO.anchorClass || cO.anchorClass) + '">'
            if (gO.useAnchorString === undefined ? cO.useAnchorString : gO.useAnchorString) {
                li += '<span class="' +
                    (gO.anchorSymbolClass || cO.anchorSymbolClass) + '">' +
                    (gO.anchorSymbol || cO.anchorSymbol) + '</span>';
            }
            if (gO.useAnchorNumber === undefined ? cO.useAnchorNumber : gO.useAnchorNumber) {
                let ga = gO.getAnchorNumber || cO.getAnchorNumber;
                let nc = gO.anchorNumberClass || cO.anchorNumberClass;
                if (ga)
                    li += '<span class="' + nc + '">' + ga(xpath) + '</span>';
                else
                    li += '<span class="' + nc + '">' + xpath.join('.') + ' </span>';
            }
            if (cO.headingInLink)
                li += hpath.content + '</a>';
            else
                li += '</a>' + hpath.content;
            li += '</li>';
            result.push(li);
            lastLevel = xpath.length;
        }
        for (let _ = gO.hTopLevel; _ < lastLevel; _++)
            result.push('</ul>');
        let html = result.join('');
        if (gO.getToc) {
            if (!gO.getToc(result))
                return '';
        }
        return html;
    }

    md.renderer.rules.heading_open = function (tokens, index) {
        let t = tokens[index];
        let xpath = headPaths.shift().paths;
        if (xpath.length < gO.hTopLevel || xpath.length > gO.hLowLevel)
            return '<' + t.tag + '>';
        let anchor = gO.anchorNumberIdPrefix + xpath.join('-');

        let result = '<' + t.tag + '>';
        result += '<em id="' + anchor + '" class="' + (gO.anchorClass || hO.anchorClass) + '">';
        if (gO.useAnchorString === undefined ? hO.useAnchorString : gO.useAnchorString) {
            result += '<span class="' +
                (gO.anchorSymbolClass || hO.anchorSymbolClass) + '">' +
                (gO.anchorSymbol || hO.anchorSymbol) + '</span>';
        }
        if (gO.useAnchorNumber === undefined ? hO.useAnchorNumber : gO.useAnchorNumber) {
            let ga = gO.getAnchorNumber || hO.getAnchorNumber;
            let nc = gO.anchorNumberClass || hO.anchorNumberClass;
            if (ga)
                result += '<span class="' + nc + '">' + ga(xpath) + '</span>';
            else
                result += '<span class="' + nc + '">' + xpath.join('.') + ' </span>';
        }

        result += '</em>';

        return result;
    }
};