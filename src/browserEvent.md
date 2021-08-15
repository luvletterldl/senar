### 事件冒泡与事件捕获
事件冒泡和事件捕获分别由微软和网景公司提出，这两个概念都是为了解决页面中事件流（事件发生顺序）的问题。
```html
<div id="outer">
  <p id="inner">Click me!</p>
</div>
```
上面的代码当中一个div元素当中有一个p子元素，如果两个元素都有一个click的处理函数，那么我们怎么才能知道哪一个函数会首先被触发呢？

为了解决这个问题微软和网景提出了两种几乎完全相反的概念。

#### 事件冒泡
微软提出了名为事件冒泡(event bubbling)的事件流。事件冒泡可以形象地比喻为把一颗石头投入水中，泡泡会一直从水底冒出水面。也就是说，事件会从最内层的元素开始发生，一直向上传播，直到document对象。

因此上面的例子在事件冒泡的概念下发生click事件的顺序应该是

**p -> div -> body -> html -> document**
#### 事件捕获
网景提出另一种事件流名为事件捕获(event capturing)。与事件冒泡相反，事件会从最外层开始发生，直到最具体的元素。

上面的例子在事件捕获的概念下发生click事件的顺序应该是

**document -> html -> body -> div -> p**

**事件冒泡和事件捕获过程图：**

<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/16/16a2654b0dd928ef~tplv-t2oaga2asx-watermark.awebp' width='347'>

1-5是捕获过程，5-6是目标阶段，6-10是冒泡阶段；

### addEventListener 的第三个参数
DOM2级事件”中规定的事件流同时支持了事件捕获阶段和事件冒泡阶段，而作为开发者，我们可以选择事件处理函数在哪一个阶段被调用。

addEventListener方法用来为一个特定的元素绑定一个事件处理函数，是JavaScript中的常用方法。addEventListener有三个参数：

```
element.addEventListener(event, function, useCapture)
```
|参数|描述|
|---|---|
|event|注意: 不要使用 "on" 前缀。 例如，使用 "click" ,而不是使用 "onclick"。提示： 所有 HTML DOM 事件，可以查看我们完整的 HTML DOM Event 对象参考手册。|
| function |  必须。指定要事件触发时执行的函数。当事件对象会作为第一个参数传入函数。 事件对象的类型取决于特定的事件。例如， "click" 事件属于 MouseEvent(鼠标事件) 对象。 |
| useCapture | 可能值: true - 事件句柄在捕获阶段执行（即在事件捕获阶段调用处理函数）false- false- 默认。事件句柄在冒泡阶段执行（即表示在事件冒泡的阶段调用事件处理函数）|

### 事件代理
在实际的开发当中，利用事件流的特性，我们可以使用一种叫做事件代理的方法。

```html
<ul class="color_list">        
    <li>red</li>        
    <li>orange</li>        
    <li>yellow</li>        
    <li>green</li>        
    <li>blue</li>        
    <li>purple</li>    
</ul>
<div class="box"></div>
```

```css
.color_list{            
    display: flex;            
    display: -webkit-flex;        
}        
.color_list li{            
    width: 100px;            
    height: 100px;            
    list-style: none;            
    text-align: center;            
    line-height: 100px;        
}
//每个li加上对应的颜色，此处省略
.box{            
    width: 600px;            
    height: 150px;            
    background-color: #cccccc;            
    line-height: 150px;            
    text-align: center;        
}
```

<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/16/16a264146329fa93~tplv-t2oaga2asx-watermark.awebp' width='666'>

我们想要在点击每个 li 标签时，输出li当中的颜色（innerHTML） 。常规做法是遍历每个 li ,然后在每个 li 上绑定一个点击事件：

```javascript
var color_list=document.querySelector(".color_list");            
var colors=color_list.getElementsByTagName("li");            
var box=document.querySelector(".box");            
for(var n=0;n<colors.length;n++){                
    colors[n].addEventListener("click",function(){                    
        console.log(this.innerHTML)                    
        box.innerHTML="该颜色为 "+this.innerHTML;                
    })            
}
```

这种做法在 li 较少的时候可以使用，但如果有一万个 li ，那就会导致性能降低（少了遍历所有 li 节点的操作，性能上肯定更加优化）。

这时就需要事件代理出场了，利用事件流的特性，我们只绑定一个事件处理函数也可以完成：

```javascript
function colorChange(e){                
    var e=e||window.event;//兼容性的处理         
    if(e.target.nodeName.toLowerCase()==="li"){                    
        box.innerHTML="该颜色为 "+e.target.innerHTML;                
    }                            
}            
color_list.addEventListener("click",colorChange,false)
```

**由于事件冒泡机制，点击了 li 后会冒泡到 ul ，此时就会触发绑定在 ul 上的点击事件，再利用 target 找到事件实际发生的元素，就可以达到预期的效果。**

**使用事件代理的好处不仅在于将多个事件处理函数减为一个，而且对于不同的元素可以有不同的处理方法。假如上述列表元素当中添加了其他的元素节点（如：a、span等），我们不必再一次循环给每一个元素绑定事件，直接修改事件代理的事件处理函数即可。**

nodeName 属性指定节点的节点名称。如果节点是元素节点，则 nodeName 属性返回标签名。如果节点是属性节点，则 nodeName 属性返回属性的名称。对于其他节点类型，nodeName 属性返回不同节点类型的不同名称。所有主流浏览器均支持 nodeName 属性

#### 冒泡还是捕获

对于事件代理来说，在事件捕获或者事件冒泡阶段处理并没有明显的优劣之分，但是由于事件冒泡的事件流模型被所有主流的浏览器兼容，从兼容性角度来说还是建议大家使用事件冒泡模型。

#### IE浏览器兼容
IE浏览器对addEventListener兼容性并不算太好，只有IE9以上可以使用。

<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/16/16a2645694fc3e3c~tplv-t2oaga2asx-watermark.awebp' width='666'>

要兼容旧版本的IE浏览器，可以使用IE的attachEvent函数

```javascript
object.attachEvent(event, function)
```

两个参数与addEventListener相似，分别是事件和处理函数，默认是事件冒泡阶段调用处理函数，要注意的是，写事件名时候要加上"on"前缀（"onload"、"onclick"等）。

#### 阻止事件冒泡

1. 给子级加 event.stopPropagation()

```javascript
$("#div1").mousedown(function(e){
    var e=event||window.event;
    event.stopPropagation();
});
```
2. 在事件处理函数中返回 false
```javascript
$("#div1").mousedown(function(event){
    var e=e||window.event;
    return false;
});
```
但是这两种方式是有区别的。return false 不仅阻止了事件往上冒泡，而且阻止了事件本身(默认事件)。event.stopPropagation()则只阻止事件往上冒泡，不阻止事件本身。

3.  event.target==event.currentTarget，让触发事件的元素等于绑定事件的元素，也可以阻止事件冒泡；

<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/7/16a8f8e3813c6b19~tplv-t2oaga2asx-watermark.awebp' width='600'>
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/7/16a8f8e60ebf3c9e~tplv-t2oaga2asx-watermark.awebp' width='600'>

#### 阻止默认事件
1. event.preventDefault( )
2. return false


