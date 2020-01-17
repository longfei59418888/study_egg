/**
 * webpack
 * @author Xiaolong
 */
const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const glob = require('glob');

function AfterBuild(option = {}) {
  this.option = option;
}

// 在插件函数的 prototype 上定义一个 `apply` 方法。
AfterBuild.prototype.apply = function (compiler) {
  compiler.plugin('done', () => {
    const { __VERSION__, IS_SAVE } = this.option;
    fs.writeFileSync(path.join(__dirname, '../source/test_page.html'), fs.readFileSync(path.join(__dirname, '../source/index.html')));
    fs.mkdirSync(path.join(__dirname, '../source/js/common'));
    fs.writeFileSync(path.join(__dirname, '../source/js/common/navigation.json'), fs.readFileSync(path.join(__dirname, './navigation.json')));
    if (IS_SAVE) {
      const dest = path.join(__dirname, `../source_map/${__VERSION__}/`);
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      shelljs.cp('-r', path.join(__dirname, '../source/*'), dest);
      glob(path.join(__dirname, '../source/js/*.js.map'), {}, (er, files) => {
        if (!er) {
          files.forEach((item) => {
            shelljs.rm(item);
          });
        }
      });
    }
  });
};  

module.exports = AfterBuild;
