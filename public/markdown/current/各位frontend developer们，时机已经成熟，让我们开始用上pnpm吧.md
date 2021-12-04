## pnpm是啥？
全称`performant npm(高性能的npm)`，见名知意，就是一个`npm`的替代品，至于为什么高性能，用什么样的方式解决了依赖包体积趋近于黑洞的问题，比这`yarn`有什么改进，已经有[官网](https://pnpm.io/zh/motivation)文档无数大佬的[解读](https://juejin.cn/post/6932046455733485575)了，我就不再罗里吧嗦再说一遍了，总之就是又快又好又省空间又省时间又安全！你说咱有啥理由不用呢？

## 为什么说现在是时机成熟的时刻
因为`nodejs`的`v16.13.0`版本和`v16.13.1`版本已经是`LTS(长期维护版)`了，为什么提到这两个版本，因为自`16.13`之后的版本内置了实验性的工具`corepack`，`corepack`是啥？

**看[文档](https://github.com/nodejs/corepack/blob/main/README.md)啊！**
不想看的我来给你简单介绍下：就是`nodejs`内置的一个**管理包管理器**的一个东西

![u=3729687073,1190663887&fm=253&fmt=auto&app=120&f=JPEG.webp](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7585677efce240abb625fbb53fe020e9~tplv-k3u1fbpfcp-watermark.image?)

别急，我再通俗的给你解释一下，你看我们平时开发的时候安装依赖都会用到啥

**1. npm**

**2. yarn**

**3. pnpm**

**4. ...**

是不是很乱？除了`nodejs`默认自带的`npm`，别的你是不是还得全局安装下？

这个`corepack`就是自`nodejs v16.13`版本之后默认自带的一个工具，专门用来管理这些安装依赖的这些个工具，**最重要的时还自带pnpm好家伙！**

## 怎么用上呢？
首先如果你没有装`nvm`请先装一个`nvm`，用来保留之前的`node`版本，不要问我`nvm`是啥

### nvm
linux和osx用户的[文档](https://github.com/nvm-sh/nvm/blob/master/README.md)

win用户的[文档](https://github.com/coreybutler/nvm-windows/blob/master/README.md)

### nvm升级
如果你是`windows`用户并且你之前就安装了`nvm-windows`，想要用`corepack`管理`pnpm`，还需要把你的`nvm-windows`升级到`1.1.8`版本，因为这个版本才能支持`corepack`

如果你不是`windows`，直接看nvm文档中的[Install & Update Script](https://github.com/nvm-sh/nvm#:~:text=Installing%20and%20Updating-,Install%20%26%20Update%20Script,-To%20install%20or)的部分升级一下或者安装一下，`source`一下你的`bash/zsh`的配置文件就好了

知道怎么升级的、踩过这个坑的可以跳过了

#### 下载安装升级包
首先在仓库的`releases`[页面](https://github.com/coreybutler/nvm-windows/releases)找到`1.1.8`版本的，然后找到名为[nvm-update.zip](https://github.com/coreybutler/nvm-windows/releases/download/1.1.8/nvm-update.zip)的文件，下载解压之后运行里面的`nvm-update.exe`就可以了

#### 踩坑
在这之前如果你使用`nvm`安装了`16.13`及以上版本的`nodejs`，请先卸载，然后右键你的开始菜单找到`Windows PowerShell(管理员)`点击，之后再通过
```bash
nvm install 16.13.1
```
安装最新的`LTS`版本，截至发文，现在最新的`LTS`版本为`16.13.1`，大家看情况安装！安装完成之后：
```bash
nvm use 16.13.1
```
切换到指定版本，接着按照`pnpm`官网的文档，先把实验性的`corepack`开启
```bash
corepack enable
```
通常`corepack`中的包管理器版本都不是最新的所以我们要升级到最新，关于最新的`pnpm`版本号，可以去[npmjs官网](https://www.npmjs.com/package/pnpm)去看，截至发文，最新版本是`6.23.6`
```bash
corepack prepare pnpm@6.23.6 --activate
```

## 大功告成
此时你就可以`pnpm install/dev/build`了，gym，起飞 唉 起飞~

![1638589973(1).jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/994493bc50994b31b0d4225997ce3ac6~tplv-k3u1fbpfcp-watermark.image?)

如果有其他安装过程中的问题，欢迎大家留言讨论！
