## 这是个什么bug
------
### 声明
我是为了尝鲜,初始化`uni-app`项目的时候指定的`vue3`版本，这个`vue3`版本的官方还没有加入到正式版，大家项目中还是用`vue2`的赖。如果有同学也想学习一下可以按照官方的使用`cli`来创建项目`vue create -p dcloudio/uni-preset-vue#vue3 your-project-name`

有一个列表页面，大概长下面这样：
![image.png](https://img-blog.csdnimg.cn/img_convert/f38a9f3f551e9d49812a90e5f51a58dc.png)
列表中是一个组件通过`v-for`循环渲染的数据像下面这样：
```html
<div v-if="list.length > 0" class="list-wrap">
  <AccPswordCard
    v-for="(accPsword, i) in list"
    :key="i"
    :index="i"
    :accPsword="accPsword"
    @deleteCB="deleteCB"
  />
</div>
```
问题就在于我在`AccPswordCard.vue`组件里面去删除当前元素然后通知父组件更新数据重新渲染的时候出现了问题，这个代码中删除的逻辑是这样的：
```typescript
// 子组件AccPswordCard.vue
props: {
  accPsword: {
    type: Object as PropType<AccountPasswordType>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
},
emits: ["deleteCB"],
setup() {
  function deleteAP(index: number) {
    uni.showModal({
      title: "提示",
      content: `确定要删除：${name.value} 这项密码吗？删除后不可恢复！`,
      confirmText: "删除",
      confirmColor: "red",
      success(res) {
        if (res.confirm) {
          // 删除的请求
          deleteAccPsword(id.value).then(({ successStatus }) => {
            if (successStatus) {
              ctx.emit("deleteCB", index); // 在这里emit父组件的回调方法，把当前数据的索引传过去
              uni.showToast({
                icon: "success",
                title: "删除成功",
              });
          });
        }
      },
    });
  }
}

// 父组件中的方法
function deleteCB(index: number) {
  const deleteData = list.value.splice(index, 1);
  console.log("delete index: ", index, deleteData);
}
```
看这段逻辑应该没毛病吧，看效果：

![eg.gif](https://img-blog.csdnimg.cn/img_convert/9235da7a642910c958db65fda0f3f8ce.gif)
删除的元素也是对的，索引也是对的，我就搞不明白效果为什么是这样，于是乎我开始面向搜索引擎编程，折腾了许久后：我觉得这是`bug`吗？不！应该是`uni-app#vue3`的`feature`我应该适应它，嗯！对！没错就是这样！
> 此处找不到表情包
## 删除元素我有必要通知父组件让父组件删吗？
---
![1628736362(1).jpg](https://img-blog.csdnimg.cn/img_convert/8ed7771735c78864d02f1b6e3fee3821.png)

**请求接口成功后我自己把自己干掉不就得了！**
```typescript
// 在子组件AccPswordCard.vue的template里面给组件增加个v-show
<template>
  <view v-if="showAPCard" class="acc-psword-card">
  ...
// setup里面新加一个变量
const showAPCard = ref(true);
// 删除请求成功之后
showAPCard.value = false;
```
这不就行了？
![媒体2.gif](https://img-blog.csdnimg.cn/img_convert/0b128aa6fca10d8e362ee48910b16794.gif)

## 局限性
### 也不是每一种场景这种都是可以的
 - 如果这个列表页是分页加载的，还要注意处理分页的`offset`和`size`的问题，因为我们并没有删除原有的列表中的某项数据，只是不展示
 - 如果列表页的上一个页面有展示列表数量必须在返回的时候更新数量
 
## 总结
当我们解决不了框架级别的`特性（bug）`的时候，不妨跳出以往的逻辑去思考如何解决一个问题，这次的这个问题也是在尝试`uni-app#vue3`发现的，让我对父子组件在列表中的删除的这个业务场景有了新的解决方案和思考，也是值得的鸭！