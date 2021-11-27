### 环境：
Nuxt + gasp 最终打包成静态文件的方式

#### 报错具体情况：
官方给的案例中是这样引入的
```javascript
import { TimelineLite } from 'gsap'
```
如果你是用Nuxt在**npm run start**或 **npm run dev**的方式的话 不会有任何问题，但是如果你编译为静态文件也就是**npm run generate**,这里就会报 `cannot assign to read only property 'y' of object '#<htmlimageelement>'`的错误

### 解决方式：
```javascript
import { TimelineLite } from 'gsap/dist/gsap'
```
[原理: 根据官网的插件建议](https://greensock.com/forums/topic/23007-importing-plugins-in-nuxt/?tab=comments#comment-108592)
