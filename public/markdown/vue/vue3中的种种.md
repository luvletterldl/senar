# Vue3中的种种

## props TS
如何声明定义当前组件的props
> 使用defineProps
```typescript
interface PropsInterface {
  num?: number
  str?: string
  list: string[]
  isShow?: boolean
}

const props = defineProps<PropsInterface>()
```
当父组件没有某些props，如何设置props的默认值?
> 使用[ withDefaults 编译器宏](https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E4%BB%85%E9%99%90-typescript-%E7%9A%84%E5%8A%9F%E8%83%BD)
```typescript
const props = withDefault(defineProps<PropsInterface>(), {
  num: 369,
  str: 'string',
  isShow: false
})
```

## emits TS

```typescript
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

## teleport
如果是传送到`vue`组件树内部一定要保证要传送到的位置已经存在，常见的做法是使用`v-if`来保证`mounted`之后展示要传送的组件
```html
// target A.vue
<template>
  <div id="target-dom"></div>
</template>

// B.vue
<script setup>
const showTeleport = ref(false)
onMounted(() => showTeleport.value = true)
</script>

<template>
  <teleport v-if="showTeleport" to="#target-dom">
    <span>I'm from B.vue</span>
  </teleport>
  <div>
    <button></button>
  </div>
</template>
```

## ref

要想拿到`ref`引用的节点，需要在节点已经挂载之后。

> 单节点`ref`

需要声明一个变量引用到模板里面的节点
```html
<script setup lang="ts">
const imgRef = ref<HTMLImageElement>(null)
</script>

<template>
  <img src="xxx" ref="imgRef" />
</template>
```

> `v-for`上的多节点`ref`

需要引用一个方法将节点便利到一个数组中
```html
<script setup lang="ts">
const urls = ['xxx', 'xxx']
const imgsRef = ref<HTMLImageElement[]>([])
  
function setImgsRef(el: HTMLImageElement){
  imgsRef.value.push(el)  
}
</script>

<template>
  <img v-for="(url) in urls" :key="url" :src="url" :ref="setImgsRef" />
</template>
```


