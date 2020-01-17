## 开发环境
node 稳定版本即可  

### 软件架构
基于React React-Router React-Redux ant-mobile sass ，打包工具使用webpack  
### 几个重要目录结构详解：
 |--src //编译前  
 |  |--components //公用组件   
 |  
 |  |--page //页面组件  
 |  路由对应着页面结构 /index/home  -- 对应的页面文件在  /index/home/index.jsx 
 |   
 |  |--utils //工具库  
 |  
 |  |--style //样式文件  
 |  
 |  |--decorators //装饰器  
 |  
 |  |--index.html //页面模板  
 |  
 |--output //编译后的文件    
 |  
 |--mock  // mock数据
 |  
 |--webpack  
 |  
 |  |--webpack.config.base.js  
 |  
 |  |--webpack.config.dev.js //开发环境编译(合并base)  
 |  
 |  |--webpack.config.pro.js //生产环境编译(合并base)  
### 开发流程

设置 git 配置   
git config core.autocrlf input    
git config core.safecrlf true  


npm i  
npm run devServer // 简单运行项目并建立本地服务器  
http://127.0.0.1:8088/index.html/#/index/home

npm run lint:preBilud  // build 前检查代码
npm run build // 构建打包  
npm run build:prod // 生产环境构建打包  
npm run push:dev // 自动打包上传  
npm run push   
npm run mock:start   
npm run lint:preBilud  
npm run precommit  


