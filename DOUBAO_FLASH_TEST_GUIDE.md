# 豆包Flash模型测试指南

本文档详细说明如何测试 `doubao-seed-1-6-flash-250715` 接口的功能。

## 📋 测试文件说明

项目中包含以下专门用于测试豆包Flash模型的文件：

1. `doubao-flash-test.html` - 图形化测试界面
2. `doubao-flash-test.js` - JavaScript测试脚本

## 🚀 快速开始

### 使用图形化测试界面

1. 在浏览器中打开 `doubao-flash-test.html`
2. 点击"检查配置"按钮验证API配置
3. 点击"测试连接"按钮验证网络连接
4. 选择一张图片文件
5. 点击"测试图片格式"验证图片处理
6. 点击"测试API调用"执行实际API调用

### 使用JavaScript测试脚本

```javascript
// 引入测试类
const DoubaoFlashTester = require('./doubao-flash-test.js');

// 创建测试实例
const tester = new DoubaoFlashTester();

// 运行所有测试（不带图片）
tester.runAllTests();

// 运行所有测试（带图片）
// 注意：需要在浏览器环境中提供File对象
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
tester.runAllTests(file);
```

## 🧪 详细测试步骤

### 1. 配置检查

验证以下配置项是否正确设置：
- API密钥: `495fdf63-5ae3-4b9c-8501-c36603088e8e`
- API地址: `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
- 模型名称: `doubao-seed-1-6-flash-250715`

### 2. 网络连接测试

验证能否成功连接到豆包API服务器。

### 3. 图片格式验证

支持的图片格式：
- JPEG/JPG
- PNG
- WebP

文件大小限制：10MB

### 4. API调用测试

测试完整的API调用流程：
1. 构建符合豆包API格式的请求
2. 发送请求到 `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
3. 验证响应结果

## 📋 测试结果说明

### 成功结果

- 配置检查通过
- 网络连接正常
- 图片格式验证通过
- API调用成功并返回有效内容

### 失败结果

- 配置缺失或错误
- 网络连接失败
- 图片格式不支持
- API调用返回错误

## 🔧 故障排除

### 常见问题

1. **API密钥错误**
   - 检查API密钥是否正确配置
   - 确认密钥是否有足够的权限

2. **网络连接失败**
   - 检查网络连接是否正常
   - 确认API地址是否正确
   - 检查防火墙设置

3. **图片处理失败**
   - 检查图片格式是否支持
   - 确认图片大小是否超过限制
   - 验证图片文件是否损坏

4. **API调用失败**
   - 检查请求格式是否正确
   - 确认模型名称是否正确
   - 查看API返回的错误信息

## 📝 测试数据建议

### 推荐测试图片

1. 包含清晰文字的截图
2. 包含表格数据的图片
3. 包含图表的图片
4. 复杂布局的图片

### 测试文本

```
请分析这张图片中的数据，并提取相关信息。
```

## ✅ 验证标准

测试成功的标准：
1. 所有配置项正确无误
2. 能够成功连接到API服务器
3. 图片能够正确处理并转换为base64格式
4. API能够成功接收请求并返回有效响应
5. 响应内容包含对图片内容的描述

## 📞 技术支持

如在测试过程中遇到问题，请联系技术支持团队。