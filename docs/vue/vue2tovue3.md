# vue2转vue3的一些经验

## 前置条件
构建工具为`vue-cli4`，因此需要先将本地的脚手架升级到`vue-cli5`，并构建一个空的`vue3`项目，将所有业务代码`cv`到项目中

## 开始
1、首先使用，`gogocode`转换一些格式和语法
```sh
// 可以全局安装，也可以不安装，不安装则使用下面的npx命令
npm install gogocode-cli -g
// 格式化
gogocode -s ./src -t gogocode-plugin-prettier  -o ./src
npx gogocode-cli -s ./src -t gogocode-plugin-prettier  -o ./src
// vue2改成vue3语法
gogocode -s ./src -t gogocode-plugin-vue  -o ./src
npx gogocode-cli -s ./src -t gogocode-plugin-vue  -o ./src
// ElementUI 转换成 Element Plus
gogocode -s ./src -t gogocode-plugin-element  -o ./src
npx gogocode-cli -s ./src -t gogocode-plugin-element  -o ./src
```
2、package.json
element-ui 换成 element-plus，安装 @element-plus/icons
引入css
```js
import 'element-plus/theme-chalk/index.css'
```
完成以上结构后，推荐从`main.js`一步一步打开所有加载的东西，国际化、`utiljs`工具、全局组件、`svg`图标等；
然后再进行远程路由加载的修复

## 一些坑
1、表单验证 `validateField` 单个验证时，回调函数第一个值，和`elementUI`逻辑相反，返回`true`才是通过验证，不通过返回 `false`
2、 `vue3` 使用的国际化`i18n`的版本是`9.0.0`以上，并且“legacy”属性为 `false` , 否则无法使用`$tc`方法
3、`svg-sprite-loader`插件版本升级到`6.0.0`以上，不然无法配套`webpack5`
4、`vue-router4`不能一次性加载所有路由，只能一个一个添加，也就是只能循环添加，`api`由原来的`addRoutes`改成`addRoute`
5、不能使用`require`这种方式来动态加载组件，同时`()=>import()`方法的参数只能是字符串，不能用变量
改用下面这种，属于`webpack`自带的
```js
const requireComponent = require.context(
  './', // 其组件目录的相对路径true
  true, // 是否查询其子目录
  /index.vue$/ // 匹配vue后缀文件名的文件
)
requireComponent.keys().forEach((fileName) => {
const componentConfig = requireComponent(fileName)
```
6、`vue.config.js` 里面导出的对象，包起来
```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
```
7、`::v-deep`和`/deep`/穿透样式需要改成`:deep()`
8、自定义函数的方式加载组件，`vue2`用到的`extend`在`vue3`中没有，需要重写
## 可能需要下面的解决办法
9、`webpack`报错
```sh
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
 - add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }'
 - install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
 resolve.fallback: { "crypto": false }
```
原因是：`webpack5`中移除了`nodejs`核心模块的`polyfill`自动引入，所以需要手动引入
```sh
npm install node-polyfill-webpack-plugin
// 在vue.config.json中添加
//头部引用
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

//加入
configureWebpack: { 
    plugins: [new NodePolyfillPlugin()]
}
```
10、`webpack`报错
```sh
Can't resolve 'fs' in 'D:\workcode\dev\agriculture_sass\node_modules\jsonlin
```
`vue.config.js`中的配置中添加：
```js
externals: {
    fs: require('fs')
    },
```
11、`elementPlus`，属性中不存在，`size=”defualt“`，这个会报`warning`;也不存在按钮属性`type=”text“`，要换成`link`，否则报`warning`

12、如果自定义的一个可以使用`v-model`这样最简单的书写方式来写的时候，该组件内部写的更新事件如果是`update:value`，那就在组件使用时需要拆开，则需要写事件为`@update:value`，一定要完整，而不要像`elementPlus`里面只写`@update`

13、`elementPlus`的`date-picker`组件，`defaultTime`需要传入`Date`对象，而不是像`elementUI`只需要传入一个格式`（12:00:00`）,如果不传入`Date`对象该组件也不会报错，但组件无法使用，没有任何`warning`和`error`；同时`value-format`如果想生成时间戳的格式不是用之前的`timestamp`，而是`x`, 就是这个`x`，非常简单的字符；

## 配套`vscode`插件
格式化统一使用`Prettier ESLint`
```sh
// 这个是一整套关于 编辑的
Vue Volar extension Pack
// 这是针对我们使用的自动加载component组件，在业务路由组件中CTRL点击组件的标签跳转
Vue Peek
```
[参考](https://juejin.cn/post/7068556246781001765)