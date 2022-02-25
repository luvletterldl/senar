## 原由
在项目里有时候会碰到比如上传文件相关的，一般都是后端提供个接口，然后我们上传的时候后端再传到阿里OSS或者其他服务商的对象存储，然后把最终的`url`拿到存起来或者返回给前端，这种方式其实在上传图片的频率不高的业务场景中可能并无大碍，但是如果你的项目是相册类的，资源提供类的，总之就是有很频繁的上传文件的场景，可能服务器的带宽就有点扛不住了，那么有没有更好的解决方案呢？

## 服务端签名，客户端直传
其实像阿里、腾讯、七牛等云服务厂商都提供的有类似阿里的[STS(Security Token Service)临时访问权限管理服务](https://helpcdn.aliyun.com/document_detail/28756.htm?spm=a2c4g.11186623.0.0.3343fe11D4G4zB#concept-ong-5nv-xdb)，这次就以阿里云为例，给大家介绍下如何使用`STS Token`，来实现在服务端签名出`STS token`,然后提供给前端，让前端直接用这个`Token`向阿里云直传文件

### 服务端签名，获取到STS token
我们这里直接以`Node.js`为例，其他语言的服务可以在[阿里云的SDK参考（STS）文档](https://helpcdn.aliyun.com/document_detail/28784.html)里面找到，有`Python、Java...`

首先我们需要先装一个[sts-sdk](https://github.com/aliyun/openapi-core-nodejs-sdk?spm=a2c4g.11186623.0.0.3acc73bdIhnhxc)的npm包：`@alicloud/sts-sdk`（Nodejs version >= 8.5.0）

```bash
npm install @alicloud/sts-sdk
```

然后我们在utils新建一个文件`oss-sts-server.js`，用来生成`STS Token`提供给前端使用（这里只作为实例，后续大家可以自行封装）

```javascript
const StsClient = require('@alicloud/sts-sdk');

/**
 * 生成STStoken
 * @param accessKeyId AccessKey ID
 * @param accessKeySecret 从STS服务获取的临时访问密钥AccessKey Secret
 * @param roleArn 指定角色的ARN
 * @param roleSessionName 时临时Token的会话名称，自己指定用于标识你的用户，或者用于区分Token颁发给谁
 * @param durationSeconds token 有效事件，单位：秒
 * @param policy 指定的授权策略 默认为null
 * @return
 *   RequestId, 请求id
 *   AssumedRoleUser: {
 *     Arn, ${roleArn}/${roleSessionName}
 *     AssumedRoleId
 *   },
 *   Credentials: {
 *     SecurityToken, sts token
 *     AccessKeyId, accessKeyId
 *     AccessKeySecret, accessKeySecret
 *     Expiration 过期时间
 *   }
 */
export default function generateSTSToken(accessKeyId, accessKeySecret, roleArn, roleSessionName = 'external-username', durationSeconds = 3600, policy = null) {
  const sts = new StsClient({
    endpoint: 'sts.aliyuncs.com', // check this from sts console
    accessKeyId, // check this from aliyun console
    accessKeySecret // check this from aliyun console
  });
  return res = await sts.assumeRole(roleArn, roleSessionName, policy, durationSeconds);
```

这个`generateSTSToken`函数的几个入参我来解释一下，通常我们在用阿里云或者腾讯云的时候通常会开一个`RAM`账户也是就子账户，我们用子账户登录到阿里云后台后，到[对象存储（OSS）控制台页面](https://oss.console.aliyun.com/overview)，找到**安全令牌（子账号授权）**，也就是下图中标记的地方，点击上面的**前往RAM控制台**按钮

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d573d67bb7641d3a7e6c386a22d2182~tplv-k3u1fbpfcp-watermark.image?)

随后点击**开始授权**按钮，之后你就可以得到`accessKeyId`、`accessKeySecret`、`roleArn`、`roleSessionName`还有默认的过期时间`DurationsSeconds`,如下图所示，由于我之前授权过一次，所以会有左下角这个提示，这几个参数一定到保存好，**不要泄露，一旦泄露，请更改RAM账户密码，并重新生成**，使之前的失效

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e04ef0c976b0498b8241c44b4207d642~tplv-k3u1fbpfcp-watermark.image?)


### 完善服务端提供的数据

这个时候其实已经拿到`accessKeyId`、`accessKeySecret`、`stsToken`、`expiration`这四个参数了

但是客户端还需要`bucket`：**对象存储的命名空间**和`region`：**`bucket`所在地域**这两个参数

这个`bucket`其实就是对应的使用的那个`bucket`，这个可以在阿里云对象存储页面看到，有一个`bucket`列表，就是你要是用的那个`bucket`的名字

`region`就是某一个`bucket`所在的地域，比如我这个就是`oss-cn-beijing`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/513c2022923445bbaa454376261f3c0a~tplv-k3u1fbpfcp-watermark.image?)

此时服务端的工作已经完结了，可以提供前端一个接口，通过鉴权之后，返回给前端这么几个参数，接下来，让我们把舞台交给我们的前端~
```javascript
{
  accessKeyId,
  accessKeySecret,
  stsToken,
  bucket,
  region,
  expiration
}
```

## 前端的工作
好了，我们的后端同学的工作已经完成了~

前端er们来跟我 左边一起画个龙 在你右边 画一道彩虹（bushi）

首先我们也新建一个`oss-sts-client.js/ts`，然后安装一个[ali-sdk/ali-oss: Aliyun OSS(open storage service) JavaScript SDK for the browser and Node.js (github.com)](https://github.com/ali-sdk/ali-oss)的包，对了不支持IE10和之前的IE版本啊
```bash
npm install ali-oss --save
```
然后复制下面的内容到这个文件中，用js的同学可以把ts相关的代码删掉（赶紧换到TS吧，再不换没人跟你玩了）
```typescript
// 这个是服务端提供给前端的一个请求接口，返回上面我们提到的几个参数
import { getOssSTSToken } from "./request"; 
// @ts-ignore 忽略ts报错，ali-oss赶紧提供@types包吧，文档难看懂，库也没个文档，你们文档要是维护的好，我还用写这个？我都不想吐槽……（bushi）
import OSS from 'ali-oss'

type OssStsType = {
  accessKeyId: string
  accessKeySecret: string
  stsToken: string
  expiration: number // 这个是前端计算出的还有多少秒token过期
  region: string
  bucket: string
}

/**
 * 获取OSSClient
 * @param accessKeyId AccessKey ID
 * @param accessKeySecret 从STS服务获取的临时访问密钥AccessKey Secret
 * @param stsToken 从STS服务获取的安全令牌（SecurityToken）
 * @param region Bucket所在地域
 * @param bucket Bucket名称
 */
export default async function getOssClient () {
  const { code, data: params } = await getOssSTSToken();
  if (code !== 200) return false; // 如果请求出错，在上游处理
  const client = new OSS({
    ...params,
    refreshSTSTokenInterval: params.expiration,
    // 刷新临时访问凭证的时间间隔，单位为毫秒。
    //（这个refreshSTSToken是文档里的，为了保险各位可以在每次上传前先检查一次过期没有，不要依赖提供的这个方法）
    refreshSTSToken: async () => {
      const { code, data } = await getOssSTSToken(); // 过期后刷新token
      if (code === 200) {
        return data
      }
    },
  })
  return client
}

```
好了，到现在为止我们已经封装好了这个前端需要在上传文件的时候调用的方法了

### 前端维护STS Token
首先我们在前端页面第一次上传文件的时候，要调用这个`getOssClient`方法获取到`oss-client`这个对象实例，才能用这个实例进行上传操作，之后上传的时候需要先判断一下`token`过期了没有，如果没有过期，还是用这个实例进行上传操作，如果过期了，重新生成一个实例！

这里我们就拿一个简单的上传小文件为例（**大文件分片上传**，和**上传成功回调（需要后端同学提供回调地址）** 可以自己去看[文档](https://help.aliyun.com/document_detail/64047.html)，我就不展开细说了）

```javascript
async function uploadFileAction(file, client) {
  let newClient = client;
  // 伪代码：
  // if (!newClient || token is expired) { // 如果是没有实例对象或者token过期了就要重新生成
  //  newClient = await getOssClient(); // 调用上面我们封装好的一个方法
  // }
  const filePath = 'xxx/xxx/' // 最中在bucket中的存放的路径根据业务需要自行设置，文件名也是可以自行设置
  const { res, name, url } = await newClient.put(`${filePath}${file.name}`, file);
  if (res.status === 200) {
    // 这里拿到上传成功的文件的url
    return url
  }  
}
```
关于这里`oss-client`的维护策略，各位就仁者见仁智者见智吧，方案很多，怎么贴合业务怎么来，但是不推荐往`localStorage`和`sessionStorage`和`indexDB`里面存`STS token`等那些参数，你怎么就确定你的用户不是一名前端er呢？

## CORS的问题
还没完啊，xdm 稍等一下，以上的都完了之后，我们在本地联调的时候如果没有开代理还是会有CORS的问题，这时候还是要去服务端去配置，找到跨域设置，进去创建一个规则，方法看你用什么就勾上什么，**来源**和**允许`Headers`** 直接给干成`*`就完事了

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39c8f2a4349241668d1da953b7960b71~tplv-k3u1fbpfcp-watermark.image?)
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9eb8ffa7860c48059905e98ad977ab0d~tplv-k3u1fbpfcp-watermark.image?)


## 总结

笔者也是在接触阿里云的前端直传文档之后和后端同学看文档看到*头皮发麻* **之** *麻了彻底麻了* **之** *麻中麻*之后，总结一篇前后端流程都可以打通的OSS前端直传的文章，如果有问题，欢迎在评论里讨论，如果能帮助到你，给咱个三连吧


![519ae95b7f18308175d22538de7aa8e6.jpeg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f299c535a2741a3b7048bcaa0792eff~tplv-k3u1fbpfcp-watermark.image?)


