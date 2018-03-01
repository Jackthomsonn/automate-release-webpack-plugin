# automate-release-webpack-plugin
A webpack plugin which bumps your version number up and automates a release with Git, creating a tag and pushing up your commited code

# How to use

###### webpack.config.js
```javascript
const AutomateRelease = require('automate-release-webpack-plugin')

module.exports = {
  entry: './index.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new AutomateRelease()
  ]
};

```

### Command Line
###### On the command line, provide a --env flag and give a value of either, major, minor or patch
```
webpack --config webpack.config.js --env patch
```
