# route-picker-umi3-plugin
<p>
  <a href="https://www.npmjs.com/package/route-picker-umi3-plugin"><img src="https://badgen.net/npm/v/route-picker-umi3-plugin" alt="Version" /></a>
  <a href="https://www.npmjs.com/package/route-picker-umi3-plugin"><img src="https://badgen.net/npm/dm/route-picker-umi3-plugin" alt="Downloads" /></a>
  <a href="https://www.npmjs.com/package/route-picker-umi3-plugin"><img src="https://badgen.net/npm/license/route-picker-umi3-plugin" alt="License" /></a>
</p>

该插件仅用于本地开发, 不会影响生产打包.

该插件仅适用于 **umi3**.

## 缘由
在开发一些大型项目时, 热更新的效率会比较慢, 往往一个改动需要好十几秒的时间页面才会更新.

有两个主要的原因会影响热更新的速度:

1. 当使用约定式路由时, 每次热更新时 umi 都会遍历 src 文件夹来生成一份路由表. 当文件夹中的文件很多时, 每次遍历会花费好几秒的时间.

2. 当系统中的页面很多的时候, 每次热更新时 webpack 需要重新编译所有文件, 页面越多编译时间越多.

本插件会从这两方面来着手. 

对于第 1 点, 为了防止 umi 每次都去解析文件, 插件会在 umi 在解析完配置表后 (resolveConfig) 将路由表赋给 config.routes. 

对于第 2 点, 当我们在开发的时候, 大部分的时间往往只会专注在某几个路由上, 那么项目中的其它路由就可以忽略, 从而减少编译的时间.

通过指定那几个路由, 插件会自动忽略掉其它的路由, 同时又不会影响生产的打包. 

开启插件后热更新速度大约可以快一倍 (约定式路由模式下).

## 如何使用
1. 安装插件
```
yarn add route-picker-umi3-plugin --dev
```

2. 在配置文件中注册插件. (`.umi.rc` 或者 `config/config.ts` 等)

```js
// umi 配置文件
export default defineConfig({
  plugins: ["route-picker-umi3-plugin"],
});
```

3. 指定你想要保留的路由
```js
// umi 配置文件
export default defineConfig({
  plugins: ["route-picker-umi3-plugin"],
  routePicker: ['your-route']
});
```

## 注意点
1. routePicker 里指定的路由并不需要完全匹配, 部分匹配就可以生效. 比如你可以指定 'user', 那么像 'user/login', 'user/add' 等一系列路由都将被保留.
