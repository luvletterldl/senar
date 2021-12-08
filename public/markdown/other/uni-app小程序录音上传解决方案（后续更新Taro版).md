### 能力依赖
> [RecorderManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.html) 全局唯一的录音管理器

### 录音功能的要求与限制
- 与当前页面其他**音频播放/录音**功能互斥
- 是否在录音中状态显示
- 结束/不需要录音时，回收`RecorderManager`对象

### 材料
[可以/结束 录音](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c33f20130d54ee4931cd6823c601787~tplv-k3u1fbpfcp-zoom-1.image)
[录音中](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/903e312578c04f3e89e3abc7d6cc1423~tplv-k3u1fbpfcp-zoom-1.image)

### Codeing（结果代码直接看最后）

#### 构造一个简单的`DOM`结构
```html
<image @click="recordAction" :src="recordImg" class="record"/>
```

#### 先实现小程序的录音功能

```javascript
import iconRecord from '../../static/images/icon_record.png'
import iconRecording from '../../static/images/icon_recording.png'
// ...
data() {
  recordImg: iconRecord, // 录音按钮的图标
  rm: null, // 录音管理器
},
// ...
mounted() {
  if (this.rm === null) { // 录音管理器如果没有初始化就先初始化
    this.rm = uni.getRecorderManager()
  }
  // 绑定回调方法
  this.rm.onStart((e) => this.onStart(e))
  this.rm.onPause((e) => this.onPause(e))
  this.rm.onResume((e) => this.onResume(e))
  this.rm.onInterruptionBegin((e) => this.onInterruptionBegin(e))
  this.rm.onInterruptionEnd((e) => this.onInterruptionEnd(e))
  this.rm.onError((e) => this.onError(e))
},
// ...
methods: {
  // ...
  recordAction() {
    if (this.recordImg === iconRecord) {
      // 设置格式为MP3，最长60S，采样率22050
      this.rm.start({
        duration: 600000,
        format: 'mp3',
        sampleRate: 22050,
      })
      // 开始录音后绑定停止录音的回调方法
      this.rm.onStop((e) => this.onStop(e))
    } else if (this.recordImg === iconRecording) {
      this.rm.stop()
    },
  },
  onStart(e) {
    console.log('开始录音', this.question, this.subQuesIndex)
    this.recordImg = iconRecording
    console.log(e)
  },
  onPause(e) {
    console.log(e)
    afterAudioRecord()
  },
  onResume(e) {
    console.log(e)
  },
  onStop(e) {
    console.log(e)
    this.recordImg = iconRecord
    // 结束录音之后上传录音
    this.uploadMp3Action(e)
  },
  onInterruptionBegin(e) {
    console.log(e)
  },
  onInterruptionEnd(e) {
    console.log(e)
  },
  onError(e) {
    console.log(e)
  },
  uploadMp3Action(e) {
  	// TODO uploadMp3
  },
},
```

#### 只能同时有一个录音，与音频播放互斥
- `globalData`中增加两个属性`audioPlaying`，`audioRecording`
```javascript
// src/App.vue
export default {
  globalData: {  
    // 保证全局只有一个音频处于播放状态且录音与播放操作互斥
    audioPlaying: false,
    audioRecording: false,
  },
  // ...
}, 
```

- `Util`中增加判断方法

```javascript
// src/lib/Util.js
// 结束录音之后释放录音能力
export function afterAudioRecord() {
  getApp().globalData.audioRecording = false
}
// 结束音频播放之后释放音频播放能力
export function afterAudioPlay() {
  getApp().globalData.audioPlaying = false
}

/**
 * 判断是否可以录音或者播放
 * @param {string} type play | record
 */
export function beforeAudioRecordOrPlay(type) {
  const audioPlaying = getApp().globalData.audioPlaying
  const audioRecording = getApp().globalData.audioRecording
  if (audioPlaying ||audioRecording) {
    uni.showToast({
      title: audioPlaying ? '请先暂停其他音频播放' : '请先结束其他录音',
      icon: 'none'
    })
    return false
  } else {
    if (type === 'play') {
      getApp().globalData.audioPlaying = true
    } else if (type === 'record') {
      getApp().globalData.audioRecording = true
    } else {
      throw new Error('type Error', type)
    }
    return true
  }
}
```

- 改造原有`recordAction`方法
```javascript
import { beforeAudioRecordOrPlay, afterAudioRecord} from '../../lib/Utils';
// ...
recordAction() {
-  if (this.recordImg === iconRecord) {
+  if (this.recordImg === iconRecord && beforeAudioRecordOrPlay('record')) {
	// 设置格式为MP3，最长60S，采样率22050
    this.rm.start({
      duration: 600000,
      format: 'mp3',
      sampleRate: 22050,
    })
    // 开始录音后绑定停止录音的回调方法
    this.rm.onStop((e) => this.onStop(e))
  } else if (this.recordImg === iconRecording) {
    this.rm.stop()
+   afterAudioRecord()
  },
},
```

> 这样就避免了多次录音

#### 小程序录音上传
补全我们的`uploadMp3Action`方法，我们使用`uni-app`的`uni.uploadFile()`方法来上传录音文件
```javascript
uploadMp3Action(e) {
  const filePath = e.tempFilePath
  const option = {
    url: 'xxx',
    filePath,
    header,
    formData: {
      filePath
    },
    name: 'audio',
  }
  uni.showLoading({
    title: '录音上传中...'
  })
  return await uni.uploadFile(option)
  uni.hideloading()
}
```

#### 最后在页面卸载的时候回收`RecorderManager`对象
```javascript
beforeDestroy() {
  this.rm = null
}
```

### 打完收工~