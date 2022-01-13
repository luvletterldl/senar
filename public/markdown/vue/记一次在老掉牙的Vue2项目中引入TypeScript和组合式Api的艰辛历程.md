## 原由
现有的一个项目2年前创建的，随着时间流逝，代码量已经暴增到了将近上万个文件，但是工程化已经慢慢到了不可维护的状态，想给他来一次大换血，但是侵入式代码配置太多了……，最终以一种妥协的方式引入了TypeScript、组合式Api、vueuse，提升了项目的工程化规范程度，整个过程让我颇有感概，记录一下。

## 先配置TypeScript相关的

### 一些库的安装和配置
1. 由于`webpack`的版本还是`3.6`，尝试数次升级到`4、5`都因为大量的配置侵入性代码的大量修改工作放弃了，所以就直接找了下面这些库
```bash
npm i -D ts-loader@3.5.0 tslint@6.1.3 tslint-loader@3.6.0 fork-ts-checker-webpack-plugin@3.1.1
```
2. 接下来就是改`webpack`的配置了，修改`main.js`文件为`main.ts`,并在文件的第一行添加`// @ts-nocheck`让`TS`忽略检查此文件，在`webpack.base.config.js`的入口中相应的改为`main.ts`
3. 在`webpack.base.config.js`的`resolve`中的`extensions`中增加`.ts`和`.tsx`,`alias`规则中增加一条`'vue$': 'vue/dist/vue.esm.js'`
4. 在`webpack.base.config.js`中增加`plugins`选项添加`fork-ts-checker-webpack-plugin`，将`ts check`的任务放到单独的进程中进行，减少开发服务器启动时间
5. 在 `webpack.base.config.js`文件的`rules`中增加两条配置和`fork-ts-checker-webpack-plugin`的插件配置
```javascript
{
  test: /\.ts$/,
  exclude: /node_modules/,
  enforce: 'pre',
  loader: 'tslint-loader'
},
{
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
  options: {
    appendTsSuffixTo: [/\.vue$/],
    transpileOnly: true // disable type checker - we will use it in fork plugin
  }
},,
// ...
plugins: [new ForkTsCheckerWebpackPlugin()], // 在独立进程中处理ts-checker，缩短webpack服务冷启动、热更新时间 https://github.com/TypeStrong/ts-loader#faster-builds
```
6. 根目录中增加`tsconfig.json`文件补充相应配置，`src`目录下新增`vue-shim.d.ts`声明文件

  tsconfig.json
  
  ```json
  {
    "exclude": ["node_modules", "static", "dist"],
    "compilerOptions": {
      "strict": true,
      "module": "esnext",
      "outDir": "dist",
      "target": "es5",
      "allowJs": true,
      "jsx": "preserve",
      "resolveJsonModule": true,
      "downlevelIteration": true,
      "importHelpers": true,
      "noImplicitAny": true,
      "allowSyntheticDefaultImports": true,
      "moduleResolution": "node",
      "isolatedModules": false,
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      "lib": ["dom", "es5", "es6", "es7", "dom.iterable", "es2015.promise"],
      "sourceMap": true,
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
      },
      "pretty": true
    },
    "include": ["./src/**/*", "typings/**/*.d.ts"]
  }
  ```
  
  vue-shim.d.ts
  
  ```typescript
  declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
  }
  ```

### 路由配置的改善
原有路由配置是通过配置`path`、`name`和`component`，这样在开发和维护的过程中有一些缺点：

1. 使用的时候可能出现使用`path`或者使用`name`不规范不统一的情况
2. 开发人员在维护老代码的时候查找路由对应的单文件不方便
3. 要手动避免路由的`name`和`path`不与其他路由有冲突

将所有的路由的路径按照业务抽离到不同的枚举中。在枚举中定义可以防止路由 `path` 冲突，也可以将枚举的 `key` 定义的更加语义化，又可以借助`Typescript`的类型推导能力快速补全，在查找路由对应单文件的时候可以一步到位

为什么不用`name`，因为`name`只是一个标识这个路由的语义，当我们使用枚举类型的`path`之后，枚举的`Key`就足以充当语义化的路径`path`这个`name`属性就没有存在的必要了，我们在声明路由的时候就不需要声明`name`属性，只需要`path`和`component`字段就可以了

  demo
  
  ```typescript
  export enum ROUTER {
    Home = '/xxx/home',
    About = '/xxx/about',
  }

  export default [
    {
      path: ROUTER.Home,
      component: () => import( /* webpackChunkName:'Home' */ 'views/Home')
    },
    {
      path: ROUTER.About,
      component: () => import( /* webpackChunkName:'About' */ 'views/About')
    }
  ]

  ```
  
### 常量和枚举

之前在我们项目中也是通过把所有的常量抽离到`services/const`中进行管理，现在集成了`Typescript`之后，我们就可以在之后项目在`services/constant`中进行管理常量，在`services/enums`中管理枚举。

