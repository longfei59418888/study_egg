const renderToString = require('react-dom/server').renderToString;
const React = require('react')
const StaticRouter = require("react-router-dom").StaticRouter
process.env.NODE_ENV = "production"
const Element = require('./page/other/index')

class Test extends React.Component {
    render() {

        return React.createElement('div', {
            children: this.props.children
        })
    }
}

const info = renderToString( React.createElement(StaticRouter, {
    context: {},
    location: {pathname: '/home'}
}, React.createElement(Element.default)))
console.log(info)
