![](https://github.com/luvletterldl/the-last-naruto/raw/main/public/logo.webp)

## 摘要

[the-last-naruto](https://github.com/luvletterldl/the-last-naruto)是一个基于[Vue@2.7](https://github.com/vuejs/vue)和[Vite@3](https://github.com/vitejs/vite)的一个项目模板(支持`IE11`浏览器)，灵感来源自`antfu`大佬的[vitesse-lite](https://github.com/antfu/vitesse-lite)。旨在给项目上还需要支持`IE11`浏览器的一些同学提供近似`Vue3`生态的开发体验。

## 前言

众所周知，由于`Vue3`中的响应式系统是基于`proxy`来构建的，导致需要兼容`IE`和低版本浏览器的项目无法升级到`Vue3`。有些同学又想尝试用新的**组合式api**来组织代码，还需要借助于[@vue/composition-api](https://github.com/vuejs/composition-api)这个插件的力量，虽然也将就能用，但是`ts`不友好和缺少`setup`语法糖的境况还是令人沮丧😢。

直到那个男人在**2022年7月1日**发布了代号为`Naruto`的`Vue2.7`。喜大普奔，咱们终于能在`Vue2`里面用上**组合式api**和`setup`了，还有完备的`ts`支持💪。当时仔细看了[release blog](https://blog.vuejs.org/posts/vue-2-7-naruto.html)，发现除了可以用`Vue CLI / webpack`起项目，竟然连`Vite`也支持了！激动的💕，颤抖的🙌，借助[vite-plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)就可以用`Vite`支持我们开发`vue2.7`的项目了，鉴于之前用过`antfu`大佬`vitesse-lite`写过项目，觉得非常好用，于是我就想能既然`Vue2.7`出来了，`vite`也支持了，能不能让`Vue2.7`的项目的开发体验朝`Vue3`靠齐，毕竟天下苦`webpack`久矣，所以`the-last-naruto`就诞生了。

## 特性

### 完善的`TypeScript`和`<script setup>`语法糖

`Vue2.7`直接完美支持！

### VueUse

**开箱即用！**

### 支持使用`Vite`开发和打包
伴随`Vue2.7`的`release`，`Vue`官方也提供了对应的`Vite`插件[vite-plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)。给不能升级到`Vue@3`版本的开发者提供了大力的支持！具体配置[参考](https://github.com/underfin/vite-plugin-vue2#install)。

### 配置打包产物支持`IE11`

`Vite`的默认浏览器支持基线是`原生ESM`也就是[es6-module](https://caniuse.com/es6-module)，所以我们需要使用`Vite`官方提供的一个插件[@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)来为打包后的文件提供传统浏览器兼容性支持。具体配置[参考](https://github.com/luvletterldl/the-last-naruto/blob/main/vite.config.ts#L38)。

### 文件路由

知道`Nuxtjs`的路由系统的应该都了解这种路由系统的特点，不用手动配置路由，基于文件夹层级和文件名自动生成的路由系统，并且也支持动态路由，非常方便。在`vitesse-lite`中我知道了这么一个插件[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)，虽说这个插件的文档中说自己是支持`Vue 3 / React`应用的文件路由系统，但是经过我的尝试，不出意外的`vue@2.7`配合`vue-router@3.5.4`配置稍作改动也是可以用的，具体配置[参考](https://github.com/luvletterldl/the-last-naruto/blob/main/src/main.ts#L12)。

### 组件自动导入

了解`Vue3`和`Vite`生态的应该都知道`antfu`大佬的一个很有名也很好用的插件[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)，之前的开发中我们要使用封装好的组件，都要引入组件，并在`components`中声明，当我们的项目越来越复杂，这种代码会越来越多，导致代码可读性下降，我们使用`unplugin-vue-components`来优化这个问题，使用组件直接在模板文件中使用即可，不需要导入不需要声明，具体配置[参考](https://github.com/luvletterldl/the-last-naruto/blob/main/vite.config.ts#L34)

### 组合式Api自动导入

跟上面组件导入的痛点类似，之前我们在使用**组合式api**和`VueUse`中提供的方法来组织代码逻辑的时候还是手动引入类似`ref`、`reactive`、`onMounted`。我们可以使用[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)来优化这个问题，别问，问就是还是`antfu`大佬的库😂，具体配置[参考](https://github.com/luvletterldl/the-last-naruto/blob/main/vite.config.ts#L26)。

### UnoCSS

用过`tailwindcss`、`windicss`或者用过`vitesse-lite`模板的都大概知道`UnoCSS`的能力怎样，谁用谁知道！🤔我们借助`Vite`的能力，同样的可以在`Vue2.7`的项目中使用强大的、高性能的、高灵活性的`UnoCSS`。给你个眼神自己体会，还是`antfu`大佬的库😜，具体配置[参考](https://github.com/luvletterldl/the-last-naruto/blob/main/vite.config.ts#L44)。

### 纯CSS的图标（能力在IE11上部分支持）

十分不好意思各位，由于`antfu`大佬的[icons-in-pure-css](https://antfu.me/posts/icons-in-pure-css#colorable)方案中使用了`IE11`不支持的`CSS`能力：`IE11`中无法支持[CSS Masks](https://caniuse.com/?search=mask)和[CSS property: mask-image](https://caniuse.com/?search=mask-image)，所以这个能力在`IE11`上成为了遗憾。但是👀，也有另一种不怎么优雅的方案来提供有限的能力。

因为所有的这些`icons`都是基于[iconify](https://iconify.design/)这个图标框架的图标集[icon-sets](https://github.com/iconify/icon-sets)，其底层都是使用的`svg`来渲染，并且提供了这些`svg`的`URL`[icones.js.org](https://icones.js.org/)，我们就能拿到想要使用的图标的`URL`或者`Data URL`，判断当前浏览器如果是`IE`，就用`background-image`的方案来使用图标，通过指定元素宽高也可以模拟实现，组件大概逻辑：
```html
<div :class="isIE ? `w-${size} h-${size}` : ''" display-context inline-block text-center>
  <div v-if="isIE" :class="`w-${size} h-${size}`" :style="{ backgroundImage: `url(${Icons[name]})`, backgroundSize: '100% 100%' }" />
  <div v-else :class="`${IconName[name]} text-${size}`" inline-block />
</div>
```
具体代码[参考](https://github.com/luvletterldl/the-last-naruto/blob/main/src/components/icons/CarbonIcon.vue)。
遗憾的一点就是**图标颜色的设置**还没有一个比较好的方案，如果你有比较好的颜色改变方案，欢迎`PR`!

### CSS Variables Polyfill

感谢[ie11CustomProperties](https://github.com/nuxodin/ie11CustomProperties)的支持，只在`IE11`浏览器环境上加载一段`polyfill`来支持`css var`。

## 使用
```bash
npx degit luvletterldl/the-last-naruto your-project-name
cd your-project-name
pnpm i # If you don't have pnpm installed, run: npm install -g pnpm
```

## 总结

长江后浪推前浪，前端圈里面更是如此。`Vue`团队在打磨了好了`Vue3`生态之后，并没有选择把`Vue2`"拍死在沙滩上"。依然对`Vue2`保持初心，为我们开发者精心准备了`Vue2.7`这样的传奇版本。就像他的代号`Naruto`一样。

> 只要有树叶飞舞的地方就会有火在燃烧，火的影子照耀着村子，然后新的树叶会再次萌芽

最后，也希望[the-last-naruto](https://github.com/luvletterldl/the-last-naruto)能够帮助到你，使用有任何问题也可以给我评论或者提[issue](https://github.com/luvletterldl/the-last-naruto/issues/new)，如果有好的建议也欢迎`PR`！有用请点赞（顺便给个`Star`😜），喜欢请关注，我是`Senar`。
