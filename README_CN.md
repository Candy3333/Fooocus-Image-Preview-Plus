# Fooocus-Image-Preview-Plus
[**English**](./README.md) | [**中文**](./README_CN.md)


这是一个Tampermonkey脚本，旨在增强网页上的图像查看体验。它提供了额外的功能和改进，使图像预览更加流畅直观。

![gif](https://github.com/Candy3333/Fooocus-Image-Preview-Plus/blob/main/assets/Preview.gif)

## 功能

- 按空格键进入图像的全屏放大模式。
- 在任何图像上点击中键鼠标将切换到放大模式。再次点击中键退出放大模式。
- 放大模式下，使用左右箭头键浏览图像。
- 在此模式下，滚动鼠标滚轮以放大和缩小图像。
- 同样在放大模式下，按住左键鼠标并拖动可移动图像并查看特定细节。
- 双击左键鼠标重置图像缩放和位置。
- 最后，在放大模式下按ESC键退出。

## 安装

1. 使用Google Chrome。它允许Tampermonkey访问日志和图像文件 - 我无法在Firefox中使它工作，并且没有尝试其他浏览器。如果其他人愿意在其他浏览器上测试并报告，我们鼓励您这样做！
2. 安装[Tampermonkey浏览器扩展](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en-GB)
3. 在chrome扩展设置中启用`"允许访问文件URL"`设置。
4. 点击Tampermonkey扩展 -> 仪表板 -> 工具
5. 将以下内容复制并粘贴到导入URL输入框中，然后按安装。

```
https://raw.githubusercontent.com/Candy3333/Fooocus-Image-Preview-Plus/main/Fooocus_image_preview_plus.js
```