比如常见的接口返回的`code`就可以声明为枚举，就不用在使用的时候还需要手写`if (res.code === 200)`类似的判断了，可以直接通过声明好的`RES_CODE`枚举直接获取到所有的接口返回`code`类型

```typescript
// services/enums/index.ts
/** RES_CODE Enum */
export enum RES_CODE {
  SUCCESS = 200
  // xxx
}
```
比如`storage`的`key`我们就可以声明在`services/constant/storage.ts`中
```typescript
/** userInfo-storageKey */
export const USERINFO_STORE_KEY = 'userInfo'

/** 与用户相关的key可以通过构造一个带业务属性参数的纯函数来声明 */
export const UserSpecialInfo = (userId: string) => {
  return `specialInfo-${userId}`
}
```

### 类型声明文件规范

> 全局类型声明文件统一在根目录的`typings`文件夹中维护（可复用的数据类型）

> 比较偏业务中组装数据过程中的类型直接在所在组件中维护即可（不易复用的数据结构）

### 接口中的类型封装

**请求基类封装逻辑**

在 utils 文件夹下新增`requestWrapper.ts`文件，之后所有的请求基类方法封装可以在此文件中进行维护

```typescript
// src/utils/requestWrapper.ts
import { AxiosResponse } from 'axios'
import request from '@/utils/request'

// 请求参数在之后具体封装的时候才具体到某种类型，在此使用unknown声明，返回值为泛型S，在使用的时候填充具体类型
export function PostWrapper<S>(
  url: string,
  data: unknown,
  timeout?: number
) {
  return (request({
    url,
    method: 'post',
    data,
    timeout
  }) as AxiosResponse['data']) as BASE.BaseResWrapper<S> // BASE是在typings中定义的一个命名空间 后面会有代码说明
}
```

**在具体的业务层进行封装后的使用**

在`api/user`中新建一个`index.ts`文件，对比之前的可以做到足够简洁，也可以提供类型提示，知晓这个请求是什么请求以及参数的参数以及返回值

  ```typescript
  import { PostWrapper } from '@/utils/requestWrapper'

  // 此处只需要在注释中标注这个接口是什么接口，不需要我们通过注释来标识需要什么类型的参数，TS会帮我们完成, 只需要我们填充请求参数的类型和返回参数的类型即可约束请求方法的使用
  /** 获取用户信息 */
  export function getUserInfo(query: User.UserInfoReqType) {
    return PostWrapper<User.UserInfoResType>(
      '/api/userinfo',
      query
    )
  }
  ```

- 需要提供类型支持的接口，需要声明在`api/**/*.ts`文件中，并通过给对应的`function`标注参数请求类型和响应类型
- 如果结构极为简洁，可以不需要在`typings/request/*.d.ts`中维护，直接在封装接口处声明类型即可，如果参数稍多，都应在`typings/request/*.d.ts`中维护，避免混乱

现在业务中的服务端的接口返回的基本都是通过一层描述性对象包裹起来的，业务数据都在对象的`request`字段中，基于此我们封装接口就在`typings/request/index.d.ts`中声明请求返回的基类结构，在具体的`xxx.d.ts`中完善具体的请求类型声明，例如`user.d.ts`中的一个报错的接口，在此文件中声明全局的命名空间`User`来管理所有此类作业接口的请求和响应的数据类型

typings/request/index.d.ts

```typescript
import { RES_CODE } from '@/services/enums'

declare global {
  // * 所有的基类在此声明类型
  namespace BASE {
    // 请求返回的包裹层类型声明提供给具体数据层进行包装
    type BaseRes<T> = {
      code: RES_CODE
      result?: T
      info?: string
      time: number
      traceId: string
    }
    type BaseResWrapper<T> = Promise<BASE.BaseRes<T>>
    // 分页接口
    type BasePagination<T> = {
      content: T
      now: string
      page: number
      size: number
      totalElements: number
      totalPages: number
    }
  }
```

typings/request/user.d.ts
  
```typescript
declare namespace User {

/** 响应参数 */
type UserInfoResType = {
  id: number | string
  name: string
  // ...
}

/** 请求参数 */
type UserInfoReqType = {
  id: number | string
  // ...
}

```

### 到此TypeScript相关的就结束了，接下来是组合式Api的

## Vue2中使用组合式Api

1. 安装`@vue/componsition-api`

```bash
npm i @vue/componsition-api
```

2. 在 `main.ts` 中`use`即可在`.vue`文件中使用组合式 API

```javascript
import VueCompositionAPI from '@vue/composition-api'
// ...
Vue.use(VueCompositionAPI)
```
### Vue2 中使用组合式 Api 中的一些注意事项

