### 关于这类问题一般有两种场景

 - **引用第三方组件时**，比如引用` vue-awesome-swiper `这种的第三方组件时，因为源组件代码中包含有操作`window`对象，所以这一类的`window is not defined`按照官方的使用插件的方法引入就可以解决 
```javascript
// 现在plugins目录下新建文件vue-awesome-swiper.js
// 这里就以vue-awesome-swiper这个组件为例
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper/dist/ssr'

export default () => {
	Vue.use(VueAwesomeSwiper)
}
// 然后在nuxt.config.js文件的css和plugins中添加以下代码
css: [
	...
    { src: 'swiper/dist/css/swiper.css' },
	...
],
plugins: [
	...	
  	{ src: '~/plugins/vue-awesome-swiper', ssr: false }，
  	...
],
// 这样的话就相当于全局引入了这个组件，在你的.vue文件中就可以直接使用
// <div class="swiper-wrapper"></div>这种样式来使用这个组件
```

 - **手写的在`window`对象上的操作**。这种的就按照官方的方法
```javascript
// 在你的.vue文件中加入
if (process.client) {
  require('external_library') // 这里就是操作window对象的代码
}
// 亲测完美解决???
 ```
 
