# CiteSpace数据采集系统 - Prompts模块

本文件夹包含了CiteSpace数据采集系统中所有表单模块的AI提示词（Prompts），用于指导AI模型准确提取和分析各个模块的数据。

## 📁 文件结构

```
prompts/
├── README.md                           # 本说明文档
├── index.js                            # 主索引文件，统一管理所有prompts
├── data-retrieval-prompts.js           # 数据检索基础信息模块
├── publication-trend-prompts.js        # 年发文量趋势分析模块
├── country-distribution-prompts.js     # 国家/地区分布模块
├── journal-distribution-prompts.js     # 期刊分布模块
├── institution-distribution-prompts.js # 机构分布模块
├── author-analysis-prompts.js          # 作者分析模块
├── burst-analysis-prompts.js           # 突现词分析模块
├── cluster-analysis-prompts.js         # 聚类分析模块
├── keyword-analysis-prompts.js         # 关键词分析模块
├── temporal-evolution-prompts.js       # 时间演化分析模块
├── core-citations-prompts.js           # 核心引文模块
├── network-topology-prompts.js         # 网络拓扑特征模块
├── citation-pattern-prompts.js         # 引用模式分析模块
└── data-quality-prompts.js             # 数据质量与可靠性模块
```

## 🎯 模块说明

### 1. 数据检索基础信息 (`data-retrieval-prompts.js`)
- **功能**: 提取文献检索的基本参数和设置信息
- **主要字段**: 数据库来源、检索策略、时间范围、学科范围、文献数量等
- **适用场景**: 文献检索参数记录和基础信息提取

### 2. 年发文量趋势分析 (`publication-trend-prompts.js`)
- **功能**: 分析文献发表的时间趋势和变化模式
- **主要字段**: 总发文量、时间跨度、高峰年份、增长率、发展趋势等
- **适用场景**: 研究领域发展历程分析

### 3. 国家/地区分布 (`country-distribution-prompts.js`)
- **功能**: 分析文献的地理分布和国际合作情况
- **主要字段**: 主要国家、各国发文量、国际合作、合作网络等
- **适用场景**: 国际学术合作分析

### 4. 期刊分布 (`journal-distribution-prompts.js`)
- **功能**: 分析文献的期刊分布和发表质量
- **主要字段**: 主要期刊、期刊发文量、影响因子、期刊分类等
- **适用场景**: 学术期刊影响力分析

### 5. 机构分布 (`institution-distribution-prompts.js`)
- **功能**: 分析研究机构的分布和合作网络
- **主要字段**: 主要机构、机构发文量、机构类型、合作网络等
- **适用场景**: 研究机构影响力分析

### 6. 作者分析 (`author-analysis-prompts.js`)
- **功能**: 分析作者的贡献和合作网络
- **主要字段**: 主要作者、作者发文量、H指数、合作网络等
- **适用场景**: 学者影响力分析

### 7. 突现词分析 (`burst-analysis-prompts.js`)
- **功能**: 识别和分析突现性关键词
- **主要字段**: 突现词、突现强度、突现时期、突现趋势等
- **适用场景**: 研究热点识别

### 8. 聚类分析 (`cluster-analysis-prompts.js`)
- **功能**: 分析研究主题的聚类结构
- **主要字段**: 聚类数量、聚类标签、聚类大小、聚类质量等
- **适用场景**: 研究主题分类

### 9. 关键词分析 (`keyword-analysis-prompts.js`)
- **功能**: 分析关键词的分布和重要性
- **主要字段**: 主要关键词、关键词频次、中心性、聚类等
- **适用场景**: 研究主题分析

### 10. 时间演化分析 (`temporal-evolution-prompts.js`)
- **功能**: 分析研究主题的时间演化过程
- **主要字段**: 时间段、演化阶段、阶段特征、演化趋势等
- **适用场景**: 研究发展历程分析

### 11. 核心引文 (`core-citations-prompts.js`)
- **功能**: 识别和分析核心引用文献
- **主要字段**: 核心论文、引用频次、高被引论文、引用网络等
- **适用场景**: 经典文献识别

### 12. 网络拓扑特征 (`network-topology-prompts.js`)
- **功能**: 分析知识网络的拓扑结构特征
- **主要字段**: 网络节点、网络边、网络密度、聚类系数等
- **适用场景**: 知识网络结构分析

### 13. 引用模式分析 (`citation-pattern-prompts.js`)
- **功能**: 分析文献引用的模式和特征
- **主要字段**: 引用模式、引用频次、引用网络、引用质量等
- **适用场景**: 引用行为分析

