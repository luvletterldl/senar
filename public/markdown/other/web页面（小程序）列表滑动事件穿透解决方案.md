### 缘由
昨天测试给我的小程序提了一个bug，说：‘我怎么滑动弹出后的这个列表后面的列表也会跟着滑动啊，这很奇快诶’，我：‘我修复一下’。
#### 造成问题的场景
是一个**数据列表页**，通过**触底上滑**加载数据

所以我把**页面最外层**的`view`加了一个`min-height: '100vh'`让这个列表**可以自动增加高度进行扩容**

这个列表页有**很多筛选条件或者说是筛选项**，我做了一个**有背景遮罩层的弹出组件**，把这些**筛选项塞进去**，最外层的`view`给了一个`max-height: 85vh; overflow: scroll；`让它也可以在数据很多的时候**滑动去选择**某一个筛选项

**注意问题就来了**：如果弹出的筛选组件和数据列表的数据都多到超出了上述的`85vh 100vh`这时候如果滑动弹出的筛选列表`touchmove`事件就会在两个列表上同时触发，表现为**当上层列表触底或者触顶时，如果底层列表为触底或者未触顶**，就会触发底层的`touchmove`事件，就会滑动背景，也就是老生常谈的**滑动穿透**，既然找出问题发生的原因了，现在我们就开始解决吧🔨

#### 百度大法好不好？
###### 小程序端
有人说给底层列表增加一个`catchtouchmove='true'`,但这种情况下直接页面都不能滑动了，我又看到很多说给底层的列表放到[**scroll-view**](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)里面然后设置`scroll-y='true'`，通过scoll-view的事件去加载数据，但是`scroll-view`性能在列表数据特别多的时候会有折扣，这个先不谈，据本人尝试，这种方式并不奏效，可能我的姿势不对，有哪位仁兄有解决过的可以来探讨一下，欢迎留言~~

###### web端
推荐直接使用[tua-body-scroll-lock](https://github.com/tuateam/tua-body-scroll-lock/blob/HEAD/README-zh_CN.md),可以比较完美的解决这个问题。

### 祭出我的大杀器
其实我们改变一下思路问题就迎刃而解了
首先明确我们的需求：**最上层的列表滑动的时候下面的列表不能滑动**
简单啊：
我们是可以在底层的页面上监听到上层的列表有没有显示的：当上层列表展示的时候，给到底层的`view`一个`overflow: hidden;hight: 100vh`的样式，当上层隐藏的时候取消这个样式

亲测完美解决*★,°*:.☆(￣▽￣)/$:*.°★* 。