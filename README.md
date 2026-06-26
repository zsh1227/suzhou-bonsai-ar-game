# 苏派盆景 AR 拼装小游戏

这是一个适合儿童科普课堂使用的轻量 WebAR 小游戏。用户可以在摄像头画面中选择容器、枝干和叶片，组合自己的苏派盆景。

这个小游戏最终通过 GitHub Pages 网址访问，不建议直接双击 `index.html` 使用 `file://` 打开。

访问链接格式一般为：

[https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/](https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/)

## 项目特点

- 纯前端静态项目。
- 不需要后端。
- 不需要数据库。
- 不需要服务器配置。
- 不使用外部 CDN。
- 不使用网络图片。
- 所有素材路径都使用相对路径，适合 GitHub Pages 子路径部署。
- 摄像头使用 `navigator.mediaDevices.getUserMedia` 调用。

## 项目结构

项目根目录必须包含：

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

`index.html`、`style.css`、`script.js`、`README.md` 必须放在仓库根目录。

`assets` 文件夹必须和 `index.html` 在同一级目录。

## 素材文件夹说明

### `assets/container/`

用于放置 3 张容器图片。

### `assets/branch/`

用于放置 3 张枝干缩略图。

### `assets/leaf/`

用于放置 3 张叶片缩略图。

### `assets/reference/`

用于放置已经组合好的“枝干 + 叶片”参考图，作为 AR 主画面中的上层图像。

这些参考图不是最终替代素材，而是用于帮助调整叶片相对枝干的位置。

## 图片命名要求

所有图片必须按照以下名称放置，路径和文件名需要完全一致。

### 容器图片

```text
assets/container/container_01.png
assets/container/container_02.png
assets/container/container_03.png
```

### 枝干图片

```text
assets/branch/branch_01.png
assets/branch/branch_02.png
assets/branch/branch_03.png
```

### 叶片图片

```text
assets/leaf/leaf_01.png
assets/leaf/leaf_02.png
assets/leaf/leaf_03.png
```

### 枝干 + 叶片组合参考图

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

## 手机体验步骤

1. 打开 GitHub Pages 链接：

   [https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/](https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/)

2. 使用手机 Chrome 或 Safari 打开。

3. 点击“开始体验”。

4. 允许摄像头权限。

5. 在摄像头画面中选择容器、枝干和叶片，完成自己的苏派盆景。

如果用户拒绝摄像头权限，页面会显示：

```text
请允许摄像头权限，才能体验 AR 盆景拼装。
```

如果浏览器不支持摄像头，页面会显示：

```text
当前浏览器暂不支持摄像头功能，请使用手机 Chrome 或 Safari 打开。
```

## 本地测试方法

### 方式一

使用 VS Code 的 Live Server 插件打开。

### 方式二

在项目目录运行：

```bash
python -m http.server 8000
```

然后访问：

[http://localhost:8000](http://localhost:8000/)

说明：摄像头在 `localhost` 下可以测试，但不要直接双击 `index.html` 用 `file://` 打开。

## GitHub Pages 部署说明

### 1. 新建 GitHub 仓库

仓库名建议：

```text
suzhou-bonsai-ar-game
```

### 2. 上传项目文件

上传整个项目文件夹中的内容，包括：

- `index.html`
- `style.css`
- `script.js`
- `README.md`
- `assets` 文件夹

### 3. 打开 GitHub 仓库的 Settings

进入仓库页面后，点击 `Settings`。

### 4. 找到 Pages

在左侧菜单中找到 `Pages`。

### 5. Source 选择

选择：

```text
Deploy from a branch
```

### 6. Branch 选择

选择：

```text
main
```

### 7. Folder 选择

选择：

```text
/ root
```

### 8. 保存

点击保存，等待 GitHub Pages 部署完成。

### 9. 获得网址

部署完成后，访问链接一般为：

[https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/](https://你的GitHub用户名.github.io/suzhou-bonsai-ar-game/)

## 常见问题

### 摄像头打不开

- 确认使用的是 GitHub Pages 的 HTTPS 链接。
- 确认使用手机 Chrome 或 Safari。
- 检查浏览器是否允许该网页使用摄像头。
- 本地测试时请使用 `localhost`，不要使用 `file://`。

### 素材不显示

- 检查图片是否放在正确文件夹。
- 检查文件名是否完全一致。
- 检查路径是否为相对路径，例如 `assets/container/container_01.png`。
- 不要使用 `/assets/...`、`C:/...`、`D:/...` 或 `file:///...`。

### GitHub Pages 部署后图片丢失

请确认项目中没有使用绝对路径。正确写法：

```text
assets/container/container_01.png
assets/reference/combo_branch01_leaf01.png
```

错误写法：

```text
/assets/container/container_01.png
C:/xxx/assets/container/container_01.png
D:/xxx/assets/container/container_01.png
file:///xxx/assets/container/container_01.png
```
