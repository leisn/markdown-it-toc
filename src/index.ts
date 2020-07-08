import * as MarkdownIt from 'markdown-it';

declare namespace MarkdownItToc {
    export interface TocOptions {
        /**
         * Regular expression to detect TOC tag  
         * ( `/\[toc\]/im` for match `[toc]` by default ).
         */
        tocRegexp?: RegExp;
        /**
         * Tag for toc root element ( `div` by default ). 
         */
        tocTag?: string;
        /**
         * Attributes for toc root element ( `id="toc" class="toc-wrapper"` by default ).
         */
        tocAttrs?: string;
        /**
         * Attributes for headings `h1,h2,h3...` ( `class="toc-heading"` by default )
         * ```
         * --------------------------
         * # h1 title
         * --------------------------
         * <h1 {headingAttrs}>
         * <span>h1 title</span>
         * </h1>
         * ```
         */
        headingAttrs?: string;
        /**
         * Attributes for headings content `span` ( `class="toc-heading-content"` by default )  
         * ```
         * --------------------------
         * # headingContent
         * --------------------------
         * <h1>
         * <span {headingContentAttrs} > headingContent </span>
         * </h1>
         * ```
         */
        headingContentAttrs?: string;
        /**
         * Get toc result, return false if you don't want it show in the result html document, else return true(default `null`)
         * @param toc toc result in html 
         */
        getToc?(toc: string): boolean;
        /**
         * Get id content for forwarding in page  
         * (e.g. for info.paths=[1,2] default return  `toc-no.1-2` )
         * @param info heading info
         */
        getPathId?(info: HeadingInfo): string;
        /**
         * Content inside toc item `a` (html, include item heading text)
         * @param info heading info
         */
        getTocItemContent?(info: HeadingInfo): string;
        /**
         * Content inside heading  (html, before heading text)
         *  @param info heading info
         * ```
         * --------------------------
         * # h1 title
         * --------------------------
         * <h1>
         * {getHeadingPrefix}
         * <span>h1 title</span>
         * </h1>
         * ```
         */
        getHeadingPrefix?(info: HeadingInfo): string;
        /**
        * Content inside heading (html, after heading text)
        *  @param info heading info
        * ```
        * --------------------------
        * # h1 title
        * --------------------------
        * <h1>
        * <span>h1 title</span>
        * {getHeadingSuffix}
        * </h1>
        * ```
        */
        getHeadingSuffix?(info: HeadingInfo): string;
    }

    export interface HeadingInfo {
        /**
         * Heading level path  
         * e.g.  
         * ```
         * |h1          [1]
         * |  h2        [1,1]
         * |  h2        [1,2]
         * |    h3      [1,2,1]
         * |h1          [2]
         * |  h2        [2,1]
         * ```
         */
        paths: number[],
        /**
         * Heading tag 
         * e.g.  `h1` , `h2` , `h3`...
         */
        tag: string,
        /**
         * Tag in markdown  
         * e.g.  `#` , `=` , `-`
         */
        markup: string,
        /**
         * Content of tag  
         * e.g.  for `## titlexxx` content is `titlexxx`
         */
        content: string
    }
}

function MarkdownItToc(md: MarkdownIt, options?: MarkdownItToc.TocOptions) {
    var opt = Object.assign({
        tocRegexp: /\[toc\]/im,
        tocTag: 'div',
        tocAttrs: 'id="toc" class="toc-wrapper"',
        headingAttrs: 'class="toc-heading"',
        headingContentAttrs: 'class="toc-heading-content"',
        getPathId: function (info: MarkdownItToc.HeadingInfo) {
            return 'toc.' + info.paths.join('-');
        },
        getTocItemContent: function (info: MarkdownItToc.HeadingInfo) {
            return '<span class="toc-item-index">' + info.paths.join('.') + '</span>'+info.content;
        },
        getHeadingPrefix: function (info: MarkdownItToc.HeadingInfo) {
            return '<span class="toc-heading-prefix">' + info.paths.join('.') + '</span>';
        },
        getHeadingSuffix: function (info: MarkdownItToc.HeadingInfo) {
            return '<a href="#toc" class="toc-heading-suffix">#</a>';
        },
    }, options);
    var hInfos: MarkdownItToc.HeadingInfo[] = [];

    md.inline.ruler.after('emphasis', 'toc', (state, silent) => {
        if (silent)
            return false;
        let src = state.src;
        let match = opt.tocRegexp.exec(src);
        if (!match)
            return false;
        match.filter(m => {
            return m;
        })
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
                if (level > 9)// ######### title
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
                }
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
            } else if (diff < 0) {
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
    }

}

export = MarkdownItToc;