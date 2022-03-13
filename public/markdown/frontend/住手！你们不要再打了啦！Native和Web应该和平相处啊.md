![native vs web](https://gitee.com/lbcdl/senar-img/raw/master/2022-3-12/1647074084465-native%20vs%20web.png)

# 摘要

1. `Native`是如何给`Web`页面提供可供`Web`调用的原生方法的
2. `Web`在执行完`Native`提供的方法之后如何知道结果，回调数据怎么传给`Web`
3. `Web`端如何优雅的使用`Native`提供的方法

# 背景

移动端在原生和网页的混合开发模式下难免会有在网页上调用原生能力的业务场景，比如操作相册、本地文件，访问摄像头等。如果原生和前端同学互相不了解对方的提供的方法的执行机制，就很容易出现类似下面这些情况：

> 原生说他提供了，前端说没有，调不到你的方法 😖

> 前端说你的方法有问题，你执行完了都没回调我，原生说我回调你了啊 😠

> 原生或前端都会说：你怎么给了我一个字符串啊，我需要对象啊 😭

然后再一通调试，写了各种看不下去的兼容代码，终于能摘下痛苦面具了，赶紧测试完上线吧……

所以原因还是在双方对彼此不了解导致的，下面就给大家伙儿把这里面的门道给说明白！

# `Native`是如何给`Web`页面提供可供`Web`调用的原生方法的

`Android`和`iOS`的可供网页调用的方法的方式是不一样的，这里只对`Android`的`webkit.WebView - addJavascriptInterface`和`iOS`的`WKWebView - evaluateJavaScript`进行剖析。这一段前端的同学可得搬个小板凳，拿个小本本好好记下来~

## `Android`：`webkit.WebView` - `addJavascriptInterface`

首先拿`Android`上举例吧，其实前端同学写的网页在`App`里面的运行时就是一个`WebView`，通常情况下原生提供给前端的`JS`方法会维护一个专门给前端提供的有很多不同方法的一个类，端上会定义一个命名空间的字符串，把所有的这个类里面的方法都放到这个命名空间下面，然后把这个命名空间挂载到网页的`window`对象也就是全局对象上，来段简单的例子代码：

```kotlin
// ... import pageage

// webview的Activity
class WebviewActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_webview)
        WebView.setWebContentsDebuggingEnabled(true)
        val webview = WebView(this)
        val context = this
        setContentView(webview)
        // 指定webview都要干什么
        webview.run {
            // 设置开启JavaScript能力
            settings.javaScriptEnabled = true
            // 添加提供给网页的js方法，并把这些方法注入到AppInterface这个全局对象里面
            addJavascriptInterface(WebAppFunctions(context, webview), "AppInterface")
            // 指定URI，加载网页
            loadUrl("https://www.baidu.com")
        }
    }
}

// 一个提供可供网页调用js方法的类
class WebAppFunctions(private val mContext: Context) {

    /**  带有这个@JavascriptInterface注解的方法都是提供给网页调用的方法 */

    /** 展示Toast */
    @JavascriptInterface
    fun showToast(toast: String) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show()
    }
}
```

当这个`WebviewActivity`被创建之后，就会将所有的`WebAppFunctions`里面的有`@JavascriptInterface`注解的方法注入到网页的`window.AppInterface`对象上，这个命名空间`AppInterface`就是上面我们`addJavascriptInterface`方法的第二个参数，这个应该是原生和网页约定好的一个命名空间字符串，这个时候我们在网页上就可以通过这样来调用原生提供给我们的`showToast`方法了:

```javascript
window.AppInterface.showToast("Hi, I'm a Native's Toast!");
```

## iOS:`WKWebView` - `evaluateJavaScript`

同样的，前端的同学也要好好看下`iOS`的。相对于`WKUserContentController`可以给网页注入方法，`evaluateJavaScript`既可以给网页注入方法，也可以执行网页的回调，所以一般使用`evaluateJavaScript`来处理和网页的交互，举个简单的 🌰：

```swift
let userContent = WKUserContentController.init()
// 推荐约定一个命名空间，在这个命名空间下，通过解析Web端传递过来的参数中的方法名、数据和回调来处理不同的逻辑
userContent.add(self, name: "AppInterface")
let config = WKWebViewConfiguration.init()
config.userContentController = userContent

let wkWebView: WKWebView = WKWebView.init(frame: UIScreen.main.bounds, configuration: config)
wkWebView.navigationDelegate = self
wkWebView.uiDelegate = self
view.addSubview(wkWebView)
view.insertSubview(wkWebView, at: 0)
wkWebView.load(URLRequest.init(url: URL.init(string: "https://www.baidu.com")!))

...

// 代理方法，window.webkit.messageHandlers.AppInterface.postMessage(xxx)实现发送到这里
func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    // WKScriptMessage有两个属性，一个是name一个是bady，name就是我们之前约定的AppInterface, body里面就是方法名（必选）、数据、回调网页的方法名
    if message.name == "AppInterface" {
        let params = message.body
        // 这里推荐约定args里面有两个参数，arg0、arg1，分别是参数和回调网页的方法名（可选）
        if (params["functionName"] == "showToast") {
          // 执行showToast操作
        }
    }
}
```

`iOS`中这种注入的方式提供给网页上调用跟`Android`不同，需要前端这么来调用：

```javascript
window.webkit.messageHandlers.AppInterface.postMessage({
  functionName: "showToast",
});
```

也就是说前面的这部分`window.webkit.messageHandlers.AppInterface.`都是一样的，调用的方法名、数据参数还有提供给原生回调我们的方法名都通过约定的`postMessage`中的参数进行传递。

# `Web`在执行完`Native`提供的方法之后如何知道结果，回调数据怎么传给`Web`

网页和原生的交互除了这种简单直接的告诉原生你要干什么之外，还有其他的一些情况，比如选取本地相册中的一个或者多个照片，这个时候问题就变得复杂了，首先我可能需要有选取照片的**类型**，比如我**只选`1`张**照片和**选多张**照片是不同的，而且多张照片的情况下应该有个上限，比如类似微信的**最多选取`9`张**这种，并且选取成功之后，网页上还需要展示出来这些照片，这个时候就需要原生在选完照片之后告诉网页选的都是哪些照片了。

举个简单的例子：**判断一个对象中有没有`name`这个属性**

## Android：

```kotlin
// 同上面的...

class WebAppFunctions(private val mContext: Context, private val webview: WebView) {

    /**
     * 是否有name属性
     * @param obj: 传进来的序列化后的对象
     * @param cbName: 执行完成后回调js的方法名
     * @return Boolean
     */
    @JavascriptInterface
    fun hasName(obj: String, cbName: String) {
        // 将序列化后的对象反序列化为JSON对象
        val data = JSONObject(obj)
        // 判断对象是否有name属性
        val result = data.has("name")
        webview.post {
            // 执行JavaScript中的回调方法并将回调数据传过去，执行成功后打印日志
            webview.evaluateJavascript("javascript:$cbName(${result})") {
                Log.i("callbackExec", "success")
            }
        }
    }
}
```

在网页中的怎么调用这个,怎么拿到回调：

```javascript
// 首先定义一个回调方法
window.nativeCallback = (res) => console.log(typeof res, res)
// 然后调用`AppInterface`上的`hasName`方法并按照约定将判断的数据序列化后和回调方法名一并传给原生
const params = JSON.stringify({ age: 18, name: 'ldl' })
window.AppInterface.hasName(params, 'nativeCallback')
// 执行成功之后，回调就会回调我们的回调并打印相应的结果
boolean true
```

## iOS

原生代码跟`Android`逻辑相同，比较简单的这里就忽略了。

在网页中的怎么调用这个,怎么拿到回调：

```javascript
// 同样的先定义回调方法，并将数据序列化
window.nativeCallback = (res) => console.log(typeof res, res);
const params = JSON.stringify({ age: 18, name: "ldl" });
window.webkit.messageHandlers.AppInterface.postMessage({
  functionName: "hasName",
  args: {
    arg0: params,
    arg1: "nativeCallback",
  },
});
```

到这里，想必原生和网页的同学都大致了解了对方的情况了，尤其是前端的同学应该知道怎么调用原生的方法了，但是`Android`和`iOS`上调用同一个方法的写法还不同，如果每次都要通过`UA`判断再执行不同的代码也太麻烦了，而且回调都是挂在全局的 window 上的还有命名冲突和内存泄漏的风险。所以我们最后聊一下如何在将调用`Android`、`iOS`的方法调用差异抹平，让前端同学可以更加优雅的调用原生方法！

# `Web`端如何优雅的使用`Native`提供的方法

## 根据我们之前的规范，所有原生提供的方法都属于以下四种类型

1. 无任何参数
2. 仅有数据参
3. 仅有回调参
4. 既有数据参，也有回调参

## 我们要针对以上四种类型来做底层封装，首先我们要解决哪些问题：

1. 不同端类型调用方式不同，如何通过封装抹平这个差异
2. 每次调用有回调的原生方法都需要在**全局声明一个函数供原生调用**，会有**命名冲突**和**内存泄漏**风险
3. 回调我们的方法**声明在全局**，需要在内部处理很多判断，我们如何**把回调的内容抽离出来**在不同的方法中处理
4. 我们在调试的时候怎么看到我**调用的是什么方法**，传的参数是什么有没有问题，如何设计一个**调用日志**

## 首先我们把锅烧热（bushi

1. 首先我们定义一个枚举维护所有的原生提供的方法

```typescript
export const enum NativeMethods {
  /** 展示toast */
  SHOW_TOAST: 'showToast',
  /** 是否有name属性 */
  HAS_NAME: 'hasName',
  // ....
}
```

2. 维护一个原生方法和数据相关的类型声明文件 native.d.ts, 并声明一个`iOS`上的需要传递给`postMessage`方法的参数类型

```typescript
declare name NATIVE {
  type SimpleDataType = string | number | boolean | symbol | null | undefined | bigint
  /** iOS原生方法参数接口 */
  interface PostiOSNativeDataInterface {
    functionName: NativeMethods
    args?: {
      arg0?: SimpleDataType
      arg1?: string
    }
  }
}
```

2. 定义一个`nativeFunctionWrapper`方法，这个方法有三个参数，第一个参数`funcionName`是方法名，第二个`params`是数据参数，第三个是`hasCallback`是否有回调，我们通过这个方法将不同端的方法调用差异抹平：

```javascript
export function nativeFunctionWrapper(
  functionName: NativeMethods,
  params?: unknown,
  hasCallback?: boolean
) {
  const iOS = Boolean(
    navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  );
  // 如果有数据切数据是引用类型就将其序列化为字符串
  let data = params;
  if (params && typeof params === "object") data = JSON.stringify(params);
  // 如果data不是undefined就是有参数，void 0是为了得到安全的undefined, callbackName是提供给原生回调我们的方法名
  const hasParams = data !== void 0,
    callbackName = "nativeCallback";
  if (hasCallback) {
    window[callbackName] = (res) => console.log(res);
  }

  if (isiOS) {
    const postData: NATIVE.PostiOSNativeDataInterface = { functionName };
    // 根据不同的情况构建不同的参数
    if (hasParams) {
      postData.args = { arg0: data };
      if (hasCallback) postData.args.arg1 = callbackName;
    } else if (hasCallback) postData.args = { arg0: callbackName };
    // 判断只有在真机上才执行，我们在电脑上的Chrome中调试的时候就不必调用执行原生方法了
    if (window.webkit) {
      window.webkit.messageHandlers.AppInterface.postMessage(postData);
    }
  } else {
    // 同样的如果宿主环境没有AppInterface就return
    if (!window.AppInterface) return;
    // 根据不同的参数情况 走不同的执行调用逻辑
    if (hasData) {
      hasCallback
        ? window.AppInterface[functionName](data, callbackName)
        : window.AppInterface[functionName](data);
    } else if (hasCallback) {
      window.AppInterface[functionName](callbackName);
    } else {
      window.AppInterface[functionName]();
    }
  }
}
```

3. 上一步我们通过`nativeFunctionWrapper`解决了我们的第一个问题，抹平了不同端同个方案的调用差异，直接可以通过调用`nativeFunctionWrapper`指定方法名、参数和是否有回调即可调用不同端的方法。其实第二步里面我们还是将原生回调我们的方法写死了，这样肯定是有问题的，我们现在来解决后面的问题：

```typescript
// 我们通过动态的设置我们的回调函数的方法名来解决这个问题，最后跟上时间戳拼接是为了防止有些方法可能调用的很频繁，导致后面的回调数据还是走到第一个回调里面
const callbackName = `NativeFun_${functionName}_callback_${Date.now()}`;
```

4. 但是我们这么做又会有内存泄漏，因为调用一次原生方法，就要往`window`上添加一个函数，我们来改造下回调函数体的内容

```typescript
const callbackName = `NativeFun_${functionName}_callback_${Date.now()}`;
if (hasCallback) {
  window[callbackName] = (res) => {
    console.log(res);
    // 释放挂载的临时函数
    window[callbackName] = null;
    // 删除临时函数全局对象并返回undefined
    void delete window[callbackName];
  };
}
```

5. 接下来我们来解决第三个问题，把回调之后的逻辑抽离出来，因为我们现在的方式，针对不同的回调拿到数据还是需要在`window[callbackName]`内部进行判断，这样很不优雅，我们来通过`Promise`对我们的`nativeFunctionWrapper`进行改造:

```typescript
export function nativeFunctionWrapper(
  functionName: NativeMethods,
  params?: unknown,
  hasCallback?: boolean
) {
  const iOS = Boolean(
    navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  );
  const errInfo = `当前环境不支持！`;
  return new Promise((resolve, reject) => {
    // 如果有数据切数据是引用类型就将其序列化为字符串
    let data = params;
    if (params && typeof params === "object") data = JSON.stringify(params);
    // 如果data不是undefined就是有参数，void 0是为了得到安全的undefined, callbackName是提供给原生回调我们的方法名
    const hasParams = data !== void 0,
      callbackName = `NativeFun_${functionName}_callback_${Date.now()}`;
    if (hasCallback) {
      window[callbackName] = (res: string) => {
        resolve(res);
        window[callbackName] = null;
        void delete window[callbackName];
      };
    }
    if (isiOS) {
      const postData: NATIVE.PostiOSNativeDataInterface = { functionName };
      // 根据不同的情况构建不同的参数
      if (hasParams) {
        postData.args = { arg0: data };
        if (hasCallback) postData.args.arg1 = callbackName;
      } else if (hasCallback) postData.args = { arg0: callbackName };
      // 判断只有在真机上才执行，我们在电脑上的Chrome中调试的时候就不必调用执行原生方法了
      if (window.webkit) {
        window.webkit.messageHandlers.AppInterface.postMessage(postData);
        if (!hasCallback) resolve(null);
      } else reject(errInfo);
    } else {
      // 同样的如果宿主环境没有AppInterface就return
      if (!window.AppInterface) return;
      // 根据不同的参数情况 走不同的执行调用逻辑
      if (hasData) {
        hasCallback
          ? window.AppInterface[functionName](data, callbackName)
          : window.AppInterface[functionName](data);
      } else if (hasCallback) {
        window.AppInterface[functionName](callbackName);
      } else {
        window.AppInterface[functionName]();
        resolve(null);
      }
    }
  });
}
```

6. 通过上面的这步改造，我们就将回调的逻辑抽离到 Promise 里面了，直接在`.then`中拿原生回调我们的数据即可，到这里我们就几乎完成所有的封装工作了，最后我们给他添加一个调用日志打印的功能：

```typescript
/** 原生方法调用日志 */
function NativeMethodInvokedLog(
  clientType: unknown,
  functionName: unknown,
  params: unknown,
  callbackName: unknown
) {
  this.clientType = clientType;
  this.functionName = functionName;
  this.params = params;
  this.calllbackName = callbackName;
}

// 在`nativeFunctionWrapper`中判断是否是`iOS`的前面加上下面这句代码
console.table(
  new NativeMethodInvokedLog(
    `${isiOS ? "iOS" : "Android"}`,
    functionName,
    data,
    callbackName
  )
);
```

这样在你调用原生的方法的时候就可以看到详细的调用信息了，是不是很 nice~

## 经过上面的改造，我们来看看我们现在该怎么调用

```typescript
// 最终一步封装后直接提供给各业务代码调用
export function hasNameAtNative(params: unknown) {
  return nativeFunctionWrapper(NativeMethods.HAS_NAME, params, true): Promise<boolean>
}
// 调用
const data = { age: 18, name: 'ldl' }
hasNameAtNative(data).then(res => {
  console.log(`data is or not has name attr: `, res)
})
```

**如果你和原生交互的数据类型比较复杂也可以在我们之前维护的`native.d.ts`文件中维护与原生交互的数据类型**

# 总结

其实原生和网页之间的交互没有什么特别难搞的东西，但是想要把这部分内容给规范化，工程化，还是要做不少工作的。也希望原生网页一家亲，大家~~核~~和平相处！大家如果有其他比较好的规范化这部分的方案也可以在评论里说一下，如果对你有帮助，还望不要吝啬你的三连。最后，有用请点赞，喜欢请关注，我是`Senar`（公号同名），谢谢各位！
