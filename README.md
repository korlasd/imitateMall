# imitateMall

京东首页及子页面的静态仿站作品，**重构版**。

技术栈刻意保持最简：HTML + 原生 CSS（Grid / Flex / 自定义属性）+ 原生 JavaScript。
无框架、无构建工具、无第三方运行时依赖 —— 双击 `index.html` 即可运行。

## 页面

| 页面 | 文件 | 说明 |
| --- | --- | --- |
| 首页 | `index.html` | 分类侧栏、轮播、秒杀、推荐、楼层、品牌墙 |
| 秒杀 | `jd_miaosha.html` | 场次时间轴、实时倒计时、库存进度、价格筛选 |
| 领券 | `coupon.html` | 品类筛选、票券造型、领取状态持久化 |
| 登录 | `login.html` | 扫码 / 账户双模式、表单校验、密码可见性 |

## 运行

```bash
# 方式一：直接打开
# 双击 index.html（file:// 协议下同样可用，未使用 ES Module 与 fetch）

# 方式二：本地服务器（推荐，便于调试）
python -m http.server 8080
# 访问 http://127.0.0.1:8080/index.html
```

## 目录结构

```
imitateMall/
├── index.html              首页
├── jd_miaosha.html         秒杀页
├── coupon.html             领券页
├── login.html              登录页
├── assets/
│   ├── css/
│   │   ├── tokens.css      设计令牌：颜色、间距、圆角、阴影、动效
│   │   ├── layout.css      容器、页头、主导航、页脚、主视觉栅格
│   │   ├── components.css  按钮、卡片、商品卡、轮播、倒计时、表单等
│   │   └── views/          各页面专属样式（home / seckill / coupon / login）
│   └── js/
│       ├── core.js         命名空间、DOM 工具、页头页脚组件、轮播、倒计时、购物车
│       ├── data.js         数据源：分类、商品、优惠券、公告（改内容只需改这里）
│       ├── markup.js       渲染辅助：价格、标签、商品卡 HTML 片段
│       └── views/          各页面视图逻辑
└── img/ fourImg/ secondImg/ threeImg/   图片资源（沿用原项目素材）
```

## 重构做了什么

原项目是 4879 行的单文件首页、354 处内联 `style`、类名形如 `div4_context_left_menuleft_top`，
并依赖 Bootstrap 3.3.2 与 jQuery。本次重构按以下方向处理：

### 1. 修复实际缺陷

- `index.html` 原先引用 `http://cdn.bootcss.com/bootstrap/3.3.2/css/bootstrap.min.css`。
  该 CDN 早已停止服务且为 HTTP 协议，线上会丢失全部 Bootstrap 样式；而本地 `css/bootstrap.min.css` 却未被使用。
  重构后彻底移除 Bootstrap，改由自建样式体系承担布局。
- 移除页尾两个第三方外链脚本（`luyuz.cn` 的樱花与爆炸特效），去掉不可控的外部依赖。
- 修正倒计时天计算错误：原实现写作 `Math.floor(second / 24 * 60 * 60)`，
  正确应为 `Math.floor(second / 86400)`（原 `day` 变量未被使用，属死代码，但算法本身错误）。
- 原倒计时使用 `setInterval("getDate('...')", 500)` 字符串形式定时器，
  现改为函数引用 + 1 秒对齐，并在页面隐藏时暂停。
- 四个页面原本 `<title>` 全为空，且缺少 `lang`、`viewport`、`description`，已全部补齐。

### 2. 结构与维护性

- 16 个分类及其飞出面板、数十张商品卡由 `data.js` 数据驱动渲染，
  不再在 HTML 中重复硬编码；新增分类或商品只改数据文件。
- 公共页头（促销条、工具栏、搜索区、主导航）与页脚抽为 `core.js` 中的组件，
  各页面一次调用注入，不再逐页复制。
- 类名改为语义化命名（`product__title`、`cate__flyout`、`countdown__unit`），
  HTML / CSS / JS 三方不再依赖 `div1`~`div20` 的序号耦合。
- 样式按令牌 → 布局 → 组件 → 页面四层拆分，颜色与间距统一走 CSS 变量。

### 3. 性能与可访问性

- 移除 Bootstrap + jQuery 共约 268 KB 的未充分利用依赖。
- 图片补充 `width` / `height` 与 `loading="lazy"`，减少布局偏移。
- 补充 `alt`、`aria-label`、`role`、跳转到主内容链接、键盘方向键控制轮播、
  `:focus-visible` 焦点环，并支持 `prefers-reduced-motion`。

## 数据维护

修改 `assets/js/data.js` 即可调整首页分类、秒杀商品、推荐商品、优惠券与公告。
商品字段：

```js
{ id, name, img, price, origin, shop, comments, tag }
```

## 已知说明

- 本作品仅用于前端练习，不提供真实交易，登录与搜索均为前端演示。
- `img/` 等目录沿用了原项目素材。重构后的页面实际引用约 33 张图片，
  其余为原项目遗留；如需精简体积可自行清理（`git` 历史中仍可找回）。
- 未接入后端，购物车与领券状态存于浏览器 `localStorage`。
