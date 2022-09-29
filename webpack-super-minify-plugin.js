const htmlMinify = require('html-minifier');
const { Packer } = require('roadroller');
const fs = require("fs/promises");
const tmp = require('tmp');
const ClosureCompiler = require('google-closure-compiler').compiler;

class SuperMinifyPlugin {
  static defaultOptions = {
    jsBundleName: 'bundle.js',
    htmlBundleName: 'index.html',
  };

  // Any options should be passed in the constructor of your plugin,
  // (this is a public API of your plugin).
  constructor(options = {}) {
    this.options = { ...SuperMinifyPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = SuperMinifyPlugin.name;

    // webpack module instance can be accessed from the compiler object,
    // this ensures that correct version of the module is used
    // (do not require/import the webpack or any symbols from it directly).
    const { webpack } = compiler;

    // Compilation object gives us reference to some useful constants.
    const { Compilation } = webpack;

    // RawSource is one of the "sources" classes that should be used
    // to represent asset sources in compilation.
    const { RawSource } = webpack.sources;

    // Tapping to the "thisCompilation" hook in order to further tap
    // to the compilation process on an earlier stage.
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Tapping to the static-assets processing pipeline on a specific stage.
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,

          // Using one of the later asset processing stages to ensure
          // that all static-assets were already added to the compilation by other plugins.
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        async (assets, callback) => {
          // "static-assets" is an object that contains all static-assets
          // in the compilation, the keys of the object are pathnames of the static-assets
          // and the values are file sources.

          const options = {
            includeAutoGeneratedTags: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortClassName: true,
            useShortDoctype: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            sortAttributes: true,
            minifyCSS: true,
          };
          const minifiedHtml = htmlMinify.minify(assets[this.options.htmlBundleName]._valueAsString, options);
          const htmlJs = await embedJs(minifiedHtml, assets[this.options.jsBundleName]._valueAsString);
          Object.entries(assets).forEach(entry => {
            const [filename, rawSource] = entry;
            if (filename !== this.options.htmlBundleName && filename !== this.options.jsBundleName) {
              compilation.emitAsset(`super-minified/${filename}`, rawSource);
            }
          })
          compilation.emitAsset(
            'super-minified/index.html',
            new RawSource(htmlJs)
          );
          callback();
        }
      );
    });
  }
}

async function embedJs(html, javascript) {
  const scriptTagRemoved = html.replace(new RegExp(`<script[^>]*?src=[\./]*bundle.js[^>]*?></script>`), '');
  const htmlInJs = `document.write('${scriptTagRemoved}');` + javascript;
  const closureJs = await applyClosure(htmlInJs);

  /// `-Zab33 -Zlr2737 -Zmc3 -Zmd49 -Zpr16 -S0,1,2,3,6,7,13,21,26,57,194,417`
  const inputs = [
    {
      data: closureJs,
      type: 'js',
      action: 'eval',
    },
  ];
  const options = {
    numAbbreviations: 33,
    modelMaxCount: 3,
    recipLearningRate: 2737,
    modelRecipBaseCount: 49,
    precision: 16,
    sparseSelectors: [0,1,2,3,6,7,13,21,26,57,194,417]
  };
  const packer = new Packer(inputs, options);
  console.log(await packer.optimize());
  const { firstLine, secondLine } = packer.makeDecoder();
  return `<script>\n${firstLine}\n${secondLine}\n</script>`;
}

async function applyClosure(js) {
  const tmpobj = tmp.fileSync();
  await fs.writeFile(tmpobj.name, js);
  const closureCompiler = new ClosureCompiler({
    js: tmpobj.name,
    compilation_level: 'ADVANCED',
    language_in: 'ECMASCRIPT_2020',
    language_out: 'ECMASCRIPT_2020',
  });
  return new Promise((resolve, reject) => {
    closureCompiler.run((_exitCode, stdOut, stdErr) => {
      if (stdOut !== '') {
        resolve(stdOut);
      } else if (stdErr !== '') { // only reject if stdout isn't generated
        reject(stdErr);
        return;
      }

      console.warn(stdErr); // If we make it here, there were warnings but no errors
    });
  })
}

module.exports = { SuperMinifyPlugin };
