# 图片API格式更新说明

## 修改概述

本次更新根据豆包视觉API的标准格式，重写了项目中处理图片的API调用逻辑。

## 主要修改内容

### 1. 豆包API格式适配 (`ai-core.js`)

**原始格式：**
```json
{
  "role": "user",
  "content": [
    { "type": "text", "text": "..." },
    { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,..." } }
  ]
}
```

**豆包标准格式：**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image_url",
      "image_url": {
        "url": "data:image/jpeg;base64,..."
      }
    },
    {
      "type": "text",
      "text": "图片主要讲了什么?"
    }
  ]
}
```

### 2. 按提供商区分的处理逻辑

- **豆包 (doubao)**: 使用标准豆包视觉API格式，image_url在前，text在后
- **OpenAI**: 保持原有OpenAI格式
- **DeepSeek**: 使用兼容的base64格式


### 3. 视觉模型配置优化 (`config.js`)

- 添加了专门的visionModel配置
- 优化了getCurrentModel函数，在有图片时优先使用视觉模型
- 确保豆包视觉模型 `doubao-seed-1-6-flash-250715` 可用

## 使用方式

### 图片上传流程

1. 用户点击"图文采集"按钮
2. 选择或粘贴图片
3. 系统自动检测是否有图片
4. 有图片时，使用视觉模型和对应的API格式
5. 无图片时，使用文本模型

### API调用示例

```javascript
// 豆包视觉API调用
const payload = {
  model: "doubao-seed-1-6-flash-250715",
  messages: [
    {
      role: "system",
      content: "系统提示词"
    },
    {
      role: "user", 
      content: [
        {
          type: "image_url",
          image_url: {
            url: "data:image/jpeg;base64,图片base64数据"
          }
        },
        {
          type: "text",
          text: "请分析图片内容"
        }
      ]
    }
  ]
};
```

## 测试验证

- 创建了测试页面 `test-image-api.html`
- 支持本地测试图片API格式
- 提供了格式验证功能

## 兼容性

- 向后兼容：原有文本处理逻辑不变
- 多提供商支持：保持对OpenAI、DeepSeek的支持
- 错误处理：完善的错误提示和回退机制