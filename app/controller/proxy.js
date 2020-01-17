'use strict';
const Controller = require('egg').Controller;
const fs = require('fs')
const ph = require('path')
const transform = require("@babel/core").transformFileSync;
const ReactDOMServer = require('react-dom/server');
const React = require('react')
const reactRouterDom = require('react-router-dom');

const {StaticRouter} = reactRouterDom

class ProxyController extends Controller {
    async apps() {
        const {ctx, getPaths} = this;
        const {path} = ctx
        debugger
        const paths = getPaths(path)
        let target = null
        paths.some(item => {
            const dest = ph.join(__dirname, '..', '..', `page${item}`)
            if (fs.existsSync(dest)) {
                target = dest
                return true
            }
            return false
        });
        if (target) {
            this.render(target)
            ctx.body = '' + target
        } else {
            ctx.body = '未找到页面';
        }
    }

    getPaths(path = '', name = '/index.js') {
        const pages = []
        pages.push(path + name)
        let index = path.lastIndexOf('/')
        while (index != -1) {
            path = path.substring(0, index)
            if (path.length > 0) pages.push(path + name)
            index = path.lastIndexOf('/')
        }
        return pages.reverse()
    }

    render(target) {
        const {ctx} = this;
        // const Element = require(target)
        // const context = {};
        // const info = ReactDOMServer.renderToString(React.createElement('div', {
        //     children: Element.default
        // }))
       const info =  transform(target).code
        new Function()
        debugger
        console.log(info)
    }
}

module.exports = ProxyController;
