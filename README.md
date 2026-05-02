# QR Studio

专业二维码生成器 — 支持多种格式、自定义外观、批量生成、高清导出。

## 功能

### 内容类型
- **URL** — 输入网址，扫码在浏览器打开
- **文本** — 任意文本内容
- **联系人** — vCard 格式，扫码直接添加联系人（姓名/电话/邮箱/公司/职位/网站）
- **WiFi** — 扫码一键连接 WiFi（WPA/WEP/无密码，支持隐藏网络）

### 自定义外观
- 10 种精选配色方案（含 3 种暗色主题）
- 自定义前景色/背景色（拾色器 + 十六进制输入）
- 上传中心 Logo，可调节大小
- 4 级纠错等级（L 7% / M 15% / Q 25% / H 30%）

### 导出
- PNG 格式：256 / 512 / 1024 / 2048 四种尺寸
- SVG 矢量图格式
- 实时预览，输入即生成

### 批量生成
- 上传 CSV 文件批量导入
- 支持列头：`label`/`名称`、`data`/`内容`/`url`/`text`
- 一键打包下载 ZIP

## 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:5173` 即可使用。

## 构建

```bash
npm run build
```

产物输出到 `dist/` 目录。

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui 组件
- [qrcode](https://www.npmjs.com/package/qrcode) — 二维码生成
- [PapaParse](https://www.npmjs.com/package/papaparse) — CSV 解析
- [JSZip](https://www.npmjs.com/package/jszip) + [FileSaver](https://www.npmjs.com/package/file-saver) — 批量打包下载

## 项目结构

```
src/
├── App.tsx                  # 主应用
├── main.tsx                 # 入口
├── index.css                # 设计系统 token（颜色/渐变/阴影/动画）
├── lib/
│   ├── qr-types.ts          # 类型定义、预设配色、数据格式化
│   ├── qr-generator.ts      # QR 码生成（DataURL / SVG / Logo 合成）
│   └── utils.ts             # 工具函数
└── components/
    ├── forms/               # 输入表单（URL / 文本 / 联系人 / WiFi）
    ├── StylePanel.tsx        # 外观自定义面板
    ├── QRPreview.tsx         # 实时预览
    ├── DownloadPanel.tsx     # 下载（多格式/多尺寸）
    ├── BatchPanel.tsx        # CSV 批量生成
    └── ui/                  # 基础 UI 组件
```

## License

MIT