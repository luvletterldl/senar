### 原由
同样的是因为小程序官方不维护`audio`组件了

### 音频组件的要求与限制
1. 点击播放或者暂停
2. 显示播放进度及总时长
3. 通过图标变化显示当前音频所处状态（暂停/播放/加载中）
4. 页面音频更新时刷新组件状态
5. 全局有且只有一个音频处于播放状态
6. 离开页面之后要自动停止播放并销毁音频实例

### [材料/属性/方法](https://juejin.im/post/6854573218846638093#heading-2)
让我们开始吧🛠

### uni-app Vue
- 同样的先构造`DOM`结构
```html
<view class="custom-audio">
  <image v-if="audioSrc !== undefined && audioSrc !== null && audioSrc !== ''" @click="playOrStopAudio" :src="audioImg" class="audio-btn" />
  <text v-else @click="tips" class="audio-btn">无音源</text>
  <text>{{ fmtSecond(currentTime) }}/{{ fmtSecond(duration) }}</text>
</view>
```

- 定义接受的组件

```javascript
props: {
  audioSrc: {
    type: String,
    default: ''
  },
},
```
- 定义`CustomAudio`组件的初始化相关的操作，并给`innerAudioContext`的回调添加一些行为（之前[Taro那篇](https://juejin.im/post/6854573218846638093#heading-5)我们踩过的坑这里就直接上代码了）
```javascript
import { formatSecondToHHmmss, afterAudioPlay, beforeAudioRecordOrPlay } from '../../lib/Utils'
const iconPaused = '../../static/images/icon_paused.png'
const iconPlaying = '../../static/images/icon_playing.png'
const iconStop = '../../static/images/icon_stop.png'
const iconLoading = '../../static/images/icon_loading.gif'
// ...
data() {
  return {
    audioCtx: null, // 音频上下文
    duration: 0, // 音频总时长
    currentTime: 0, // 音频当前播放的时长
    audioImg: iconLoading, // 默认状态为加载中
  }
},
watch: {
  audioSrc: {
    handler(newSrc, oldSrc) {
      console.log('watch', newSrc, oldSrc)
      this.audioImg = iconLoading
      this.currentTime = 0
      this.duration = 0
      if (this.audioCtx === undefined) {
        this.audioCtx = uni.createInnerAudioContext()
        this.onTimeUpdate = this.audioCtx.onTimeUpdate
        this.bindAuidoCallback(this.audioCtx)
      } else {
        this.audioCtx.src = newSrc
      }
      if (this.audioCtx.play) {
        this.audioCtx.stop()
        getApp().globalData.audioPlaying = false
      }
    }
  }
},
mounted() {
  this.audioCtx = uni.createInnerAudioContext()
  this.audioCtx.src = this.audioSrc
  this.audioCtx.startTime = 0
  this.bindAuidoCallback(this.audioCtx)
},
methods: {
  bindAuidoCallback(ctx) {
    ctx.onTimeUpdate((e) => {
      this.onTimeUpdate(e)
    })
    ctx.onCanplay((e) => {
      this.onCanplay(e)
    })
    ctx.onWaiting((e) => {
      this.onWaiting(e)
    })
    ctx.onPlay((e) => {
      this.onPlay(e)
    })
    ctx.onPause((e) => {
      this.onPause(e)
    })
    ctx.onEnded((e) => {
      this.onEnded(e)
    })
    ctx.onError((e) => {
      this.onError(e)
    })
  },
  tips(){
    uni.showToast({
      title: '无效音源,请先录音',
      icon: 'none'
    })
  },
  playOrStopAudio() {
    if (this.audioCtx === null) {
      this.audioCtx = uni.createInnerAudioContext()
      this.audioCtx.src = this.audioSrc
      this.bindAuidoCallback(this.audioCtx)
    }
    if (this.audioCtx.paused) {
      if (beforeAudioRecordOrPlay('play')) {
        this.audioCtx.play()
        this.audioImg = iconPlaying
      }
    } else {
      this.audioCtx.pause()
      afterAudioPlay()
      this.audioImg = iconPaused
    }
  },
  onTimeUpdate(e) {
    console.log('onTimeUpdate', this.audioCtx.duration, this.audioCtx.currentTime)
    if (this.audioCtx.currentTime > 0 && this.audioCtx.currentTime <= 1) {
      this.currentTime = 1
    } else if (this.currentTime !== Math.floor(this.audioCtx.currentTime)) {
      this.currentTime = Math.floor(this.audioCtx.currentTime)
    }
    const duration = Math.floor(this.audioCtx.duration)
    if (this.duration !== duration) {
      this.duration = duration
    }
  },
  onCanplay(e) {
    if (this.audioImg === iconLoading) {
      this.audioImg = iconPaused
    }
    console.log('onCanplay', e)
  },
  onWaiting(e) {
    if (this.audioImg !== iconLoading) {
      this.audioImg = iconLoading
    }
  },
  onPlay(e) {
    console.log('onPlay', e, this.audioCtx.duration)
    this.audioImg = iconPlaying
    if (this.audioCtx.duration > 0 && this.audioCtx.duration <= 1) {
      this.duration = 1
    } else {
      this.duration = Math.floor(this.audioCtx.duration)
    }
  },
  onPause(e) {
    console.log('onPause', e)
    this.audioImg = iconPaused
  },
  onEnded(e) {
    console.log('onEnded', e)
    if (this.audioImg !== iconPaused) {
      this.audioImg = iconPaused
    }
    afterAudioPlay()
  },
  onError(e) {
    uni.showToast({
      title: '音频加载失败',
      icon: 'none'
    })
    throw new Error(e.errMsg, e.errCode)
  },
  fmtSecond(sec) {
    const { min, second } = formatSecondToHHmmss(sec)
    return `${min}:${second}`
  }
},
```
### 同样的`scss`文件
```css
<style lang="scss" scoped>
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
  font-size: 14px;
  .audio-btn {
    width: 10vw;
    height: 10vw;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
```

### 最后
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9wNi1qdWVqaW4uYnl0ZWltZy5jb20vdG9zLWNuLWktazN1MWZicGZjcC81NzBkZjgxZDUyNjc0ZWFhODYyYjhjOTNhYWFlZGEyMn50cGx2LWszdTFmYnBmY3Atem9vbS0xLmltYWdl?x-oss-process=image/format,png)

各位有遇到什么问题或有什么建议的可以跟我讨论哟~