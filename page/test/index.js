const fs = require('fs');
import React from 'react'
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelConfig);
module.exports = (ctx) => {
    return <div>test</div>
    // require('./bin/www')(ctx)
}



// module.exports = (ctx) => {
//     return <div>test</div>
// }
