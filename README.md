# diren shen · 个人主页

中文个人主页。参考 marjoballabani.me 的黄色导航、浅色网格、粗黑描边与实心阴影风格；页面、图标和 DS 电脑角色插画为本项目原创实现。使用本地 GSAP 动画库、Rough Notation 手绘标注、Lucide 图标和 Fontsource 字体，不依赖 CDN、在线字体或图片服务。

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

- 首屏粒子：桌面鼠标靠近时连线响应；手机减少粒子数量并关闭连线。
- 点击「点燃灵感」触发一次彩纸爆发，按钮支持键盘 Enter / Space。
- GSAP ScrambleTextPlugin：姓名入场解码和鼠标悬停解码。
- GSAP ScrollTrigger：插画轨道和手绘箭头随滚动变化。
- 桌面保留原生鼠标，增加轻量跟随光环与磁吸按钮。
- 首屏离开视口、页面切入后台时暂停粒子；彩纸按钮设有触发间隔。
- 动效开关可暂停动画，并在当前浏览器保存选择；系统减少动态效果优先。
- `effects.js` 单独管理粒子、彩纸和增强动效，无需后端。

构建时运行 `npm ci && npm run build`，`dist/` 仍可直接部署到 GitHub Pages。直接双击根目录 `index.html` 也可浏览，所有效果脚本均使用经典 script 标签和相对路径，不依赖在线 CDN。
