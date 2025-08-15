# 🧪 图片API功能测试指南

## 概述

这个测试指南将帮助你验证图片API功能是否正常工作。我们提供了多个测试工具来诊断和解决问题。

## 📁 测试文件说明

1. **simple-test.html** - 简化版测试页面，避免语法错误
2. **debug.html** - 详细调试页面，包含完整功能测试
3. **test-runner.js** - 自动化测试脚本，可在浏览器控制台运行
4. **test-image-function.html** - 功能测试页面

## 🚀 快速开始测试

### 方法1: 使用简化测试页面（推荐）

1. 打开浏览器访问: `http://localhost:8080/simple-test.html`
2. 按顺序点击测试按钮：
   - **检查配置** - 验证API密钥和配置
   - **测试连接** - 测试网络连通性
   - **选择图片** - 上传测试图片
   - **测试图片格式** - 验证图片格式
   - **测试API调用** - 实际调用API

### 方法2: 使用浏览器控制台测试

1. 打开浏览器控制台 (F12)
2. 运行以下命令：

```javascript
// 加载测试脚本
const script = document.createElement('script');
script.src = 'test-runner.js';
document.head.appendChild(script);

// 或者直接运行测试
fetch('test-runner.js').then(r => r.text()).then(eval);
```

## 🔍 测试步骤详解

### 步骤1: 配置检查
- **API密钥**: 495fdf63-5ae3-4b9c-8501-c36603088e8e
- **API地址**: https://ark.cn-beijing.volces.com/api/v3/chat/completions
- **模型**: doubao-seed-1-6-flash-250715

### 步骤2: 网络测试
- 测试与豆包API服务器的连接
- 验证API密钥有效性
- 检查HTTP响应状态

### 步骤3: 图片格式验证
- 支持的格式: JPEG, PNG, WebP
- 最大文件大小: 10MB
- Base64编码验证

### 步骤4: API调用测试
- 构建正确的请求payload
- 验证响应格式
- 检查错误处理

## 🛠️ 常见问题解决

### 问题1: API调用失败
**症状**: 401/403错误
**解决**: 
- 检查API密钥是否正确
- 确认密钥是否有权限访问视觉模型
- 验证密钥是否过期

### 问题2: 图片上传失败
**症状**: 格式错误或文件过大
**解决**:
- 使用支持的图片格式（JPEG, PNG, WebP）
- 确保文件小于10MB
- 检查图片是否损坏

### 问题3: 网络连接问题
**症状**: 无法连接到API服务器
**解决**:
- 检查网络连接
- 确认防火墙设置
- 尝试使用其他网络

## 📊 测试数据

### 示例Payload格式
```json
{
  "model": "doubao-seed-1-6-flash-250715",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的数据分析师，请准确分析图片中的内容。"
    },
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,[图片base64数据]"
          }
        },
        {
          "type": "text",
          "text": "请分析这张图片"
        }
      ]
    }
  ],
  "max_tokens": 500,
  "temperature": 0.1
}
```

### 测试图片建议
- 使用1MB左右的小图片进行测试
- 选择清晰的、有明确内容的图片
- 避免使用过于复杂或模糊的图片

## 🎯 成功验证

当所有测试通过时，你应该看到：
- ✅ 配置检查通过
- ✅ 网络连接正常
- ✅ 图片格式验证通过
- ✅ API调用成功，返回分析结果

## 📝 下一步

如果测试全部通过，说明图片API功能已正常工作。如果仍有失败，请：
1. 检查控制台错误信息
2. 查看详细日志
3. 联系技术支持提供测试日志

## 🔗 相关文件

- `simple-test.html` - 简化测试页面
- `debug.html` - 详细调试工具
- `test-runner.js` - 自动化测试脚本
- `config.js` - API配置文件
- `ai-core.js` - 图片处理核心逻辑