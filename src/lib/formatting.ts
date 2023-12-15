import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { escapeHtml, preEscapeAmp } from "src/lib/util";

import "highlight.js/styles/base16/chalk.min.css";
import markedKatex from "marked-katex-extension";

export async function renderMarkdown(markdown: string): Promise<string> {
    const preEscaped = preEscapeAmp(markdown);
    return await marked.parse(preEscaped);
}


async function loadHljs() {
    // lazy-load highlight.js to reduce bundle size
    return import("highlight.js").then((hljs) => hljs.default);
}

const marked = new Marked(
    markedHighlight({
        langPrefix: "hljs language-",
        async: true,
        highlight: async (code, lang) => {
            const hljs = await loadHljs();

            const language = hljs.getLanguage(lang) ? lang : "plaintext";

            if (code.endsWith("```")) {
                code = code.slice(0, -3);
            }

            try {
                return hljs.highlight(code, { language }).value.trim();
            } catch (error) {
                return hljs.highlight(code, { language: "plaintext" }).value.trim();
            }
        },
    })
);

marked.use({
    // breaks: false,
    tokenizer: {
        heading(src) {
            return undefined;
        },
        html(src) {
            return undefined;
        },
        list(src) {
            return undefined;
        },
        link(src) {
            return undefined;
        },
        table(src) {
            return undefined;
        },
        hr(src) {
            return undefined;
        },
        tag(src) {
            return undefined;
        },
        def(src) {
            return undefined;
        },
        reflink(src, links) {
            return undefined;
        },
        // br(src) {
        //     return undefined;
        // },
        // escape(src) {
        //     return undefined;
        // },
        // space(src) {
        //     return undefined;
        // },
        lheading(src) {
            return undefined;
        },
        // fences(src) {
        //     return undefined;
        // },
    },
    renderer: {
        html(html, block) {
            // this should NEVER be called but just in case...
            return escapeHtml(html);
        },
        link(href, title, text) {
            if (text !== href) {
                return `[${text}](${href})`;
            }
            return `<a href="${href}" target="_blank" >${href}</a>`;
        },
        blockquote(quote) {
            if (!quote.trim()) return ">";

            return `<div class="message-quote">${quote}</div>`;
        },
    },
});

marked.use(markedKatex({ colorIsTextColor: true }))