# working-log / 个人主页 V1

> 本文件记录每轮交互的提示词、思考过程与操作过程，统一存放在 `working-log/` 文件夹。

## 本轮记录 · 2026-09-05

### 1. 用户提示词（原文摘要）
生成个人主页 V1：原生 HTML + CSS + JavaScript 静态网页，可直接本地打开预览，不引入构建工具或第三方库。

- 作者：钱家萱，TJU-POLYU 脑机接口专业大一学生
- 页面目标：展示个人 CS 能力、记录项目，作为长期个人项目图书馆
- 访客：未来雇主与开发者同行
- 记忆点：不被专业定义、兴趣驱动、技术力不断提升
- 要求：桌面优先、移动端不溢出、暗色背景 + 单一强调色（荧光绿）、语义化标签、独立 CSS/JS（或单文件）、可读性强
- 结构（9 模块，保留 id）：Header / Hero / About / Projects / 兴趣技能 / 时间线 / 数字分身 / Contact / Footer

### 2. 我的思考过程
- **Lazy 原则的落点**：这是从零搭的独立静态页，没有可复用的现有代码（工作区当前只是 opencode 配置骨架），所以"最小可用的代码"就是一次性写全 9 个模块，但保持结构扁平、无过度抽象。
- **要不要拆分文件**：用户明确"最好能用独立 CSS/JS"，且要求相对路径正确、双击 index.html 就能显示。因此采用三段式 `index.html + style.css + main.js + assets/placeholder.png`，比单文件更清晰，也符合交付预期。
- **占位图**：用户允许"使用占位图或 assets/placeholder.png"。为避免引入任何外链图床（违背无第三方依赖），用 .NET 内置 System.Drawing 现画一张带边框和文字的 PNG，零依赖、本地可显示。
- **平滑滚动**：CSS `scroll-behavior: smooth` 即可满足"平滑滚动"，JS 仅做兜底 + 固定 header 的偏移补偿，避免简单需求被过度实现。
- **页脚年份**：用 JS `new Date().getFullYear()`，符合"用 JS 自动获取当前年份"。
- **响应式**：只做最基础的 `@media (max-width: 720px)`，让 featured 卡片横向改纵向、容器宽度自适应，符合"简单 media query，不要求复杂布局调整"。

### 3. 操作过程
1. `Get-ChildItem` 检查工作区结构 → 确认当前目录即项目本身，无既有可复用代码。
2. 创建 `assets/` 目录。
3. 用 PowerShell + System.Drawing 生成 `assets/placeholder.png`（第一次 DrawString 重载参数报错，改为 RectangleF 重载后成功，14KB）。
4. 编写 `index.html`（9 个语义化模块，保留 id：top/home/about/projects/timeline/twin/contact/year）。
5. 编写 `style.css`（深色 `#1a1a1a`、强调色 `#00ff9c`、文字 `#e0e0e0`、响应式 media query）。
6. 编写 `main.js`（年份自动获取 + 锚点平滑滚动兜底与 header 偏移补偿）。
7. 校验：index.html 内所有 `href="#..."` 锚点均能在当前页找到对应 id，外部资源 `style.css`、`main.js`、`assets/placeholder.png` 相对路径均存在，无 MISSING。

### 4. 产出文件
| 文件 | 说明 |
| --- | --- |
| `index.html` | 语义化结构，9 个模块 |
| `style.css` | 暗色主题 + 荧光绿 + 响应式 |
| `main.js` | 年份获取 + 平滑滚动 |
| `assets/placeholder.png` | 小程序截图占位图 |

### 5. 本地预览方式
- 直接双击 `index.html` 用浏览器打开；或
- 用 VS Code 安装 Live Server 扩展，右键 `index.html` → Open with Live Server 到 `http://127.0.0.1:5500`。
