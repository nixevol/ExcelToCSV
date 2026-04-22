# Excel To CSV

基于 Tauri v2 (Rust) + Vue 3 的 Excel 转 CSV 桌面工具。

## 功能

- 支持 `.xls`、`.xlsx`、`.xlsm` 格式的 Excel 文件
- 支持批量导入与拖拽导入
- 可自定义输出文件命名规则（含时间戳等组合）
- 支持 GBK / UTF-8 输出编码
- 支持设置 Sheet 排除关键字，跳过无需转换的表单
- 支持转换过程中手动停止
- 浅色 / 深色主题切换

## 开发环境

### 依赖
- Node.js v18+
- Rust 1.70+
- Tauri CLI 2.x

### 运行调试
```bash
npm install
npm run tauri dev
```

### 构建发布
```bash
npm run tauri build
```

## 开发者
Nixevol

## 许可证
MIT License
