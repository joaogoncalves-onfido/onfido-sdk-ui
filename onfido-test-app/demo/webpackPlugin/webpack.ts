// @ts-nocheck
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { join } from 'path'

export default (config) => {
  // console.log('[TestApp]', config)
  const SDK_ENV = 'production'

  config.resolve.modules.push(join(__dirname, '../'))

  // config.entry.demo = join(__dirname, '../demo.tsx')
  // config.entry.previewer = join(__dirname, '../previewer.tsx')

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: join(__dirname, '../demo.ejs'),
      filename: 'index.html',
      minify: { collapseWhitespace: true },
      inject: 'body',
      // JWT_FACTORY: CONFIG.JWT_FACTORY,
      // DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
      chunks: [`onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}`, 'demo'],
    })
  )

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: join(__dirname, '../previewer.ejs'),
      filename: 'previewer/index.html',
      minify: { collapseWhitespace: true },
      inject: 'body',
      // JWT_FACTORY: CONFIG.JWT_FACTORY,
      // DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
      chunks: ['previewer'],
    })
  )

  console.log('---->', config)

  return config

  // return new HtmlWebpackPlugin({
  //   template: path.resolve(__dirname, '../demo.ejs'),
  //   filename: 'index.html',
  //   minify: { collapseWhitespace: true },
  //   inject: 'body',
  //   JWT_FACTORY: CONFIG.JWT_FACTORY,
  //   DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
  //   chunks: [`onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}`, 'demo'],
  // })
  return new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../previewer.ejs'),
    filename: 'previewer/index.html',
    minify: { collapseWhitespace: true },
    inject: 'body',
    // JWT_FACTORY: CONFIG.JWT_FACTORY,
    // DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
    chunks: ['previewer'],
  })
  // return config
}
