# 原由
起初是在`WSL`中开发一个静态博客项目，想要偷个懒，想直接通过`fs.stat()`获取文件的创建时间来生成文章的时间线排序，包括更新时间

# 不对劲
当我更改了一个`md`文件的内容时，我发现时间线发生变化了，我是通过`(await fs.stat(filePath)).birthtimeMs`获取文件创建时间的，但是我发现这个值竟然在我改动过文件后变化了，变成了我改变文件的时间戳，白丝不の七姐（bushi）

# 找原因
各种让我一通找之后，发现是`WSL`下的文件系统的问题，具体可以查看`github`上别人19年的时候提的一个`issue`:[stat.birthtime is incorrect under WSL · Issue #30860 · nodejs/node (github.com)](https://github.com/nodejs/node/issues/30860),原因就是没有实现这个东西，然后就默认返回你`mtime`了
通过`stat`命令一查看，我惊呆了，文件的`Birth`竟然是`-`，你没看错就是一个杠
```bash
  Size: 2477            Blocks: 8          IO Block: 4096   regular file
Device: 810h/2064d      Inode: 148374      Links: 1
Access: (0644/-rw-r--r--)  Uid: ( 1000/     ldl)   Gid: ( 1000/     ldl)
Access: 2021-11-08 16:35:59.405414600 +0800
Modify: 2021-10-28 09:36:18.918000000 +0800
Change: 2021-10-28 09:36:18.913397200 +0800
 Birth: -
```
本人测试在win上的是正常的。

# 总结
还是老老实实在`win`上开发吧，gym！