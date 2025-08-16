// 发文量演化分析提示词
const PUBLICATION_EVOLUTION_PROMPT = `分析图片中的发文量时间演化数据，提取以下字段信息：

**分析要求：**
1. 根据发文量变化趋势划分发展阶段
2. 计算各阶段的时间段和年均发文量
3. 识别峰值、低谷等关键数据点
4. 计算增长率指标

**输出JSON格式：**
{
  "startup_period": "YYYY-YYYY",
  "startup_papers": "数值",
  "growth_period": "YYYY-YYYY", 
  "growth_papers": "数值",
  "burst_period": "YYYY-YYYY",
  "burst_papers": "数值",
  "peak_year": "YYYY",
  "peak_papers": "数值",
  "trough_year": "YYYY", 
  "trough_papers": "数值",
  "overall_growth_rate": "数值",
  "recent_5yr_growth_rate": "数值"
}

**划分标准：**
- 起步期：发文量较少且增长缓慢的初期阶段
- 成长期：发文量开始稳定增长的阶段
- 爆发期：发文量快速增长的阶段

**计算说明：**
- 年均发文量 = 该阶段总发文量 ÷ 阶段年数
- 总体增长率 = ((最后年份发文量 - 第一年发文量) ÷ 第一年发文量) × 100%
- 近5年增长率 = ((最后年份发文量 - 5年前发文量) ÷ 5年前发文量) × 100%

**字段说明：**
- startup_period: 起步期时间段
- startup_papers: 起步期年均发文量
- growth_period: 成长期时间段
- growth_papers: 成长期年均发文量
- burst_period: 爆发期时间段
- burst_papers: 爆发期年均发文量
- peak_year: 峰值年份
- peak_papers: 峰值发文量
- trough_year: 最低谷年份
- trough_papers: 最低谷发文量
- overall_growth_rate: 总体增长率(%)
- recent_5yr_growth_rate: 近5年增长率(%)

仅输出JSON，数值保留整数。`;

// 导出提示词
window.PUBLICATION_EVOLUTION_PROMPT = PUBLICATION_EVOLUTION_PROMPT;