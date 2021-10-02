import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import {
  makeHtmlAttributes,
} from '@rollup/plugin-html'

const dev = (process.env.NODE_ENV === 'development')

const template = async ({
  attributes,
  files,
  meta,
  publicPath,
  title
}) => {
  const scripts = (files.js || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.script);
      return `<script src="${publicPath}${fileName}"${attrs}></script>`;
    })
    .join('\n');

  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join('\n');

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join('\n');

  return `
  <!doctype html>
  <html${makeHtmlAttributes(attributes.html)}>
    <head>
      ${metas}
      <title>${title}</title>
      ${links}
    </head>
    <body>
      <div id='root'>javascript must be enabled to view this page</div>
      ${scripts}
    </body>
  </html>`;
};


export default {
  input: './src/index.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
    resolve(),
    commonjs(),
    typescript(),
    html({
      title: 'fictionary',
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width', initialScale: 1, shrinkToFit: 'no'},
      ],
      input: 'src/index.html',
      publicPath: '', // note: may need this one
      template,
    }),
    dev && serve({
      open: true,
      verbose: true,
      contentBase: ['', 'dist'],
      historyApiFallback: true,
      host: 'localhost',
      port: 3000
    }),
    livereload({ watch: 'dist' }),
  ]
};
