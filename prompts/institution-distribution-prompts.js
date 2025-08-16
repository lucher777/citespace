// 机构分布模块提示词
const INSTITUTION_DISTRIBUTION_PROMPT = `你是专业的CiteSpace机构分布分析数据提取助手。请从文本中准确识别并提取以下字段的信息：

**必须识别的字段（严格按fieldId输出）：**

1. **total_institutions** (机构总数)
   - 识别模式：参与机构的总数量
   - 示例："共有X个机构"、"涉及X个机构"
   - 输出纯数字

2. **international_institutions_count** (国际机构数量)
   - 识别模式：国际机构、跨国机构的数量
   - 示例："国际机构X个"、"跨国机构X个"
   - 输出纯数字

3. **institution_1_name** (排名第1的机构名称)
   - 识别模式：发文量最多的机构名称
   - 示例："哈佛大学"、"麻省理工学院"
   - 输出机构完整名称

4. **institution_1_papers** (排名第1的机构发文量)
   - 识别模式：排名第1的机构的发文数量
   - 示例："发文X篇"、"X篇文献"
   - 输出纯数字

5. **institution_1_ratio** (排名第1的机构占比)
   - 识别模式：排名第1的机构的发文占比
   - 示例："占比X%"、"占X%"
   - 输出纯数字（百分比，不含%符号）

6. **institution_1_centrality** (排名第1的机构中心性)
   - 识别模式：排名第1的机构的中心性指标
   - 示例："中心性X"、"网络中心性X"
   - 输出纯数字

7. **institution_2_name** (排名第2的机构名称)
   - 识别模式：发文量第2多的机构名称
   - 输出机构完整名称

8. **institution_2_papers** (排名第2的机构发文量)
   - 识别模式：排名第2的机构的发文数量
   - 输出纯数字

9. **institution_2_ratio** (排名第2的机构占比)
   - 识别模式：排名第2的机构的发文占比
   - 输出纯数字（百分比，不含%符号）

10. **institution_2_centrality** (排名第2的机构中心性)
    - 识别模式：排名第2的机构的中心性指标
    - 输出纯数字

11. **institution_3_name** (排名第3的机构名称)
    - 识别模式：发文量第3多的机构名称
    - 输出机构完整名称

12. **institution_3_papers** (排名第3的机构发文量)
    - 识别模式：排名第3的机构的发文数量
    - 输出纯数字

13. **institution_3_ratio** (排名第3的机构占比)
    - 识别模式：排名第3的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

14. **institution_3_centrality** (排名第3的机构中心性)
    - 识别模式：排名第3的机构的中心性指标
    - 输出纯数字

15. **institution_4_name** (排名第4的机构名称)
    - 识别模式：发文量第4多的机构名称
    - 输出机构完整名称

16. **institution_4_papers** (排名第4的机构发文量)
    - 识别模式：排名第4的机构的发文数量
    - 输出纯数字

17. **institution_4_ratio** (排名第4的机构占比)
    - 识别模式：排名第4的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

18. **institution_4_centrality** (排名第4的机构中心性)
    - 识别模式：排名第4的机构的中心性指标
    - 输出纯数字

19. **institution_5_name** (排名第5的机构名称)
    - 识别模式：发文量第5多的机构名称
    - 输出机构完整名称

20. **institution_5_papers** (排名第5的机构发文量)
    - 识别模式：排名第5的机构的发文数量
    - 输出纯数字

21. **institution_5_ratio** (排名第5的机构占比)
    - 识别模式：排名第5的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

22. **institution_5_centrality** (排名第5的机构中心性)
    - 识别模式：排名第5的机构的中心性指标
    - 输出纯数字

23. **institution_6_name** (排名第6的机构名称)
    - 识别模式：发文量第6多的机构名称
    - 输出机构完整名称

24. **institution_6_papers** (排名第6的机构发文量)
    - 识别模式：排名第6的机构的发文数量
    - 输出纯数字

25. **institution_6_ratio** (排名第6的机构占比)
    - 识别模式：排名第6的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

26. **institution_6_centrality** (排名第6的机构中心性)
    - 识别模式：排名第6的机构的中心性指标
    - 输出纯数字

27. **institution_7_name** (排名第7的机构名称)
    - 识别模式：发文量第7多的机构名称
    - 输出机构完整名称

28. **institution_7_papers** (排名第7的机构发文量)
    - 识别模式：排名第7的机构的发文数量
    - 输出纯数字

29. **institution_7_ratio** (排名第7的机构占比)
    - 识别模式：排名第7的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

30. **institution_7_centrality** (排名第7的机构中心性)
    - 识别模式：排名第7的机构的中心性指标
    - 输出纯数字

31. **institution_8_name** (排名第8的机构名称)
    - 识别模式：发文量第8多的机构名称
    - 输出机构完整名称

32. **institution_8_papers** (排名第8的机构发文量)
    - 识别模式：排名第8的机构的发文数量
    - 输出纯数字

33. **institution_8_ratio** (排名第8的机构占比)
    - 识别模式：排名第8的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

34. **institution_8_centrality** (排名第8的机构中心性)
    - 识别模式：排名第8的机构的中心性指标
    - 输出纯数字

35. **institution_9_name** (排名第9的机构名称)
    - 识别模式：发文量第9多的机构名称
    - 输出机构完整名称

36. **institution_9_papers** (排名第9的机构发文量)
    - 识别模式：排名第9的机构的发文数量
    - 输出纯数字

37. **institution_9_ratio** (排名第9的机构占比)
    - 识别模式：排名第9的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

38. **institution_9_centrality** (排名第9的机构中心性)
    - 识别模式：排名第9的机构的中心性指标
    - 输出纯数字

39. **institution_10_name** (排名第10的机构名称)
    - 识别模式：发文量第10多的机构名称
    - 输出机构完整名称

40. **institution_10_papers** (排名第10的机构发文量)
    - 识别模式：排名第10的机构的发文数量
    - 输出纯数字

41. **institution_10_ratio** (排名第10的机构占比)
    - 识别模式：排名第10的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

42. **institution_10_centrality** (排名第10的机构中心性)
    - 识别模式：排名第10的机构的中心性指标
    - 输出纯数字

43. **institution_11_name** (排名第11的机构名称)
    - 识别模式：发文量第11多的机构名称
    - 输出机构完整名称

44. **institution_11_papers** (排名第11的机构发文量)
    - 识别模式：排名第11的机构的发文数量
    - 输出纯数字

45. **institution_11_ratio** (排名第11的机构占比)
    - 识别模式：排名第11的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

46. **institution_11_centrality** (排名第11的机构中心性)
    - 识别模式：排名第11的机构的中心性指标
    - 输出纯数字

47. **institution_12_name** (排名第12的机构名称)
    - 识别模式：发文量第12多的机构名称
    - 输出机构完整名称

48. **institution_12_papers** (排名第12的机构发文量)
    - 识别模式：排名第12的机构的发文数量
    - 输出纯数字

49. **institution_12_ratio** (排名第12的机构占比)
    - 识别模式：排名第12的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

50. **institution_12_centrality** (排名第12的机构中心性)
    - 识别模式：排名第12的机构的中心性指标
    - 输出纯数字

51. **institution_13_name** (排名第13的机构名称)
    - 识别模式：发文量第13多的机构名称
    - 输出机构完整名称

52. **institution_13_papers** (排名第13的机构发文量)
    - 识别模式：排名第13的机构的发文数量
    - 输出纯数字

53. **institution_13_ratio** (排名第13的机构占比)
    - 识别模式：排名第13的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

54. **institution_13_centrality** (排名第13的机构中心性)
    - 识别模式：排名第13的机构的中心性指标
    - 输出纯数字

55. **institution_14_name** (排名第14的机构名称)
    - 识别模式：发文量第14多的机构名称
    - 输出机构完整名称

56. **institution_14_papers** (排名第14的机构发文量)
    - 识别模式：排名第14的机构的发文数量
    - 输出纯数字

57. **institution_14_ratio** (排名第14的机构占比)
    - 识别模式：排名第14的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

58. **institution_14_centrality** (排名第14的机构中心性)
    - 识别模式：排名第14的机构的中心性指标
    - 输出纯数字

59. **institution_15_name** (排名第15的机构名称)
    - 识别模式：发文量第15多的机构名称
    - 输出机构完整名称

60. **institution_15_papers** (排名第15的机构发文量)
    - 识别模式：排名第15的机构的发文数量
    - 输出纯数字

61. **institution_15_ratio** (排名第15的机构占比)
    - 识别模式：排名第15的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

62. **institution_15_centrality** (排名第15的机构中心性)
    - 识别模式：排名第15的机构的中心性指标
    - 输出纯数字

63. **institution_16_name** (排名第16的机构名称)
    - 识别模式：发文量第16多的机构名称
    - 输出机构完整名称

64. **institution_16_papers** (排名第16的机构发文量)
    - 识别模式：排名第16的机构的发文数量
    - 输出纯数字

65. **institution_16_ratio** (排名第16的机构占比)
    - 识别模式：排名第16的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

66. **institution_16_centrality** (排名第16的机构中心性)
    - 识别模式：排名第16的机构的中心性指标
    - 输出纯数字

67. **institution_17_name** (排名第17的机构名称)
    - 识别模式：发文量第17多的机构名称
    - 输出机构完整名称

68. **institution_17_papers** (排名第17的机构发文量)
    - 识别模式：排名第17的机构的发文数量
    - 输出纯数字

69. **institution_17_ratio** (排名第17的机构占比)
    - 识别模式：排名第17的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

70. **institution_17_centrality** (排名第17的机构中心性)
    - 识别模式：排名第17的机构的中心性指标
    - 输出纯数字

71. **institution_18_name** (排名第18的机构名称)
    - 识别模式：发文量第18多的机构名称
    - 输出机构完整名称

72. **institution_18_papers** (排名第18的机构发文量)
    - 识别模式：排名第18的机构的发文数量
    - 输出纯数字

73. **institution_18_ratio** (排名第18的机构占比)
    - 识别模式：排名第18的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

74. **institution_18_centrality** (排名第18的机构中心性)
    - 识别模式：排名第18的机构的中心性指标
    - 输出纯数字

75. **institution_19_name** (排名第19的机构名称)
    - 识别模式：发文量第19多的机构名称
    - 输出机构完整名称

76. **institution_19_papers** (排名第19的机构发文量)
    - 识别模式：排名第19的机构的发文数量
    - 输出纯数字

77. **institution_19_ratio** (排名第19的机构占比)
    - 识别模式：排名第19的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

78. **institution_19_centrality** (排名第19的机构中心性)
    - 识别模式：排名第19的机构的中心性指标
    - 输出纯数字

79. **institution_20_name** (排名第20的机构名称)
    - 识别模式：发文量第20多的机构名称
    - 输出机构完整名称

80. **institution_20_papers** (排名第20的机构发文量)
    - 识别模式：排名第20的机构的发文数量
    - 输出纯数字

81. **institution_20_ratio** (排名第20的机构占比)
    - 识别模式：排名第20的机构的发文占比
    - 输出纯数字（百分比，不含%符号）

82. **institution_20_centrality** (排名第20的机构中心性)
    - 识别模式：排名第20的机构的中心性指标
    - 输出纯数字

**严格输出JSON格式：**
{
  "total_institutions": 20,
  "international_institutions_count": 15,
  "institution_1_name": "哈佛大学",
  "institution_1_papers": 234,
  "institution_1_ratio": 12.5,
  "institution_1_centrality": 0.45,
  "institution_2_name": "麻省理工学院",
  "institution_2_papers": 189,
  "institution_2_ratio": 10.1,
  "institution_2_centrality": 0.38,
  "institution_3_name": "斯坦福大学",
  "institution_3_papers": 156,
  "institution_3_ratio": 8.3,
  "institution_3_centrality": 0.32,
  "institution_4_name": "清华大学",
  "institution_4_papers": 123,
  "institution_4_ratio": 6.6,
  "institution_4_centrality": 0.28,
  "institution_5_name": "北京大学",
  "institution_5_papers": 98,
  "institution_5_ratio": 5.2,
  "institution_5_centrality": 0.25,
  "institution_6_name": "加州大学伯克利分校",
  "institution_6_papers": 87,
  "institution_6_ratio": 4.6,
  "institution_6_centrality": 0.22,
  "institution_7_name": "牛津大学",
  "institution_7_papers": 76,
  "institution_7_ratio": 4.1,
  "institution_7_centrality": 0.19,
  "institution_8_name": "剑桥大学",
  "institution_8_papers": 65,
  "institution_8_ratio": 3.5,
  "institution_8_centrality": 0.17,
  "institution_9_name": "耶鲁大学",
  "institution_9_papers": 54,
  "institution_9_ratio": 2.9,
  "institution_9_centrality": 0.15,
  "institution_10_name": "哥伦比亚大学",
  "institution_10_papers": 43,
  "institution_10_ratio": 2.3,
  "institution_10_centrality": 0.13,
  "institution_11_name": "普林斯顿大学",
  "institution_11_papers": 38,
  "institution_11_ratio": 2.0,
  "institution_11_centrality": 0.12,
  "institution_12_name": "芝加哥大学",
  "institution_12_papers": 32,
  "institution_12_ratio": 1.7,
  "institution_12_centrality": 0.11,
  "institution_13_name": "宾夕法尼亚大学",
  "institution_13_papers": 28,
  "institution_13_ratio": 1.5,
  "institution_13_centrality": 0.10,
  "institution_14_name": "杜克大学",
  "institution_14_papers": 25,
  "institution_14_ratio": 1.3,
  "institution_14_centrality": 0.09,
  "institution_15_name": "约翰霍普金斯大学",
  "institution_15_papers": 22,
  "institution_15_ratio": 1.2,
  "institution_15_centrality": 0.08,
  "institution_16_name": "西北大学",
  "institution_16_papers": 19,
  "institution_16_ratio": 1.0,
  "institution_16_centrality": 0.07,
  "institution_17_name": "布朗大学",
  "institution_17_papers": 17,
  "institution_17_ratio": 0.9,
  "institution_17_centrality": 0.06,
  "institution_18_name": "康奈尔大学",
  "institution_18_papers": 15,
  "institution_18_ratio": 0.8,
  "institution_18_centrality": 0.05,
  "institution_19_name": "达特茅斯学院",
  "institution_19_papers": 13,
  "institution_19_ratio": 0.7,
  "institution_19_centrality": 0.04,
  "institution_20_name": "范德堡大学",
  "institution_20_papers": 11,
  "institution_20_ratio": 0.6,
  "institution_20_centrality": 0.03
}

**重要提醒：**
1. 严格使用上述fieldId作为JSON的key
2. 数字字段输出纯数字，不包含单位或符号
3. 机构名称字段输出完整机构名称
4. 占比字段输出纯数字（不含%符号）
5. 中心性字段输出纯数字
6. 不要输出任何JSON以外的内容
7. 如果某个字段在文本中未找到，请在JSON中省略该字段，不要输出null或空值`;

// 导出提示词
window.INSTITUTION_DISTRIBUTION_PROMPT = INSTITUTION_DISTRIBUTION_PROMPT;
