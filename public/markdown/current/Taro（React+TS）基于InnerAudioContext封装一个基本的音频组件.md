### 为什么要封装一个音频组件

主要因为微信小程序官方的`audio`不维护了，并且在很多`iOS`真机上确实也存在点击无法播放，总时长不显示等问题.
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAyMC83LzI1LzE3Mzg0ZjgxM2Q3NjNmZGQ?x-oss-process=image/format,png)
### 音频组件的要求与限制
1. **点击播放或者暂停**
2. **显示播放进度及总时长**
3. **通过图标变化显示当前音频所处状态（暂停/播放/加载中）**
4. **页面音频更新时刷新组件状态**
5. **全局有且只有一个音频处于播放状态**
6. **离开页面之后要自动停止播放并销毁音频实例**

### 材料：
[icon_loading.gif](https://img-blog.csdnimg.cn/20200725164330994.gif)
[icon_playing.png](https://img-blog.csdnimg.cn/2020072516441325.png)
[icon_paused.png](https://img-blog.csdnimg.cn/2020072516444587.png)

### InnerAudioContext提供的属性和方法
**属性**:
> string **`src`**: 音频资源的地址，用于直接播放。
> bumber **`startTime`**: 开始播放的位置（单位：s），默认为 0
> boolean **`autoplay`**: 是否自动开始播放，默认为 `false`
> boolean **`loop`**: 是否循环播放，默认为 `false`
> number **`volume`**: 音量。范围 0~1。默认为 1
> number **`playbackRate`**: 播放速度。范围 0.5-2.0，默认为 1。（Android 需要 6 及以上版本）
> number **`duration`**: 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读）
> number **`currentTime`**: 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读）
> boolean **`paused`**: 当前是是否暂停或停止状态（只读）
> number **`buffered`**: 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲（只读）

**方法**：
> **`play()`**: 播放
> **`pause()`**: 暂停。暂停后的音频再播放会从暂停处开始播放
> **`stop()`**: 停止。停止后的音频再播放会从头开始播放。
> **`seek(postions: number)`**:跳转到指定位置
> **`destory()`**: 销毁当前实例
> **`onCanplay(callback)`**: 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
> **`offCanplay(callback)`**: 取消监听音频进入可以播放状态的事件
> **`onPlay(callback)`**: 监听音频播放事件
> **`offPlay(callback)`**: 取消监听音频播放事件
> **`onPause(callback)`**: 监听音频暂停事件
> **`offPause(callback)`**: 取消监听音频暂停事件
> **`onStop(callback)`**: 监听音频停止事件
> **`offStop(callback)`**: 取消监听音频停止事件
> **`onEnded(callback)`**: 监听音频自然播放至结束的事件
> **`offEnded(callback)`**: 取消监听音频自然播放至结束的事件
> **`onTimeUpdate(callback)`**: 监听音频播放进度更新事件
> **`offTimeUpdate(callback)`**: 取消监听音频播放进度更新事件
> **`onError(callback)`**: 监听音频播放错误事件
> **`offError(callbcak)`**: 取消监听音频播放错误事件
> **`onWaiting(callback)`**: 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
> **`offWaiting(callback)`**: 取消监听音频加载中事件
> **`onSeeking(callback)`**: 监听音频进行跳转操作的事件
> **`offSeeking(callback)`**: 取消监听音频进行跳转操作的事件
> **`onSeeked(callback)`**: 监听音频完成跳转操作的事件
> **`offSeeked(callback)`**: 取消监听音频完成跳转操作的事件

让我们开始吧🛠

### Taro(React + TS)
 - 首先构建一个简单的jsx结构：
```html 
<!-- playOrPauseAudio()是一个播放或者暂停播放音频的方法 -->
<!-- fmtSecond(time)是一个将秒格式化为 分：秒 的方法 -->
<View className='custom-audio'>
  <Image onClick={() => this.playOrStopAudio()} src={audioImg} className='audio-btn' />
  <Text>{this.fmtSecond(Math.floor(currentTime))}/{this.fmtSecond(Math.floor(duration))}</Text>
</View>
```
 - 定义组件接受的参数
```javascript
type PageOwnProps = {
  audioSrc: string // 传入的音频的src
}
```
 - 定义`CustomAudio`组件的初始化相关的操作，并给`innerAudioContext`的回调添加一写行为

```javascript
// src/components/widget/CustomAudio.tsx
import Taro, { Component, ComponentClass } from '@tarojs/taro'
import { View, Image, Text } from "@tarojs/components";

import iconPaused from '../../../assets/images/icon_paused.png'
import iconPlaying from '../../../assets/images/icon_playing.png'
import iconLoading from '../../../assets/images/icon_loading.gif'

interface StateInterface {
  audioCtx: Taro.InnerAudioContext // innerAudioContext实例
  audioImg: string // 当前音频icon标识
  currentTime: number // 当前播放的时间
  duration: number // 当前音频总时长
}

class CustomAudio extends Component<{}, StateInterface> {

  constructor(props) {
    super(props)
    this.fmtSecond = this.fmtSecond.bind(this)
    this.state = {
      audioCtx: Taro.createInnerAudioContext(),
      audioImg: iconLoading, // 默认是在加载音频中的状态
      currentTime: 0,
      duration: 0
    }
  }

  componentWillMount() {
    const {
      audioCtx,
      audioImg
    } = this.state
    audioCtx.src = this.props.audioSrc
    // 当播放的时候通过TimeUpdate的回调去更改当前播放时长和总时长（总时长更新放到onCanplay回调中会出错）
    audioCtx.onTimeUpdate(() => {
      if (audioCtx.currentTime > 0 && audioCtx.currentTime <= 1) {
        this.setState({
          currentTime: 1
        })
      } else if (audioCtx.currentTime !== Math.floor(audioCtx.currentTime)) {
        this.setState({
          currentTime: Math.floor(audioCtx.currentTime)
        })
      }
      const tempDuration = Math.ceil(audioCtx.duration)
      if (this.state.duration !== tempDuration) {
        this.setState({
          duration: tempDuration
        })
      }
      console.log('onTimeUpdate')
    })
    // 当音频可以播放就将状态从loading变为可播放
    audioCtx.onCanplay(() => {
      if (audioImg === iconLoading) {
        this.setAudioImg(iconPaused)
        console.log('onCanplay')
      }
    })
    // 当音频在缓冲时改变状态为加载中
    audioCtx.onWaiting(() => {
      if (audioImg !== iconLoading) {
        this.setAudioImg(iconLoading)
      }
    })
    // 开始播放后更改图标状态为播放中
    audioCtx.onPlay(() => {
      console.log('onPlay')
      this.setAudioImg(iconPlaying)
    })
    // 暂停后更改图标状态为暂停
    audioCtx.onPause(() => {
      console.log('onPause')
      this.setAudioImg(iconPaused)
    })
    // 播放结束后更改图标状态
    audioCtx.onEnded(() => {
      console.log('onEnded')
      if (audioImg !== iconPaused) {
        this.setAudioImg(iconPaused)
      }
    })
    // 音频加载失败时 抛出异常
    audioCtx.onError((e) => {
      Taro.showToast({
        title: '音频加载失败',
        icon: 'none'
      })
      throw new Error(e.errMsg)
    })
  }

  setAudioImg(newImg: string) {
    this.setState({
      audioImg: newImg
    })
  }

  // 播放或者暂停
  playOrStopAudio() {
    const audioCtx = this.state.audioCtx
    if (audioCtx.paused) {
      audioCtx.play()
    } else {
      audioCtx.pause()
    }
  }

  fmtSecond (time: number){
    let hour = 0
    let min = 0
    let second = 0
   	if (typeof time !== 'number') {
   	  throw new TypeError('必须是数字类型')
	  } else {
        hour = Math.floor(time / 3600) >= 0 ? Math.floor(time / 3600) : 0,
        min = Math.floor(time % 3600 / 60) >= 0 ? Math.floor(time % 3600 / 60) : 0,
        second = Math.floor(time % 3600 % 60) >=0 ? Math.floor(time % 3600 % 60) : 0
	  }
    }
    return `${hour}:${min}:${second}`
  }
  
  render () {
    const {
      audioImg,
      currentTime,
      duration
    } = this.state
    return(
      <View className='custom-audio'>
        <Image onClick={() => this.playOrStopAudio()} src={audioImg} className='audio-btn' />
        <Text>{this.fmtSecond(Math.floor(currentTime))}/{this.fmtSecond(Math.floor(duration))}</Text>
      </View>
    )
  }
}

export default CustomAudio as ComponentClass<PageOwnProps, PageState>
```

### 问题
乍一看我们的组件已经满足了
1. 点击播放或者暂停
2. 显示播放进度及总时长
3. 通过图标变化显示当前音频所处状态（暂停/播放/加载中）

但是这个组件还有一些问题：
1. 页面卸载之后没有对`innerAudioContext`对象停止播放和回收
2. 一个页面如果有多个音频组件这些组件可以同时播放这会导致音源混乱，性能降低
3. 因为是在`ComponentWillMount`中初始化了`innerAudioContext`的属性所以当`props`中的`audioSrc`变化的时候组件本身不会更新音源、组件的播放状态和播放时长

### 改进
在`componentWillReceiveProps`中增加一些行为达到`props`中的`audioSrc`更新时组件的音源也做一个更新，播放时长和状态也做一个更新
```javascript
componentWillReceiveProps(nextProps) {
  const newSrc = nextProps.audioSrc || ''
  console.log('componentWillReceiveProps', nextProps)
  if (this.props.audioSrc !== newSrc && newSrc !== '') {
    const audioCtx = this.state.audioCtx
    if (!audioCtx.paused) { // 如果还在播放中，先进行停止播放操作
		audioCtx.stop()
	}
    audioCtx.src = nextProps.audioSrc
    // 重置当前播放时间和总时长
    this.setState({
      currentTime: 0,
      duration: 0,
    })
  }
}
```

这时候我们在切换音源的时候就不会存在还在播放旧音源的问题

#### 通过在`componentWillUnmount`中停止播放和销毁`innerAudioContext`达到一个提升性能的目的

```javascript
componentWillUnmount() {
  console.log('componentWillUnmount')
  this.state.audioCtx.stop()
  this.state.audioCtx.destory()
}
```

#### 通过一个全局变量`audioPlaying`来保证全局有且仅有一个音频组件可以处于播放状态

```javascript
// 在Taro中定义全局变量按照一下的规范来，获取和更改数据也要使用定义的get和set方法，直接通过Taro.getApp()是不行的
// src/lib/Global.ts
const globalData = {
  audioPlaying: false, // 默认没有音频组件处于播放状态
}

export function setGlobalData (key: string, val: any) {
  globalData[key] = val
}

export function getGlobalData (key: string) {
  return globalData[key]
}
```

#### 我们通过封装两个函数去判断是否可以播放当前音源：`beforeAudioPlay`和`afterAudioPlay`

```javascript
// src/lib/Util.ts
import Taro from '@tarojs/taro'
import { setGlobalData, getGlobalData } from "./Global";

// 每次在一个音源暂停或者停止播放的时候将全局标识audioPlaying重置为false，用以让后续的音频可以播放
export function afterAudioPlay() {
  setGlobalData('audioPlaying', false)
}

// 在每次播放音频之前检查全局变量audioPlaying是否为true，如果是true，当前音频不能播放，需要之前的音频结束或者手动去暂停或者停止之前的音频播放，如果是false，返回true，并将audioPlaying置为true
export function beforeAudioPlay() {
  const audioPlaying = getGlobalData('audioPlaying')
  if (audioPlaying) {
    Taro.showToast({
      title: '请先暂停其他音频播放',
      icon: 'none'
    })
    return false
  } else {
    setGlobalData('audioPlaying', true)
    return true
  }
}
```

#### 接下来我们改造之前的`CustomAudio`组件

```javascript
import { beforeAudioPlay, afterAudioPlay } from '../../lib/Utils';

/* ... */
// 因为组件卸载导致的停止播放别忘了也要改变全局audioPlaying的状态
componentWillUnmount() {
  console.log('componentWillUnmount')
  this.state.audioCtx.stop()
  this.state.audioCtx.destory()
  ++ afterAudioPlay()
}

/* ... */
// 每次暂停或者播放完毕的时候需要执行一次afterAudioPlay()让出播放音频的机会给其他的音频组件
audioCtx.onPause(() => {
  console.log('onPause')
  this.setAudioImg(iconPaused)
  ++ afterAudioPlay()
})
audioCtx.onEnded(() => {
  console.log('onEnded')
  if (audioImg !== iconPaused) {
    this.setAudioImg(iconPaused)
  }
  ++ afterAudioPlay()
})

/* ... */

// 播放前先检查有没有其他正在播放的音频，没有的情况下才能播放当前音频
playOrStopAudio() {
  const audioCtx = this.state.audioCtx
  if (audioCtx.paused) {
    ++ if (beforeAudioPlay()) {
      audioCtx.play()
    ++ }
  } else {
    audioCtx.pause()
  }
}

```

### 最终代码

```javascript
// src/components/widget/CustomAudio.tsx
import Taro, { Component, ComponentClass } from '@tarojs/taro'
import { View, Image, Text } from "@tarojs/components";
import { beforeAudioPlay, afterAudioPlay } from '../../lib/Utils';

import './CustomAudio.scss'
import iconPaused from '../../../assets/images/icon_paused.png'
import iconPlaying from '../../../assets/images/icon_playing.png'
import iconLoading from '../../../assets/images/icon_loading.gif'

type PageStateProps = {
}

type PageDispatchProps = {
}

type PageOwnProps = {
  audioSrc: string
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface CustomAudio {
  props: IProps
}

interface StateInterface {
  audioCtx: Taro.InnerAudioContext
  audioImg: string
  currentTime: number
  duration: number
}

class CustomAudio extends Component<{}, StateInterface> {

  constructor(props) {
    super(props)
    this.fmtSecond = this.fmtSecond.bind(this)
    this.state = {
      audioCtx: Taro.createInnerAudioContext(),
      audioImg: iconLoading,
      currentTime: 0,
      duration: 0
    }
  }

  componentWillMount() {
    const {
      audioCtx,
      audioImg
    } = this.state
    audioCtx.src = this.props.audioSrc
    // 当播放的时候通过TimeUpdate的回调去更改当前播放时长和总时长（总时长更新放到onCanplay回调中会出错）
    audioCtx.onTimeUpdate(() => {
      if (audioCtx.currentTime > 0 && audioCtx.currentTime <= 1) {
        this.setState({
          currentTime: 1
        })
      } else if (audioCtx.currentTime !== Math.floor(audioCtx.currentTime)) {
        this.setState({
          currentTime: Math.floor(audioCtx.currentTime)
        })
      }
      const tempDuration = Math.ceil(audioCtx.duration)
      if (this.state.duration !== tempDuration) {
        this.setState({
          duration: tempDuration
        })
      }
      console.log('onTimeUpdate')
    })
    // 当音频可以播放就将状态从loading变为可播放
    audioCtx.onCanplay(() => {
      if (audioImg === iconLoading) {
        this.setAudioImg(iconPaused)
        console.log('onCanplay')
      }
    })
    // 当音频在缓冲时改变状态为加载中
    audioCtx.onWaiting(() => {
      if (audioImg !== iconLoading) {
        this.setAudioImg(iconLoading)
      }
    })
    // 开始播放后更改图标状态为播放中
    audioCtx.onPlay(() => {
      console.log('onPlay')
      this.setAudioImg(iconPlaying)
    })
    // 暂停后更改图标状态为暂停
    audioCtx.onPause(() => {
      console.log('onPause')
      this.setAudioImg(iconPaused)
      afterAudioPlay()
    })
    // 播放结束后更改图标状态
    audioCtx.onEnded(() => {
      console.log('onEnded')
      if (audioImg !== iconPaused) {
        this.setAudioImg(iconPaused)
      }
      afterAudioPlay()
    })
    // 音频加载失败时 抛出异常
    audioCtx.onError((e) => {
      Taro.showToast({
        title: '音频加载失败',
        icon: 'none'
      })
      throw new Error(e.errMsg)
    })
  }

  componentWillReceiveProps(nextProps) {
  	const newSrc = nextProps.audioSrc || ''
	console.log('componentWillReceiveProps', nextProps)
	if (this.props.audioSrc !== newSrc && newSrc !== '') {
	  const audioCtx = this.state.audioCtx
	  if (!audioCtx.paused) { // 如果还在播放中，先进行停止播放操作
		audioCtx.stop()
	  }
	  audioCtx.src = nextProps.audioSrc
	  // 重置当前播放时间和总时长
	  this.setState({
	    currentTime: 0,
	    duration: 0,
	  })
	}
  }

  componentWillUnmount() {
	console.log('componentWillUnmount')
	this.state.audioCtx.stop()
	this.state.audioCtx.destory()
	afterAudioPlay()
  }

  setAudioImg(newImg: string) {
    this.setState({
      audioImg: newImg
    })
  }

  playOrStopAudio() {
    const audioCtx = this.state.audioCtx
    if (audioCtx.paused) {
      if (beforeAudioPlay()) {
        audioCtx.play()
      }
    } else {
      audioCtx.pause()
    }
  }

  fmtSecond (time: number){
    let hour = 0
    let min = 0
    let second = 0
   	if (typeof time !== 'number') {
   	  throw new TypeError('必须是数字类型')
	  } else {
        hour = Math.floor(time / 3600) >= 0 ? Math.floor(time / 3600) : 0,
        min = Math.floor(time % 3600 / 60) >= 0 ? Math.floor(time % 3600 / 60) : 0,
        second = Math.floor(time % 3600 % 60) >=0 ? Math.floor(time % 3600 % 60) : 0
	  }
    }
    return `${hour}:${min}:${second}`
  }

  render () {
    const {
      audioImg,
      currentTime,
      duration
    } = this.state
    return(
      <View className='custom-audio'>
        <Image onClick={() => this.playOrStopAudio()} src={audioImg} className='audio-btn' />
        <Text>{this.fmtSecond(Math.floor(currentTime))}/{this.fmtSecond(Math.floor(duration))}</Text>
      </View>
    )
  }

}

export default CustomAudio as ComponentClass<PageOwnProps, PageState>
```
#### 提供一份样式文件，也可以自己自行发挥

```css
// src/components/widget/CustomAudio.scss
.custom-audio {
  border-radius: 8vw;
  border: #CCC 1px solid;
  background: #F3F6FC;
  color: #333;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 2vw;
  font-size: 4vw;
  .audio-btn {
    width: 10vw;
    height: 10vw;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```
### 最终效果~
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200725184319415.gif)

*★,°*:.☆(￣▽￣)/$:*.°★* 。完美*★,°*:.☆(￣▽￣)/$:*.°★* 。🎉🎉🎉

有什么好的建议大家可以在评论区跟我讨论下哈，别忘了点赞收藏分享哦，下期就更`uni-app`版本的~