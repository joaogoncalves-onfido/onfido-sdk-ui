import legacy from '@vitejs/plugin-legacy'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import preact from '@preact/preset-vite'
import babel from '@rollup/plugin-babel'
export default {
  rollupInputOptions: {
    plugins: [
      babel({
        babelHelpers: 'runtime',
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts'],
      }),
    ],
  },
  plugins: [
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
}
// export default {
//   jsx: {
//     factory: 'h',
//     fragment: 'Fragment',
//   },
//   root: './demo',
//   build: {
//     outDir: '../dist',
//   },
//   resolve: {
//     alias: {
//       react: 'preact/compat',
//       'react-dom': 'preact/compat',
//     },
//   },
//   rollupInputOptions: {
//     plugins: [
//       babel({
//         sourceMaps: true,
//         presets: [
//           '@babel/env',
//           [
//             '@babel/typescript',
//             {
//               jsxPragma: 'h',
//             },
//           ],
//         ],
//         plugins: [
//           [
//             '@babel/plugin-transform-react-jsx',
//             {
//               pragma: 'h',
//             },
//           ],
//           '@babel/plugin-proposal-class-properties',
//           '@babel/plugin-proposal-function-sent',
//           '@babel/plugin-proposal-throw-expressions',
//           '@babel/plugin-proposal-export-default-from',
//         ],
//       }),
//     ],
//   },

//   plugins: [
//     // babel(),
//     preact(),
//     legacy({
//       // targets: ['defaults', 'IE 11']
//       targets: ["ie >= 11"],
//       additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
//       polyfills: ["es.array.iterator"],
//     }),
//     ViteEjsPlugin((config) => ({
//       NODE_ENV: config.mode,
//       // domain: 'example.com',
//       // title: 'My vue project!',
//     })),
//   ],
// }
