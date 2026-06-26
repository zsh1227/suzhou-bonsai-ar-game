# 苏派盆景 AR 拼装小游戏

这是一个适合儿童科普课堂使用的轻量 WebAR 小游戏。用户通过手机浏览器打开 GitHub Pages 链接后，可以在摄像头画面中选择容器、枝干和叶片，拼装自己的苏派盆景。

本项目是纯静态网页项目，可直接部署到 GitHub Pages。

访问链接格式一般为：

[https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/](https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/)

## 核心体验

- 摄像头视频作为底层背景。
- 盆景素材作为 2D 图层叠加在摄像头画面上。
- 单指拖动整个盆景对象。
- 双指缩放整个盆景对象。
- 桌面调试时支持鼠标拖动和滚轮缩放。
- 容器始终压在枝干或组合图上方，遮住枝干底部。

## 三步拼装逻辑

### 第一步：选择容器

- 场景中只显示容器。
- 不显示枝干。
- 不显示叶片。
- 底部只显示 3 个容器选项。

### 第二步：选择枝干

- 保留已选容器。
- 显示无叶枝干。
- 图层顺序为：枝干在下，容器在上。
- 底部只显示 3 个枝干选项。

### 第三步：选择叶片

- 保留已选容器和枝干。
- 不单独叠加叶片。
- 根据当前枝干和叶片直接调用 `assets/reference/` 中已经对好位置的 combo 图。
- 图层顺序为：combo 图在下，容器在上。

## 项目结构

```text
suzhou-bonsai-ar-game/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── container/
    ├── branch/
    ├── leaf/
    └── reference/
```

`index.html`、`style.css`、`script.js`、`README.md` 必须位于仓库根目录。

`assets` 文件夹必须和 `index.html` 在同一级目录。

## 素材命名要求

所有素材都必须使用相对路径，不要使用 `/assets/...`、`C:/...`、`D:/...` 或 `file:///...`。

### 容器素材

```text
assets/container/container_01.png
assets/container/container_02.png
assets/container/container_03.png
```

### 枝干素材（无叶版本）

```text
assets/branch/branch_01.png
assets/branch/branch_02.png
assets/branch/branch_03.png
```

### 叶片素材（底部选择缩略图）

```text
assets/leaf/leaf_01.png
assets/leaf/leaf_02.png
assets/leaf/leaf_03.png
```

### 枝干 + 叶片组合图

```text
assets/reference/combo_branch01_leaf01.png
assets/reference/combo_branch01_leaf02.png
assets/reference/combo_branch01_leaf03.png
assets/reference/combo_branch02_leaf01.png
assets/reference/combo_branch02_leaf02.png
assets/reference/combo_branch02_leaf03.png
assets/reference/combo_branch03_leaf01.png
assets/reference/combo_branch03_leaf02.png
assets/reference/combo_branch03_leaf03.png
```

组合规则：

```text
branch_01 + leaf_01 -> assets/reference/combo_branch01_leaf01.png
branch_01 + leaf_02 -> assets/reference/combo_branch01_leaf02.png
branch_01 + leaf_03 -> assets/reference/combo_branch01_leaf03.png
branch_02 + leaf_01 -> assets/reference/combo_branch02_leaf01.png
branch_02 + leaf_02 -> assets/reference/combo_branch02_leaf02.png
branch_02 + leaf_03 -> assets/reference/combo_branch02_leaf03.png
branch_03 + leaf_01 -> assets/reference/combo_branch03_leaf01.png
branch_03 + leaf_02 -> assets/reference/combo_branch03_leaf02.png
branch_03 + leaf_03 -> assets/reference/combo_branch03_leaf03.png
```

## 本地测试

不要直接双击 `index.html` 使用 `file://` 打开。

推荐方式：

```bash
python -m http.server 8000
```

然后访问：

[http://localhost:8000](http://localhost:8000/)

摄像头可以在 `localhost` 或 GitHub Pages 的 HTTPS 链接下测试。

## GitHub Pages 部署

1. 新建 GitHub 仓库，仓库名建议为：

   ```text
   suzhou-bonsai-ar-game
   ```

2. 上传整个项目内容，包括：

   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `assets` 文件夹

3. 打开仓库 `Settings`。

4. 找到 `Pages`。

5. `Source` 选择：

   ```text
   Deploy from a branch
   ```

6. `Branch` 选择：

   ```text
   main
   ```

7. `Folder` 选择：

   ```text
   / root
   ```

8. 保存并等待部署完成。

9. 使用手机 Chrome 或 Safari 打开：

   [https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/](https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/)

## 摄像头权限提示

项目使用：

```js
navigator.mediaDevices.getUserMedia
```

如果用户拒绝摄像头权限，页面会显示：

```text
请允许摄像头权限，才能体验 AR 盆景拼装。
```

如果浏览器不支持摄像头，页面会显示：

```text
当前浏览器暂不支持摄像头功能，请使用手机 Chrome 或 Safari 打开。
```
