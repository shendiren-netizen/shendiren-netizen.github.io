# diren shen · 个人主页

中英文个人主页，首次打开默认英文。参考 marjoballabani.me 的黄色导航、粗黑描边与实心阴影风格，并加入整页粒子背景；页面、图标和 DS 电脑角色插画为本项目原创实现。使用本地 GSAP 动画库、Rough Notation 手绘标注、Lucide 图标和 Fontsource 字体，不依赖 CDN、在线字体或图片服务。

## 直接打开

双击 `index.html` 即可浏览完整页面，包括动画。不需要安装依赖。

## 本地预览

需要 Node.js 18 或以上版本。在项目文件夹中运行：

```sh
npm run dev
```

打开 http://127.0.0.1:5173。按 Ctrl+C 关闭服务。

## 构建

```sh
npm ci
npm run build
```

输出位于 `dist/`，可直接部署到静态托管服务。运行 `npm run preview` 可预览构建结果。

## GitHub Pages

1. 将本文件夹内容提交到自己的 GitHub 仓库的 `main` 分支（包含 `.github` 文件夹）。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 打开 **Actions → Deploy to GitHub Pages → Run workflow**，或推送一次提交，等待发布成功。
4. 发布地址会显示在 Pages 设置页和工作流的 deployment 输出中。

此项目的线上地址为 https://shendiren-netizen.github.io/ 。请统一选择 **GitHub Actions** 作为发布来源，避免分支发布和自定义工作流同时部署。工作流会自动执行 `npm ci` 和 `npm run build`；推送源码后不需要再手动上传 `dist/`。

本地验证可以执行 `npm ci`、`npm run build`、`npm run preview`。`npm ci` 用于按锁文件安装依赖，已有匹配依赖时不必每次重复执行。构建会给 HTML 中的样式、脚本等本地资源添加内容哈希版本号，并同步到 `dist/`，防止更新后混用浏览器缓存中的旧 CSS 或 JS。修改源码后应重新构建再提交。

所有资源均使用相对路径，同时支持 `用户名.github.io` 和 `用户名.github.io/仓库名/`。如果默认分支不是 main，请同步修改 `.github/workflows/deploy.yml` 的分支名。

## 结构与维护

- `index.html`：页面内容、语义结构与 SVG 插画。
- `style.css`：视觉、交互反馈和手机适配。
- `script.js`：GSAP 动画和导航状态；支持系统“减少动态效果”设置。
- `assets/vendor/`：GSAP、Rough Notation 的本地发行文件和许可证，以及 Lucide 许可证。
- `assets/fonts/`：Space Grotesk 和 Caveat 的本地 WOFF2 字体与许可证，中文使用系统字体。
- `assets/icons/`：精选 Lucide 图标；页面内联 SVG，双击打开时也可使用。
- `scripts/vendor.mjs`：同步本地资源和精选 SVG；构建时自动运行，版本由 package-lock.json 锁定。
- `.github/workflows/deploy.yml`：自动构建与 GitHub Pages 发布。

页面只呈现用户提供的信息；未添加未提供的作品、履历、联系方式或社交链接。无数据收集、后端或表单。


## 本次视觉优化

- [Lucide](https://github.com/lucide-icons/lucide)：统一图标的比例、线宽与风格，仅使用精选图标。
- [Rough Notation](https://github.com/rough-stuff/rough-notation)：姓名和关键文字的手绘下划线、AI 圈注。
- [Fontsource](https://github.com/fontsource/fontsource)：自托管 Space Grotesk（姓名、标识）和 Caveat（签名），保留字体许可证。
- 沿用 GSAP：插画眨眼、贴纸浮动、桌面鼠标视差、分段入场；支持系统减少动态效果。
- 细化纸张与胶带、卡片、网格、色彩、间距和按钮反馈；加入滚动进度及快捷入口提示。
- 保留页面内容与 GitHub Pages 发布方式。无需安装依赖即可直接打开；只有重新构建或更新库时需要 npm ci。

## 粒子互动版

新增 [tsParticles Slim](https://github.com/tsparticles/tsparticles) 与 [canvas-confetti](https://github.com/catdad/canvas-confetti)，全部使用本地发行文件并保留许可证。

- 整页粒子背景：桌面鼠标靠近时连线响应；手机减少粒子数量并关闭连线。
- 点击「点燃灵感」触发一次彩纸爆发，按钮支持键盘 Enter / Space。
- GSAP ScrambleTextPlugin：姓名入场解码和鼠标悬停解码。
- GSAP ScrollTrigger：插画轨道和手绘箭头随滚动变化。
- 桌面保留原生鼠标，增加轻量跟随光环与磁吸按钮。
- 页面切入后台或关闭动效时暂停整页粒子与光丝；彩纸按钮设有触发间隔。
- 动效开关可暂停动画，并在当前浏览器保存选择；系统减少动态效果优先。
- `effects.js` 单独管理粒子、彩纸和增强动效，无需后端。

构建时运行 `npm ci && npm run build`，`dist/` 仍可直接部署到 GitHub Pages。直接双击根目录 `index.html` 也可浏览，所有效果脚本均使用经典 script 标签和相对路径，不依赖在线 CDN。


## 中英文切换

导航栏的 **EN / 中** 按钮可即时切换整页语言，首次访问默认英文，并在浏览器中记住上次选择。导航、正文、图标提示、无障碍标签、页面标题、描述和动态提示均会同步翻译。

翻译集中保存在 `i18n.js`，无需后端或额外依赖。静态 HTML 本身为英文，即使脚本无法运行也能正常阅读。资源均为相对路径，继续支持直接打开和 GitHub Pages。


## 深色星空与持续流星

整页改为深海军蓝星空，正文使用浅色，保留黄色导航、黄色按钮与卡通插画作为亮点。背景是独立的固定画布，滚动到关于、兴趣和页脚时仍会显示。

- 多层星点缓慢漂移、低频闪烁，桌面鼠标有轻微视差。
- 流星由 Canvas 实时绘制：桌面六组、手机三组不断循环，从右上向左下穿行，包含渐隐长尾与明亮星核。
- 使用 tsParticles 补充漂移星尘与鼠标交互，simplex-noise 调节星光变化。
- 深蓝与紫蓝星云配合白蓝、淡金流星，内容区域控制背景亮度以保持可读性。
- 动效开关和后台暂停同时控制流星与星尘；减少动态效果模式保留静态星空。
- 中英文切换、默认英文、375px 适配和 GitHub Pages 构建方式保持可用。


## 根据当地时间切换昼夜

`theme.js` 在样式加载前读取访问者设备的当地时间：07:00（含）至 19:00（不含）为浅色日间，其余为深色星空。每分钟检查一次，切回页面或窗口获得焦点时也会立即检查，不需要定位权限或后端。设备时钟决定显示时间。

日间使用蓝、紫、青色流星与深色星尘，配合深色正文和白色背景；夜间使用发光浅色流星、浅色正文与海军蓝背景。跨时段会同步刷新 Canvas 与 tsParticles 配色；动效开关、减少动态效果和语言切换保持独立。


## 简历内容更新（2026-10-26）

依据用户提供的简历更新：姓名 DiRen Shen，悉尼大学计算机科学硕士（2026 年 7 月毕业），AI / LLM 应用工程实习方向。新增教育背景、四类技术栈、企业知识库 RAG 系统、医疗 AI 聊天机器人、2D 装修设计与费用估算项目，以及简历中的邮箱、电话、到岗时间、现场工作天数与语言能力。中英文内容同步。项目未提供仓库或演示链接，因此不显示相关按钮。保留既有健身与攀岩兴趣、昼夜配色与动效。
