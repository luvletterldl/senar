## 事情是这样的

### 第一天
小李是一家互联网公司的前端，有一天他闲来无事看到项目的`vue-cli`依赖版本还是`3.0.0-rc`，一股升级依赖的使命感涌上心头
![](https://img-service.csdnimg.cn/img_convert/9bf39e250b772ef89f0512adad2c075a.png)

他看了看[官网的升级文档](https://cli.vuejs.org/migrating-from-v3/)，这么简单，是时候表演真正的技术了
![](https://img-service.csdnimg.cn/img_convert/fcb0d054f9dfe0a95fc270c28b61cfaa.png)

最后发现提示没有`core-js`，然后就随手`npm i core-js -S`了，部署上线，搞定下班回家

### 第二天凌晨2点
>Oh，yeah，今天好运气，老狼请吃鸡，你打电话我不接，你打他有啥用啊~

小李猛然惊醒，这是他为产品专设的铃声，一看时间，**马萨卡**。

接到电话："线上上传不了图片了，你干啥了，昨天还行，快 快 快，快看看"。
伴随着这奇特的词语，小李光速打开电脑一看
![](https://img-service.csdnimg.cn/img_convert/96b23aa7b370d8ed0079d64587a746e7.png)
赶快看看上传组件的代码，没动过啊，内心：
![](https://img-service.csdnimg.cn/img_convert/6d679aae60446e76a114de66a8479a8d.png)

### 凌晨5点
“我搜遍了全网没人碰到这个问题，`OSS is not defined`”,
“我不管，上班前必须修好， 滴 滴 滴 ...”

小李开始了每个月总有那么几天的`bug`修复生活，内心无比抑郁，心情极度暴躁
> 既然是今天发生的是不是因为升级了@vue/cli,回退版本

**老版本可以**，小李内心有点小庆幸,知道了原因可能是因为升级脚手架导致的，但是为什么呢？

他开始梳理上传的逻辑，是按照阿里云官方的方法引入了`aliyun-upload-sdk-1.5.0.min.js`和`aliyun-oss-sdk-5.3.1.min.js`，这没毛病啊为什么`startUpload`就`OSS is not defined`啊，`WDN...`。
他开始对比`package-lock.json`和`package.json`中的依赖项，我什么时候装了`core-js^3.6.5`,卸载,纳尼？ 服务起不来了，**马萨卡**,`@vue/cli^4`依赖了`core-js^3.6.5`? 果然
![](https://img-service.csdnimg.cn/img_convert/041dc262482db194991e01e36ef0053a.png)

这玩意依赖了`core-js`，降级 吧，为啥`@vue/cli4`依赖了`core-js3`呢，为啥阿里云的`sdk`没有兼容`core-js3`呢？

打开阿里云 > 文档 > 反馈: 考虑下`JS`上传`SDK`兼容下`core-js3`?

### 有哪位老铁能给小李一个解释吗？