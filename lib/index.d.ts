import * as MarkdownIt from 'markdown-it';
declare namespace MarkdownItToc {
    interface TocOptions {
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
    interface HeadingInfo {
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
        paths: number[];
        /**
         * Heading tag
         * e.g.  `h1` , `h2` , `h3`...
         */
        tag: string;
        /**
         * Tag in markdown
         * e.g.  `#` , `=` , `-`
         */
        markup: string;
        /**
         * Content of tag
         * e.g.  for `## titlexxx` content is `titlexxx`
         */
        content: string;
    }
}
declare function MarkdownItToc(md: MarkdownIt, options?: MarkdownItToc.TocOptions): void;
export = MarkdownItToc;
