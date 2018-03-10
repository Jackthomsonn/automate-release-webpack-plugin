# automate-release-webpack-plugin
A webpack plugin which bumps your version number up in your package.json file and automates a release with Git, creating a tag and pushing up your commited code

# How to use

#### webpack.config.js
```javascript

const { AutomateRelease } = require('automate-release-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new AutomateRelease( { preReleaseLabel: 'snapshot' } ) // Optional config 'preReleaseLabel' Example: 1.1.0-snapshot
  ]
};

```

#### Command Line

##### On the command line, provide a --env flag and give a value of either, major, minor or patch

```
webpack --config webpack.config.js --env patch
```

###### (If you are not sure which flag to provide, I recommend you give [this](https://semver.org/) a read)

# Important Note

### Windows Users
If you are running this plugin in a Windows environment please make sure you have [Git Bash](https://gitforwindows.org/) installed on your system and your git bash executable is set in your `$PATH` variable
