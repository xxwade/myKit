1.生成文件在  src/img下
2.存放uid文件默认叫 uid.txt， 文本格式为  22,44,555,33 或者 uid之间换行符、空格
3. 执行过程中出错uid会将文件加到 userLeft.时间戳.txt中，将具体错误信息存放到error.时间戳.txt
4.可运行 node parent.js uat userLeft.时间戳.txt   再次执行出错的情况
5.3万左右用户生成图片预计6~8g，时间2~3小时， @sa需将文件拷贝到hd对应机器上