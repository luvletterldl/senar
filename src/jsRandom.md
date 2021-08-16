## JS - 生成随机数的方法汇总

### 随机浮点数的生成
- 生成 [ 0, 1 ) 范围内的随机数（大于等于0，小于1）
> Math.random()
- 生成 [ n, m ) 范围内的随机数（大于等于n，小于m）
> Math.random()*(m-n)+n
- 生成 [n,m]、(n,m)、(n,m] 范围内的随机数
  ```javascript
  //取得[n,m]范围随机数
  function fullClose(n,m) {
    var result = Math.random()*(m+1-n)+n;
    while(result>m) {
        result = Math.random()*(m+1-n)+n;
    }
    return result;
  }
  
  //取得(n,m)范围随机数
  function fullOpen(n,m) {
    var result = Math.random()*(m-n)+n;
    while(result == n) {
        result = Math.random()*(m-n)+n;
    }
    return result;
  }
  
  //取得(n,m]范围随机数
  function leftOpen(n,m) {
    var result = Math.random()*(m-n+1)+n-1;
    while(result<n) {
        result = Math.random()*(m-n+1)+n-1;
    }
    return result;
  }
  ```

## 随机整数的生成
要生成随机整数，我们还需要借助如下两个方法：
- Math.round(num)：将 num 四舍五入取整
- Math.floor(num)：将 num 向下取整，即返回 num 的整数部分。当然我们也可以使用 parseInt() 方法代替。

### 随机生成 0、1 这两个整数
> Math.round(Math.random())
### 生成 [ 0, n ) 范围内的随机整数（大于等于0，小于n）
> Math.floor(Math.random()*n)
### 生成 [ 1, n ] 范围内的随机整数（大于等于1，小于等于n）
> Math.floor(Math.random()*n)+1
### 生成 [ min, max ] 范围内的随机整数（大于等于min，小于等于max）
> Math.floor(Math.random()*(max-min+1))+min
## 随机字符串的生成
### 生成指定位数的纯数字字符串
```javascript
// 生成n位数字字符串
function randomNum(n){
  var res = "";
  for(var i=0;i<n;i++){
    res += Math.floor(Math.random()*10);
  }
  return res;
}
```
### 生成指定位数的数字字母混合的字符串
```javascript
//生成n位数字字母混合字符串
function generateMixed(n) {
  var chars = ['0','1','2','3','4','5','6','7','8','9',
              'A','B','C','D','E','F','G','H','I','J','K','L','M',
              'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var res = "";
  for(var i = 0; i < n ; i++) {
     var id = Math.floor(Math.random()*36);
     res += chars[id];
  }
  return res;
}
```