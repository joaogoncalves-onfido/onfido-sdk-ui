import { resolve } from 'path'
import { PRODUCTION_BUILD, BASE_DIR } from '../constants'

export const baseConfig = {
  mode: PRODUCTION_BUILD ? 'production' : 'development',
  context: `${BASE_DIR}/src`,
  entry: './index.tsx',

  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.scss', '.json'],
    modules: [`${BASE_DIR}/node_modules`, `${BASE_DIR}/src`],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      '~contexts': `${BASE_DIR}/src/contexts`,
      '~locales': `${BASE_DIR}/src/locales`,
      '~types': `${BASE_DIR}/src/types`,
      '~core': `${BASE_DIR}/src/core`,
      '~utils': `${BASE_DIR}/src/components/utils`,
      '~supported-documents': `${BASE_DIR}/src/supported-documents`,
      '~auth-sdk': `${BASE_DIR}/auth-sdk/FaceTec`,
      'socket.io-client': resolve(
        BASE_DIR,
        'node_modules/socket.io-client/dist/socket.io.js'
      ),
    },
  },

  stats: {
    preset: PRODUCTION_BUILD ? 'errors-warnings' : 'normal',
    errorDetails: PRODUCTION_BUILD,
    colors: true,
    // Display bailout reasons
    optimizationBailout: false,
  },

  node: {
    global: true,
    __filename: true,
    __dirname: false,
  },

  devtool: PRODUCTION_BUILD ? 'source-map' : 'cheap-module-source-map',
}