### 14. 数据质量与可靠性 (`data-quality-prompts.js`)
- **功能**: 评估数据质量和可靠性指标
- **主要字段**: 数据完整性、准确性、一致性、可靠性等
- **适用场景**: 数据质量评估

## 🚀 使用方法

### 1. 在HTML中引入所有prompts文件

```html
<!-- 在index.html中添加以下script标签 -->
<script src="prompts/data-retrieval-prompts.js"></script>
<script src="prompts/publication-trend-prompts.js"></script>
<script src="prompts/country-distribution-prompts.js"></script>
<script src="prompts/journal-distribution-prompts.js"></script>
<script src="prompts/institution-distribution-prompts.js"></script>
<script src="prompts/author-analysis-prompts.js"></script>
<script src="prompts/burst-analysis-prompts.js"></script>
<script src="prompts/cluster-analysis-prompts.js"></script>
<script src="prompts/keyword-analysis-prompts.js"></script>
<script src="prompts/temporal-evolution-prompts.js"></script>
<script src="prompts/core-citations-prompts.js"></script>
<script src="prompts/network-topology-prompts.js"></script>
<script src="prompts/citation-pattern-prompts.js"></script>
<script src="prompts/data-quality-prompts.js"></script>
<script src="prompts/index.js"></script>
```

### 2. 获取特定模块的prompt

```javascript
// 获取数据检索基础信息模块的prompt
const dataRetrievalPrompt = getModulePrompt('data-retrieval');

// 获取年发文量趋势分析模块的prompt
const publicationTrendPrompt = getModulePrompt('publication-trend');

// 获取所有可用的模块列表
const availableModules = getAvailableModules();
console.log('可用模块:', availableModules);
```

### 3. 获取模块信息

```javascript
// 获取模块详细信息
const moduleInfo = MODULE_INFO['data-retrieval'];
console.log('模块名称:', moduleInfo.name);
console.log('模块描述:', moduleInfo.description);
console.log('字段列表:', moduleInfo.fields);
```

## 📋 模块映射表

| 模块ID | 模块名称 | 描述 |
|--------|----------|------|
| `data-retrieval` | 数据检索基础信息 | 提取文献检索的基本参数和设置信息 |
| `publication-trend` | 年发文量趋势分析 | 分析文献发表的时间趋势和变化模式 |
| `country-distribution` | 国家/地区分布 | 分析文献的地理分布和国际合作情况 |
| `journal-distribution` | 期刊分布 | 分析文献的期刊分布和发表质量 |
| `institution-distribution` | 机构分布 | 分析研究机构的分布和合作网络 |
| `author-analysis` | 作者分析 | 分析作者的贡献和合作网络 |
| `burst-analysis` | 突现词分析 | 识别和分析突现性关键词 |
| `cluster-analysis` | 聚类分析 | 分析研究主题的聚类结构 |
| `keyword-analysis` | 关键词分析 | 分析关键词的分布和重要性 |
| `temporal-evolution` | 时间演化分析 | 分析研究主题的时间演化过程 |
| `core-citations` | 核心引文 | 识别和分析核心引用文献 |
| `network-topology` | 网络拓扑特征 | 分析知识网络的拓扑结构特征 |
| `citation-pattern` | 引用模式分析 | 分析文献引用的模式和特征 |
| `data-quality` | 数据质量与可靠性 | 评估数据质量和可靠性指标 |

## 🔧 扩展说明

### 添加新模块

1. 在`prompts/`文件夹中创建新的prompt文件，如`new-module-prompts.js`
2. 在文件中定义prompt常量并导出到全局作用域
3. 在`prompts/index.js`中的`PROMPT_MAPPING`中添加新模块的映射
4. 在`MODULE_INFO`中添加新模块的详细信息
5. 在HTML中引入新的prompt文件

### 修改现有模块

1. 直接编辑对应的prompt文件
2. 确保修改后的prompt保持JSON格式的一致性
3. 测试修改后的prompt是否正常工作

## 📝 注意事项

1. **格式一致性**: 所有prompt都必须输出严格的JSON格式
2. **字段ID**: 使用准确的fieldId作为JSON的key
3. **数据类型**: 数字字段输出纯数字，文本字段保持原始描述
4. **多值处理**: 多个值用逗号分隔
5. **错误处理**: 如果某字段无法识别，则省略该字段

## 🤝 贡献指南

如果您需要添加新的模块或修改现有模块，请：

1. 遵循现有的命名规范和代码风格
2. 确保新prompt的格式与现有prompt保持一致
3. 更新相关的文档和映射表
4. 测试新功能是否正常工作

---

**版本**: 1.0.0  
**更新时间**: 2024年8月  
**维护者**: CiteSpace开发团队