1. 组合式 Api[文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)，不了解的小伙伴可以先参照文档学习一下，在比较复杂的页面，组件多的情况下组合式 API 相比传统的`Options API`更灵活，可以把逻辑抽离出去封装为单独的`use`函数，使组件代码结构更为清晰，也更方便复用业务逻辑。
2. 所有的组合式 Api 中的`api`都需要从`@vue/composition-api`中引入，然后使用`export default defineComponent({ })`替换原有的`export default { }`的写法，即可启用组合式 Api 语法和`Typescript`的类型推导(`script`需要添加对应的`lang="ts"`的`attribute`)
3. `template`中的写法和`Vue2`中一致，无需注意`Vue3`中的`v-model`和类似`.native`的事件修饰符在`Vue3`中取消等其他的[`break change`](https://v3.cn.vuejs.org/guide/migration/introduction.html#%E6%A8%A1%E6%9D%BF%E6%8C%87%E4%BB%A4)
4. 子组件中调用父组件中的方法使用`setup(props, ctx)`中的`ctx.emit(eventName, params)`即可，给`Vue`实例对象上挂载的属性和方法都可以通过`ctx.root.xxx`来获取，包括`$route`、`$router`等，为了使用方便推荐在`setup`中第一行就通过结构来声明`ctx.root`上的属性,，如果之前在Vue实例对象上添加的有业务属性相关的属性或方法可以通过扩展模块`vue/types/vue`上的`Vue`接口来添加业务属性相关的类型：

  typings/common/index.d.ts

  ```typescript
  // 1. Make sure to import 'vue' before declaring augmented types
  import Vue from 'vue'
  // 2. Specify a file with the types you want to augment
  //    Vue has the constructor type in types/vue.d.ts
  declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
      /** 当前环境是否是IE */
      isIE: boolean
      // ... 各位根据自己的业务情况自行添加
    }
  }
  ```
    
5. 所有`template`中使用到的变量、方法、对象都需要在`setup`中`return`，其他的在页面逻辑内部使用的不需要`return`
6. 推荐根据页面展示元素和用户与页面的交互行为定义`setup`中的方法，比较复杂的逻辑细节和对数据的处理尽量抽离到外部，保持`.vue`文件中的代码逻辑清晰
7. 在需求开发前，根据服务端接口数据的定义，来制定页面组件中的数据和方法的接口，可以提前声明类型，之后在开发过程中实现具体的方法
8. 在当下的`Vue2.6`版本中通过`@vue/composition-api`使用组合式 Api 不能使用`setup`[语法糖](https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6-script-setup)，待之后的`Vue2.7`版本`release`之后再观察，其他的一些 **[注意事项和限制](https://github.com/vuejs/composition-api/blob/main/README.zh-CN.md#%E9%99%90%E5%88%B6)**
  
### 基于 reactive 的 store 的风格规范

鉴于在`Vuex`中接入`TS`的不便和`Vuex`使用场景的必要性，在组合式 Api 中提供了一个最佳实践：将需要响应的数据声明在一个`ts`文件中通过`reactive`包裹初始化对象，暴漏出一个更新的方法，即可达到原有在`Vuex`中更新`store`中`state`的效果，使用`computed`可以达到`getter`的效果，哪些组件需要对数据进行获取和修改只需要引入即可，更改直接就可以达到响应效果！

提供一份Demo，各位对于这部分内容的封装可以见仁见智

```typescript
// xxxHelper.ts
import { del, reactive, readonly, computed, set } from '@vue/composition-api'

// 定义store中数据的类型，对数据结构进行约束
interface CompositionApiTestStore {
  c: number
  [propName: string]: any
}

// 初始值
const initState: CompositionApiTestStore = { c: 0 }

const state = reactive(initState)

/** 暴露出的store为只读，只能通过下面的updateStore进行更改 */
export const store = readonly(state)

/** 可以达到原有Vuex中的getter方法的效果 */
export const upperC = computed(() => {
  return store.c.toUpperCase()
})

/** 暴漏出更改state的方法，参数是state对象的子集或者无参数，如果是无参数就便利当前对象，将子对象全部删除, 否则俺需更新或者删除 */
export function updateStore(
  params: Partial<CompositionApiTestStore> | undefined
) {
  console.log('updateStore', params)
  if (params === undefined) {
    for (const [k, v] of Object.entries(state)) {
      del(state, `${k}`)
    }
  } else {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) {
        del(state, `${k}`)
      } else {
        set(state, `${k}`, v)
      }
    }
  }
}
```

## vueuse
[vueuse](https://vueuse.org/)是一个很好用的库，具体的安装和使用非常简单，但是功能很多很强大，这部分我就不展开细说了，大家去看官方文档吧！

## 总结
这次的项目升级实在是迫不得已，没办法的办法，项目已经庞大无比还要兼容IE，用的脚手架及相关库也都很久没有更新版本，在项目创建开始就已经欠下了很多的技术债了，导致后面开发维护人员叫苦不迭（其实就是我，项目是别个搞的，逃…），各位老大哥在新起项目的时候一定要斟酌脚手架和技术栈啊，不要前人挖坑后人填了……
  
如果你也在维护这样的项目，并且也受够了这种糟糕的开发体验，可以参照我的经验来改造下你的项目，如果看过感觉对你有帮助，也请给个一键三连~