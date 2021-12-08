![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508155747914.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70)

改造driver.js, 增加自己想要的样式，动态更改每一步的操作按钮的文案，并提供下一步、跳过、完成操作之后的回调能力！

## 原由
关于[driver.js](https://github.com/kamranahmedse/driver.js), 大家可以了解一下，是一个还算不错的做引导的插件, 但是在生产实践中有一些缺点：

 - 库没有提供改变引导面板样式的方法，只有设置元素显隐和遮罩背景的透明度
 - 没有提供动态改变引导面板操作按钮显隐及更新按钮文案的能力，只能在初始化时定义好

介于以上两个痛点，基于driver.js简单改造一下这个库
首先我们看下这个库是怎么使用

**安装**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508155512780.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70)

**使用**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508155524649.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70)


使用方法还是比较简单的，直接定义好要引导元素的id属性、引导文案、相对位置就可以了。

## 开始我们的改造

**第一步：更改样式**
xdm，我直接贴代码
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508155557265.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70)



**第二步：封装操作插件**
因为我们业务中需要改变关闭按钮的文案为：跳过 当前是第几步 / 总步数，所以用了一种不怎么优雅的方式动态改变当前第几步，亲测可用！

然后在下一步、跳过、完成操作中加入回调函数参数，这样就可以在完成或者跳过的时候请求接口或者更改缓存标记用户已经看过引导了，比较方便！
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508155635271.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70)



**第三步：在页面中使用**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508155700248.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70)


## 总结

做新手引导的需求原本是比较繁琐和痛苦的一件事，代码侵入性也比较强，如果能封装成可复用的插件或者工具，可大大节省我们的开发调试引导位置样式的时间，如果我的文章对你有帮助，感谢你的一键三连。


![在这里插入图片描述](https://img-blog.csdnimg.cn/20210508155716618.png)



