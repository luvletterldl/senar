
## 一款功能极其强大的图片编辑插件 [tui.image-editor](https://github.com/nhn/tui.image-editor)

### 快速体验

- 首选在你的前端项目中安装：
```bash
npm i tui-image-editor
// or
yarn add tui-image-editor
```
- 现在你就去新建一个`.vue`文件，复制进去下面这段代码：
```javascript
<template>
  <div id="tui-image-editor"></div>
</template>
<script>
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
const ImageEditor = require("tui-image-editor");
export default {
  data() {
    return {
      instance: null,
    }
  },
  mounted() {
    this.instance = new ImageEditor(
        document.querySelector("#tui-image-editor"),
        {
          includeUI: {
            loadImage: {
              path: "https://uploadbeta.com/api/pictures/random/",
              name: "image"
            },
            initMenu: "draw",
            menuBarPosition: "bottom"
          },
        }
      );
  }
}
</script>
```
#### 默认效果：
![默认效果图](https://img-blog.csdnimg.cn/20201122131311186.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70#pic_center)

#### 国际化：
工具中的描述默认都是英文的我们先把这部分汉化一下：
```javascript
// 将原有的代码改为这样
<template>
  <div id="tui-image-editor"></div>
</template>
<script>
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
const ImageEditor = require("tui-image-editor");
const locale_zh = {
  // override default English locale to your custom
  Crop: "裁剪",
  DeleteAll: "全部删除",
  Delete: "删除",
  Undo: "撤销",
  Redo: "反撤销",
  Reset: "重置",
  Flip: "镜像",
  Rotate: "旋转",
  Draw: "画",
  Shape: "形状标注",
  Icon: "图标标注",
  Text: "文字标注",
  Mask: "遮罩",
  Filter: "滤镜",
  Bold: "加粗",
  Italic: "斜体",
  Underline: "下划线",
  Left: "左对齐",
  Center: "居中",
  Right: "右对齐",
  Color: "颜色",
  "Text size": "字体大小",
  Custom: "自定义",
  Square: "正方形",
  Apply: "应用",
  Cancel: "取消",
  "Flip X": "X 轴",
  "Flip Y": "Y 轴",
  Range: "区间",
  Stroke: "描边",
  Fill: "填充",
  Circle: "圆",
  Triangle: "三角",
  Rectangle: "矩形",
  Free: "曲线",
  Straight: "直线",
  Arrow: "箭头",
  "Arrow-2": "箭头2",
  "Arrow-3": "箭头3",
  "Star-1": "星星1",
  "Star-2": "星星2",
  Polygon: "多边形",
  Location: "定位",
  Heart: "心形",
  Bubble: "气泡",
  "Custom icon": "自定义图标",
  "Load Mask Image": "加载蒙层图片",
  Grayscale: "灰度",
  Blur: "模糊",
  Sharpen: "锐化",
  Emboss: "浮雕",
  "Remove White": "除去白色",
  Distance: "距离",
  Brightness: "亮度",
  Noise: "噪音",
  "Color Filter": "彩色滤镜",
  Sepia: "棕色",
  Sepia2: "棕色2",
  Invert: "负片",
  Pixelate: "像素化",
  Threshold: "阈值",
  Tint: "色调",
  Multiply: "正片叠底",
  Blend: "混合色"
  // etc...
};
export default {
  data() {
    return {
      instance: null,
    }
  },
  mounted() {
    this.instance = new ImageEditor(
        document.querySelector("#tui-image-editor"),
        {
          includeUI: {
            loadImage: {
              path: "https://uploadbeta.com/api/pictures/random/",
              name: "image"
            },
            initMenu: "draw",
            menuBarPosition: "bottom",
            locale: locale_zh // 本地化语言为中文
          },
        }
      );
  }
}
</script>
```

#### 汉化后
![汉化后](https://img-blog.csdnimg.cn/20201122131924852.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70#pic_center)
这时候你会发现你可能不需要右上角的`Load`和`Download`和左上角这个默认的`logo`，我们可以通过自定义主题将这部分改掉：
修改上面的代码为：
```javascript
<template>
  <div id="tui-image-editor"></div>
</template>
<script>
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
const ImageEditor = require("tui-image-editor");
const locale_zh = {
  // override default English locale to your custom
  Crop: "裁剪",
  DeleteAll: "全部删除",
  Delete: "删除",
  Undo: "撤销",
  Redo: "反撤销",
  Reset: "重置",
  Flip: "镜像",
  Rotate: "旋转",
  Draw: "画",
  Shape: "形状标注",
  Icon: "图标标注",
  Text: "文字标注",
  Mask: "遮罩",
  Filter: "滤镜",
  Bold: "加粗",
  Italic: "斜体",
  Underline: "下划线",
  Left: "左对齐",
  Center: "居中",
  Right: "右对齐",
  Color: "颜色",
  "Text size": "字体大小",
  Custom: "自定义",
  Square: "正方形",
  Apply: "应用",
  Cancel: "取消",
  "Flip X": "X 轴",
  "Flip Y": "Y 轴",
  Range: "区间",
  Stroke: "描边",
  Fill: "填充",
  Circle: "圆",
  Triangle: "三角",
  Rectangle: "矩形",
  Free: "曲线",
  Straight: "直线",
  Arrow: "箭头",
  "Arrow-2": "箭头2",
  "Arrow-3": "箭头3",
  "Star-1": "星星1",
  "Star-2": "星星2",
  Polygon: "多边形",
  Location: "定位",
  Heart: "心形",
  Bubble: "气泡",
  "Custom icon": "自定义图标",
  "Load Mask Image": "加载蒙层图片",
  Grayscale: "灰度",
  Blur: "模糊",
  Sharpen: "锐化",
  Emboss: "浮雕",
  "Remove White": "除去白色",
  Distance: "距离",
  Brightness: "亮度",
  Noise: "噪音",
  "Color Filter": "彩色滤镜",
  Sepia: "棕色",
  Sepia2: "棕色2",
  Invert: "负片",
  Pixelate: "像素化",
  Threshold: "阈值",
  Tint: "色调",
  Multiply: "正片叠底",
  Blend: "混合色"
  // etc...
};
const customTheme = {
  // image 坐上角度图片
  "common.bi.image": "", // 在这里换上你喜欢的logo图片
  "common.bisize.width": "0px",
  "common.bisize.height": "0px",
  "common.backgroundImage": "none",
  "common.backgroundColor": "#f3f4f6",
  "common.border": "1px solid #444",

  // header
  "header.backgroundImage": "none",
  "header.backgroundColor": "#f3f4f6",
  "header.border": "0px",

  // load button
  "loadButton.backgroundColor": "#fff",
  "loadButton.border": "1px solid #ddd",
  "loadButton.color": "#222",
  "loadButton.fontFamily": "NotoSans, sans-serif",
  "loadButton.fontSize": "12px",
  "loadButton.display": "none", // 可以直接隐藏掉

  // download button
  "downloadButton.backgroundColor": "#fdba3b",
  "downloadButton.border": "1px solid #fdba3b",
  "downloadButton.color": "#fff",
  "downloadButton.fontFamily": "NotoSans, sans-serif",
  "downloadButton.fontSize": "12px",
  "downloadButton.display": "none", // 可以直接隐藏掉

  // icons default
  "menu.normalIcon.color": "#8a8a8a",
  "menu.activeIcon.color": "#555555",
  "menu.disabledIcon.color": "#434343",
  "menu.hoverIcon.color": "#e9e9e9",
  "submenu.normalIcon.color": "#8a8a8a",
  "submenu.activeIcon.color": "#e9e9e9",

  "menu.iconSize.width": "24px",
  "menu.iconSize.height": "24px",
  "submenu.iconSize.width": "32px",
  "submenu.iconSize.height": "32px",

  // submenu primary color
  "submenu.backgroundColor": "#1e1e1e",
  "submenu.partition.color": "#858585",

  // submenu labels
  "submenu.normalLabel.color": "#858585",
  "submenu.normalLabel.fontWeight": "lighter",
  "submenu.activeLabel.color": "#fff",
  "submenu.activeLabel.fontWeight": "lighter",

  // checkbox style
  "checkbox.border": "1px solid #ccc",
  "checkbox.backgroundColor": "#fff",

  // rango style
  "range.pointer.color": "#fff",
  "range.bar.color": "#666",
  "range.subbar.color": "#d1d1d1",

  "range.disabledPointer.color": "#414141",
  "range.disabledBar.color": "#282828",
  "range.disabledSubbar.color": "#414141",

  "range.value.color": "#fff",
  "range.value.fontWeight": "lighter",
  "range.value.fontSize": "11px",
  "range.value.border": "1px solid #353535",
  "range.value.backgroundColor": "#151515",
  "range.title.color": "#fff",
  "range.title.fontWeight": "lighter",

  // colorpicker style
  "colorpicker.button.border": "1px solid #1e1e1e",
  "colorpicker.title.color": "#fff"
};
export default {
  data() {
    return {
      instance: null,
    }
  },
  mounted() {
    this.instance = new ImageEditor(
        document.querySelector("#tui-image-editor"),
        {
          includeUI: {
            loadImage: {
              path: "https://uploadbeta.com/api/pictures/random/",
              name: "image"
            },
            initMenu: "draw",
            menuBarPosition: "bottom",
            locale: locale_zh,
            theme: customTheme, // 自定义主题
          },
        }
      );
  }
}
</script>
```
#### 自定义样式效果
![自定义样式效果](https://img-blog.csdnimg.cn/20201122133238972.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70#pic_center)
我们将上面的默认图片,`Load`和`Download`按钮去掉了，但是会发现上面存在了一条白色的，这就浪费了我们编辑图片的空间，我们继续优化：
```javascript
// 通过在主题中改变样式隐藏掉我们不需要的header
const customTheme = {
  // image 坐上角度图片
  "common.bi.image": "", // 在这里换上你喜欢的logo图片
  "common.bisize.width": "0px",
  "common.bisize.height": "0px",
  "common.backgroundImage": "none",
  "common.backgroundColor": "#f3f4f6",
  "common.border": "1px solid #444",

  // header
  "header.backgroundImage": "none",
  "header.backgroundColor": "#f3f4f6",
  "header.border": "0px",
  "header.display": "none", // 隐藏我们的header

  // load button
  "loadButton.backgroundColor": "#fff",
  "loadButton.border": "1px solid #ddd",
  "loadButton.color": "#222",
  "loadButton.fontFamily": "NotoSans, sans-serif",
  "loadButton.fontSize": "12px",
  "loadButton.display": "none", // 可以直接隐藏掉

  // download button
  "downloadButton.backgroundColor": "#fdba3b",
  "downloadButton.border": "1px solid #fdba3b",
  "downloadButton.color": "#fff",
  "downloadButton.fontFamily": "NotoSans, sans-serif",
  "downloadButton.fontSize": "12px",
  "downloadButton.display": "none", // 可以直接隐藏掉

  // icons default
  "menu.normalIcon.color": "#8a8a8a",
  "menu.activeIcon.color": "#555555",
  "menu.disabledIcon.color": "#434343",
  "menu.hoverIcon.color": "#e9e9e9",
  "submenu.normalIcon.color": "#8a8a8a",
  "submenu.activeIcon.color": "#e9e9e9",

  "menu.iconSize.width": "24px",
  "menu.iconSize.height": "24px",
  "submenu.iconSize.width": "32px",
  "submenu.iconSize.height": "32px",

  // submenu primary color
  "submenu.backgroundColor": "#1e1e1e",
  "submenu.partition.color": "#858585",

  // submenu labels
  "submenu.normalLabel.color": "#858585",
  "submenu.normalLabel.fontWeight": "lighter",
  "submenu.activeLabel.color": "#fff",
  "submenu.activeLabel.fontWeight": "lighter",

  // checkbox style
  "checkbox.border": "1px solid #ccc",
  "checkbox.backgroundColor": "#fff",

  // rango style
  "range.pointer.color": "#fff",
  "range.bar.color": "#666",
  "range.subbar.color": "#d1d1d1",

  "range.disabledPointer.color": "#414141",
  "range.disabledBar.color": "#282828",
  "range.disabledSubbar.color": "#414141",

  "range.value.color": "#fff",
  "range.value.fontWeight": "lighter",
  "range.value.fontSize": "11px",
  "range.value.border": "1px solid #353535",
  "range.value.backgroundColor": "#151515",
  "range.title.color": "#fff",
  "range.title.fontWeight": "lighter",

  // colorpicker style
  "colorpicker.button.border": "1px solid #1e1e1e",
  "colorpicker.title.color": "#fff"
};
```

##### 但是发现还是没有隐藏掉,需要我们对样式进行修改
```javascript
// ...
document.getElementsByClassName("tui-image-editor-main")[0].style.top = 0;
```

#### 下一步我们要拿到编辑后的图片了：
这个插件提供了一个[`toDataURL`](https://nhn.github.io/tui.image-editor/latest/ImageEditor#toDataURL)的方法,可以将我们编辑后的图片转为`base64`,然后我们可以通过转为`form`表单上传到我们的服务器，或者转为图片，这里提供一份上传到后台的逻辑：
```javascript
// ...
methods: {
  uploadImg() {
    const base64String = this.instance.toDataURL();
    const data = window.atob(base64String.split(",")[1]);
    const ia = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i);
    }
    const blob = new Blob([ia], { type: "image/png" });
    const fd = new FormData();
    fd.append("image", blob);
    // upload fd
  }
}
```

### 最后，放上一段完整的代码：
```javascript
<template>
  <div class="container">
    <div id="tui-image-editor"></div>
    <button @click="uploadImg">完成并上传</button>
  </div>
</template>
<script>
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
const ImageEditor = require("tui-image-editor");
const locale_zh = {
  // override default English locale to your custom
  Crop: "裁剪",
  DeleteAll: "全部删除",
  Delete: "删除",
  Undo: "撤销",
  Redo: "反撤销",
  Reset: "重置",
  Flip: "镜像",
  Rotate: "旋转",
  Draw: "画",
  Shape: "形状标注",
  Icon: "图标标注",
  Text: "文字标注",
  Mask: "遮罩",
  Filter: "滤镜",
  Bold: "加粗",
  Italic: "斜体",
  Underline: "下划线",
  Left: "左对齐",
  Center: "居中",
  Right: "右对齐",
  Color: "颜色",
  "Text size": "字体大小",
  Custom: "自定义",
  Square: "正方形",
  Apply: "应用",
  Cancel: "取消",
  "Flip X": "X 轴",
  "Flip Y": "Y 轴",
  Range: "区间",
  Stroke: "描边",
  Fill: "填充",
  Circle: "圆",
  Triangle: "三角",
  Rectangle: "矩形",
  Free: "曲线",
  Straight: "直线",
  Arrow: "箭头",
  "Arrow-2": "箭头2",
  "Arrow-3": "箭头3",
  "Star-1": "星星1",
  "Star-2": "星星2",
  Polygon: "多边形",
  Location: "定位",
  Heart: "心形",
  Bubble: "气泡",
  "Custom icon": "自定义图标",
  "Load Mask Image": "加载蒙层图片",
  Grayscale: "灰度",
  Blur: "模糊",
  Sharpen: "锐化",
  Emboss: "浮雕",
  "Remove White": "除去白色",
  Distance: "距离",
  Brightness: "亮度",
  Noise: "噪音",
  "Color Filter": "彩色滤镜",
  Sepia: "棕色",
  Sepia2: "棕色2",
  Invert: "负片",
  Pixelate: "像素化",
  Threshold: "阈值",
  Tint: "色调",
  Multiply: "正片叠底",
  Blend: "混合色",
  // etc...
};
const customTheme = {
  // image 坐上角度图片
  "common.bi.image": "https://uploadbeta.com/api/pictures/random/", // 在这里换上你喜欢的logo图片
  "common.bisize.width": "0px",
  "common.bisize.height": "0px",
  "common.backgroundImage": "none",
  "common.backgroundColor": "#f3f4f6",
  "common.border": "1px solid #444",

  // header
  "header.backgroundImage": "none",
  "header.backgroundColor": "#f3f4f6",
  "header.border": "0px",
  "header.display": "none",

  // load button
  "loadButton.backgroundColor": "#fff",
  "loadButton.border": "1px solid #ddd",
  "loadButton.color": "#222",
  "loadButton.fontFamily": "NotoSans, sans-serif",
  "loadButton.fontSize": "12px",
  "loadButton.display": "none", // 可以直接隐藏掉

  // download button
  "downloadButton.backgroundColor": "#fdba3b",
  "downloadButton.border": "1px solid #fdba3b",
  "downloadButton.color": "#fff",
  "downloadButton.fontFamily": "NotoSans, sans-serif",
  "downloadButton.fontSize": "12px",
  "downloadButton.display": "none", // 可以直接隐藏掉

  // icons default
  "menu.normalIcon.color": "#8a8a8a",
  "menu.activeIcon.color": "#555555",
  "menu.disabledIcon.color": "#434343",
  "menu.hoverIcon.color": "#e9e9e9",
  "submenu.normalIcon.color": "#8a8a8a",
  "submenu.activeIcon.color": "#e9e9e9",

  "menu.iconSize.width": "24px",
  "menu.iconSize.height": "24px",
  "submenu.iconSize.width": "32px",
  "submenu.iconSize.height": "32px",

  // submenu primary color
  "submenu.backgroundColor": "#1e1e1e",
  "submenu.partition.color": "#858585",

  // submenu labels
  "submenu.normalLabel.color": "#858585",
  "submenu.normalLabel.fontWeight": "lighter",
  "submenu.activeLabel.color": "#fff",
  "submenu.activeLabel.fontWeight": "lighter",

  // checkbox style
  "checkbox.border": "1px solid #ccc",
  "checkbox.backgroundColor": "#fff",

  // rango style
  "range.pointer.color": "#fff",
  "range.bar.color": "#666",
  "range.subbar.color": "#d1d1d1",

  "range.disabledPointer.color": "#414141",
  "range.disabledBar.color": "#282828",
  "range.disabledSubbar.color": "#414141",

  "range.value.color": "#fff",
  "range.value.fontWeight": "lighter",
  "range.value.fontSize": "11px",
  "range.value.border": "1px solid #353535",
  "range.value.backgroundColor": "#151515",
  "range.title.color": "#fff",
  "range.title.fontWeight": "lighter",

  // colorpicker style
  "colorpicker.button.border": "1px solid #1e1e1e",
  "colorpicker.title.color": "#fff",
};
export default {
  data() {
    return {
      instance: null,
    };
  },
  mounted() {
    this.instance = new ImageEditor(
      document.querySelector("#tui-image-editor"),
      {
        includeUI: {
          loadImage: {
            path: "https://uploadbeta.com/api/pictures/random/",
            name: "image",
          },
          initMenu: "draw",
          menuBarPosition: "bottom",
          locale: locale_zh,
          theme: customTheme,
        },
      }
    );
    document.getElementsByClassName("tui-image-editor-main")[0].style.top = 0;
  },
  methods: {
    uploadImg() {
      const base64String = this.instance.toDataURL();
      const data = window.atob(base64String.split(",")[1]);
      const ia = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
      }
      const blob = new Blob([ia], { type: "image/png" });
      const fd = new FormData();
      fd.append("image", blob);
      // upload fd
    },
  },
};
</script>

<style lang="css" scoped>
.container {
  height: 95vh;
  text-align: center;
}
</style>
```

### 最终效果，战歌起！
![最终效果](https://img-blog.csdnimg.cn/20201122222050117.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lfYW1fYV9zYg==,size_16,color_FFFFFF,t_70#pic_center)

## 最后
如果有什么疑问或者使用中的其他问题可以在评论中讨论一下。
