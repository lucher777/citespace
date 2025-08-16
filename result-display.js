// 结果显示和处理模块
// 负责AI分析结果的显示和处理

function displayCaptureResults(extractedData, descriptor, targetSection, rawText) {
    const container = document.getElementById('captureResultsContainer');
    const resultsDiv = document.getElementById('captureResults');
    
    // 智能字段匹配
    let validFields = [];
    let processedData = { ...extractedData }; // 创建数据副本用于处理
    
    // 调试：输出原始数据
    console.log('原始提取数据:', extractedData);
    
    // 1. 直接匹配
    validFields = descriptor.fields.filter(f => processedData[f.fieldId] !== undefined);
    console.log('直接匹配后的有效字段:', validFields);
    
    // 2. 从summary对象中提取
    if (validFields.length === 0 && processedData.summary && typeof processedData.summary === 'object') {
        Object.keys(processedData.summary).forEach(key => {
            processedData[key] = processedData.summary[key];
        });
        validFields = descriptor.fields.filter(f => processedData[f.fieldId] !== undefined);
        console.log('从summary对象提取后的有效字段:', validFields);
    }
    
    // 3. 数据检索基础信息字段映射（完全对应index.html实际字段）
    const databaseMapping = {
        // AI解析字段名 → HTML表单字段ID映射
        'database_sources': 'database_source',
        'search_strategy': 'search_strategy',
        'time_range': 'time_range',
        'subject_scope': 'subject_scope',
        'initial_papers': 'initial_papers',
        'final_papers': 'final_papers',
        'document_type': 'document_type_limit',
        'language_limit': 'language_limit',
        'citespace_version': 'citespace_version',
        'time_slice': 'time_slice',
        'node_threshold': 'node_threshold',
        'pruning_method': 'pruning_method',
        
        // 中文键名→实际字段ID映射（备用）
        '数据库来源': 'database_source',
        '数据库': 'database_source',
        '数据源': 'database_source',
        '检索策略': 'search_strategy',
        '检索关键词': 'search_strategy',
        '关键词': 'search_strategy',
        '时间段': 'time_range',
        '时间跨度': 'time_range',
        '学科领域': 'subject_scope',
        '初检文献数': 'initial_papers',
        '初步检索': 'initial_papers',
        '有效文献': 'final_papers',
        '最终文献': 'final_papers',
        '文献类型限制': 'document_type_limit',
        '文献类型': 'document_type_limit',
        '语言': 'language_limit',
        '软件版本': 'citespace_version',
        '切片': 'time_slice',
        '阈值': 'node_threshold',
        '剪枝方法': 'pruning_method',
        
        // 年发文量趋势分析
        '起步期时间段': 'startup_period',
        '起步期': 'startup_period',
        '起步期年均发文量': 'startup_papers',
        '成长期时间段': 'growth_period',
        '成长期': 'growth_period',
        '成长期年均发文量': 'growth_papers',
        '爆发期时间段': 'burst_period',
        '爆发期': 'burst_period',
        '爆发期年均发文量': 'burst_papers',
        '峰值年份': 'peak_year',
        '最高年份': 'peak_year',
        '峰值发文量': 'peak_papers',
        '最高发文量': 'peak_papers',
        '最低谷年份': 'trough_year',
        '最低年份': 'trough_year',
        '最低谷发文量': 'trough_papers',
        '最低发文量': 'trough_papers',
        '总体增长率': 'overall_growth_rate',
        '增长率': 'overall_growth_rate',
        '近5年增长率': 'recent_5yr_growth_rate',
        
        // 国家/地区分布
        '参与国家/地区总数': 'total_countries',
        '国家总数': 'total_countries',
        '国际合作文献数': 'international_collaboration_papers',
        '国际合作文献': 'international_collaboration_papers',
        '国际合作占比': 'international_collaboration_ratio',
        '国际合作比例': 'international_collaboration_ratio',
        
        // 通用数值字段
        '总文献数': 'final_papers',
        '文献总数': 'final_papers',
        '发文量': 'final_papers',
        '数量': 'final_papers'
    };
    
    if (validFields.length === 0) {
        Object.keys(databaseMapping).forEach(chineseKey => {
            if (processedData[chineseKey] !== undefined) {
                const targetFieldId = databaseMapping[chineseKey];
                const targetField = descriptor.fields.find(f => f.fieldId === targetFieldId);
                if (targetField) {
                    processedData[targetFieldId] = processedData[chineseKey];
                    console.log(`通过databaseMapping匹配字段: ${chineseKey} -> ${targetFieldId}`);
                }
            }
        });
        validFields = descriptor.fields.filter(f => processedData[f.fieldId] !== undefined);
        console.log('通过databaseMapping匹配后的有效字段:', validFields);
    }
    
    // 4. 智能模糊匹配系统（增强版）
    if (validFields.length === 0) {
        const enhancedFieldMappings = {
            // AI解析字段名 → HTML表单字段ID的直接映射
            'database_sources': ['database_source'],
            'search_strategy': ['search_strategy'],
            'time_range': ['time_range'],
            'subject_scope': ['subject_scope'],
            'initial_papers': ['initial_papers'],
            'final_papers': ['final_papers'],
            'document_type': ['document_type_limit'],
            'language_limit': ['language_limit'],
            'citespace_version': ['citespace_version'],
            'time_slice': ['time_slice'],
            'node_threshold': ['node_threshold'],
            'pruning_method': ['pruning_method'],
            
            // 数据检索基础信息（备用映射）
            'database_source': ['数据库', '数据源', '来源', 'database', 'source', 'data source', '检索库', '文献库', 'web of science', 'wos', 'cnki', 'scopus', 'pubmed'],
            'search_strategy': ['检索', '搜索', '关键词', '策略', 'query', 'search', '检索词', '搜索词', '检索式', '布尔检索'],
            'time_range': ['时间', '时期', '范围', '跨度', 'period', 'range', '时间跨度', '起止时间', '时间区间', '年份范围'],
            'subject_scope': ['学科', '领域', '范围', 'scope', 'field', '学科分类', '研究领域', '研究方向'],
            'initial_papers': ['初检', '初步', '初始', 'initial', 'preliminary', '初检结果', '首次检索', '初始文献'],
            'final_papers': ['最终', '有效', '总数', 'total', 'final', 'effective', '有效文献', '最终数量', '纳入文献'],
            'document_type_limit': ['文献类型', '类型限制', 'document', 'type', '文献种类', '文章类型', 'article', 'review'],
            'language_limit': ['语言', 'language', '语种', '语言限制', 'english', '中文'],
            'citespace_version': ['版本', '软件', 'CiteSpace', 'version', 'cite space', '软件版本'],
            'time_slice': ['切片', '时间切片', 'slice', '时间片', '切片长度', '时间分割'],
            'node_threshold': ['阈值', '节点', 'threshold', '节点阈值', '选择标准', '筛选条件'],
            'pruning_method': ['剪枝', '网络', '方法', 'pruning', 'pathfinder', 'mst', '网络剪枝', '修剪方法'],
        
            // 年发文量趋势分析
            'startup_period': ['起步期时间段', '起步期', '初期', '开始阶段', 'startup period', 'initial period'],
            'startup_papers': ['起步期年均发文量', '起步期发文量', '初期发文量', 'startup papers'],
            'growth_period': ['成长期时间段', '成长期', '发展阶段', 'growth period', 'development period'],
            'growth_papers': ['成长期年均发文量', '成长期发文量', 'growth papers'],
            'burst_period': ['爆发期时间段', '爆发期', '快速增长', 'burst period', 'explosive period'],
            'burst_papers': ['爆发期年均发文量', '爆发期发文量', 'burst papers'],
            'peak_year': ['峰值年份', '最高年份', 'peak year', 'maximum year'],
            'peak_papers': ['峰值发文量', '最高发文量', 'peak papers', 'maximum papers'],
            'trough_year': ['最低谷年份', '最低年份', 'trough year', 'lowest year', 'minimum year'],
            'trough_papers': ['最低谷发文量', '最低发文量', 'trough papers', 'lowest papers', 'minimum papers'],
            'overall_growth_rate': ['总体增长率', '总增长率', 'overall growth rate', 'total growth rate'],
            'recent_5yr_growth_rate': ['近5年增长率', '最近五年增长率', 'recent 5-year growth rate'],
            'recent_5year_growth_rate': ['近5年增长率', '最近五年增长率', 'recent 5-year growth'],
        
            // 国家/地区分布
            'total_countries': ['国家总数', '参与国家', 'total countries', 'country count'],
            'international_collaboration_papers': ['国际合作文献', '国际合作', 'international collaboration'],
            'international_collaboration_ratio': ['国际合作占比', '国际合作比例', 'international collaboration ratio'],
        
            // 期刊分布
            'total_journals': ['期刊总数', 'total journals', 'journal count'],
            'core_journals': ['核心期刊', 'core journals', '核心期刊数量'],
            'q1_journal_papers': ['Q1期刊发文量', 'Q1期刊', 'top quartile papers'],
            'high_if_journals': ['高影响因子期刊', 'high IF journals', 'high impact factor'],
        
            // 机构分布
            'total_institutions': ['机构总数', 'total institutions', 'institution count'],
            'high_productivity_institutions': ['高产机构', 'high productivity institutions'],
            'institutional_collaboration_papers': ['机构合作文献', 'institutional collaboration'],
            'institutional_collaboration_ratio': ['机构合作占比', 'institutional collaboration ratio'],
        
            // 作者分析
            'total_authors': ['作者总数', 'total authors', 'author count'],
            'high_productivity_authors': ['高产作者', 'high productivity authors'],
            'author_collaboration_papers': ['作者合作文献', 'author collaboration'],
            'author_collaboration_ratio': ['作者合作占比', 'author collaboration ratio'],
            'average_collaboration_degree': ['平均合作度', 'average collaboration degree'],
        
            // 关键词分析
            'total_keywords': ['关键词总数', 'total keywords', 'keyword count'],
            'high_frequency_keywords': ['高频关键词', 'high frequency keywords'],
            'average_keyword_frequency': ['平均词频', 'average keyword frequency'],
        
            // 突现词分析
            'total_burst_keywords': ['突现词总数', 'total burst keywords', 'burst term count'],
            'strongest_burst_keywords': ['最强突现词', 'strongest burst keywords'],
            'average_burst_strength': ['平均突现强度', 'average burst strength'],
        
            // 聚类分析
            'total_clusters': ['聚类总数', 'total clusters', 'cluster count'],
            'major_clusters': ['主要聚类', 'major clusters', 'main clusters'],
            'average_cluster_size': ['平均聚类规模', 'average cluster size'],
            'silhouette_score': ['轮廓系数', 'silhouette score', 'cluster quality'],
        
            // 引用分析
            'total_citations': ['总引用次数', 'total citations', 'citation count'],
            'average_citations': ['平均被引频次', 'average citations', 'mean citations'],
            'self_citation_papers': ['自引文献', 'self citations', 'self-citation count'],
            'self_citation_ratio': ['自引率', 'self citation ratio', 'self-citation percentage'],
            'h_index': ['h指数', 'h-index', 'Hirsch index'],
            'g_index': ['g指数', 'g-index'],
            'citation_half_life': ['引用半衰期', 'citation half life', 'half-life'],
            'price_index': ['Price指数', 'price index']
        };
        
        // 数值字段的特殊处理映射
        const numericFieldPatterns = {
            'count': /(\d+)\s*(?:篇|篇文献|文献|条|个|人|年)/,
            'percentage': /(\d+(?:\.\d+)?)\s*%/,
            'year': /(?:19|20)\d{2}/,
            'range': /(\d{4})\s*[-–—]\s*(\d{4})/,
            'decimal': /(\d+(?:\.\d+)?)/
        };
        
        // 国家/地区分布排名字段的特殊处理
        const countryRankingFields = ['country_1_name', 'country_1_papers', 'country_1_ratio', 'country_1_centrality',
                                    'country_2_name', 'country_2_papers', 'country_2_ratio', 'country_2_centrality',
                                    'country_3_name', 'country_3_papers', 'country_3_ratio', 'country_3_centrality',
                                    'country_4_name', 'country_4_papers', 'country_4_ratio', 'country_4_centrality',
                                    'country_5_name', 'country_5_papers', 'country_5_ratio', 'country_5_centrality',
                                    'country_6_name', 'country_6_papers', 'country_6_ratio', 'country_6_centrality',
                                    'country_7_name', 'country_7_papers', 'country_7_ratio', 'country_7_centrality',
                                    'country_8_name', 'country_8_papers', 'country_8_ratio', 'country_8_centrality',
                                    'country_9_name', 'country_9_papers', 'country_9_ratio', 'country_9_centrality',
                                    'country_10_name', 'country_10_papers', 'country_10_ratio', 'country_10_centrality',
                                    'country_11_name', 'country_11_papers', 'country_11_ratio', 'country_11_centrality',
                                    'country_12_name', 'country_12_papers', 'country_12_ratio', 'country_12_centrality',
                                    'country_13_name', 'country_13_papers', 'country_13_ratio', 'country_13_centrality',
                                    'country_14_name', 'country_14_papers', 'country_14_ratio', 'country_14_centrality',
                                    'country_15_name', 'country_15_papers', 'country_15_ratio', 'country_15_centrality',
                                    'country_16_name', 'country_16_papers', 'country_16_ratio', 'country_16_centrality',
                                    'country_17_name', 'country_17_papers', 'country_17_ratio', 'country_17_centrality',
                                    'country_18_name', 'country_18_papers', 'country_18_ratio', 'country_18_centrality',
                                    'country_19_name', 'country_19_papers', 'country_19_ratio', 'country_19_centrality',
                                    'country_20_name', 'country_20_papers', 'country_20_ratio', 'country_20_centrality'];
        
        // 期刊分布排名字段的特殊处理
        const journalRankingFields = ['journal_1_name', 'journal_1_papers', 'journal_1_ratio', 'journal_1_impact_factor',
                                    'journal_2_name', 'journal_2_papers', 'journal_2_ratio', 'journal_2_impact_factor',
                                    'journal_3_name', 'journal_3_papers', 'journal_3_ratio', 'journal_3_impact_factor',
                                    'journal_4_name', 'journal_4_papers', 'journal_4_ratio', 'journal_4_impact_factor',
                                    'journal_5_name', 'journal_5_papers', 'journal_5_ratio', 'journal_5_impact_factor',
                                    'journal_6_name', 'journal_6_papers', 'journal_6_ratio', 'journal_6_impact_factor',
                                    'journal_7_name', 'journal_7_papers', 'journal_7_ratio', 'journal_7_impact_factor',
                                    'journal_8_name', 'journal_8_papers', 'journal_8_ratio', 'journal_8_impact_factor',
                                    'journal_9_name', 'journal_9_papers', 'journal_9_ratio', 'journal_9_impact_factor',
                                    'journal_10_name', 'journal_10_papers', 'journal_10_ratio', 'journal_10_impact_factor',
                                    'journal_11_name', 'journal_11_papers', 'journal_11_ratio', 'journal_11_impact_factor',
                                    'journal_12_name', 'journal_12_papers', 'journal_12_ratio', 'journal_12_impact_factor',
                                    'journal_13_name', 'journal_13_papers', 'journal_13_ratio', 'journal_13_impact_factor',
                                    'journal_14_name', 'journal_14_papers', 'journal_14_ratio', 'journal_14_impact_factor',
                                    'journal_15_name', 'journal_15_papers', 'journal_15_ratio', 'journal_15_impact_factor',
                                    'journal_16_name', 'journal_16_papers', 'journal_16_ratio', 'journal_16_impact_factor',
                                    'journal_17_name', 'journal_17_papers', 'journal_17_ratio', 'journal_17_impact_factor',
                                    'journal_18_name', 'journal_18_papers', 'journal_18_ratio', 'journal_18_impact_factor',
                                    'journal_19_name', 'journal_19_papers', 'journal_19_ratio', 'journal_19_impact_factor',
                                    'journal_20_name', 'journal_20_papers', 'journal_20_ratio', 'journal_20_impact_factor'];
        
        // 机构分布排名字段的特殊处理
        const institutionRankingFields = ['institution_1_name', 'institution_1_papers', 'institution_1_ratio', 'institution_1_centrality',
                                        'institution_2_name', 'institution_2_papers', 'institution_2_ratio', 'institution_2_centrality',
                                        'institution_3_name', 'institution_3_papers', 'institution_3_ratio', 'institution_3_centrality',
                                        'institution_4_name', 'institution_4_papers', 'institution_4_ratio', 'institution_4_centrality',
                                        'institution_5_name', 'institution_5_papers', 'institution_5_ratio', 'institution_5_centrality',
                                        'institution_6_name', 'institution_6_papers', 'institution_6_ratio', 'institution_6_centrality',
                                        'institution_7_name', 'institution_7_papers', 'institution_7_ratio', 'institution_7_centrality',
                                        'institution_8_name', 'institution_8_papers', 'institution_8_ratio', 'institution_8_centrality',
                                        'institution_9_name', 'institution_9_papers', 'institution_9_ratio', 'institution_9_centrality',
                                        'institution_10_name', 'institution_10_papers', 'institution_10_ratio', 'institution_10_centrality',
                                        'institution_11_name', 'institution_11_papers', 'institution_11_ratio', 'institution_11_centrality',
                                        'institution_12_name', 'institution_12_papers', 'institution_12_ratio', 'institution_12_centrality',
                                        'institution_13_name', 'institution_13_papers', 'institution_13_ratio', 'institution_13_centrality',
                                        'institution_14_name', 'institution_14_papers', 'institution_14_ratio', 'institution_14_centrality',
                                        'institution_15_name', 'institution_15_papers', 'institution_15_ratio', 'institution_15_centrality',
                                        'institution_16_name', 'institution_16_papers', 'institution_16_ratio', 'institution_16_centrality',
                                        'institution_17_name', 'institution_17_papers', 'institution_17_ratio', 'institution_17_centrality',
                                        'institution_18_name', 'institution_18_papers', 'institution_18_ratio', 'institution_18_centrality',
                                        'institution_19_name', 'institution_19_papers', 'institution_19_ratio', 'institution_19_centrality',
                                        'institution_20_name', 'institution_20_papers', 'institution_20_ratio', 'institution_20_centrality'];
        
        // 作者分析排名字段的特殊处理
        const authorRankingFields = ['author_1_name', 'author_1_papers', 'author_1_ratio', 'author_1_h_index', 'author_1_centrality',
                                   'author_2_name', 'author_2_papers', 'author_2_ratio', 'author_2_h_index', 'author_2_centrality',
                                   'author_3_name', 'author_3_papers', 'author_3_ratio', 'author_3_h_index', 'author_3_centrality',
                                   'author_4_name', 'author_4_papers', 'author_4_ratio', 'author_4_h_index', 'author_4_centrality',
                                   'author_5_name', 'author_5_papers', 'author_5_ratio', 'author_5_h_index', 'author_5_centrality',
                                   'author_6_name', 'author_6_papers', 'author_6_ratio', 'author_6_h_index', 'author_6_centrality',
                                   'author_7_name', 'author_7_papers', 'author_7_ratio', 'author_7_h_index', 'author_7_centrality',
                                   'author_8_name', 'author_8_papers', 'author_8_ratio', 'author_8_h_index', 'author_8_centrality',
                                   'author_9_name', 'author_9_papers', 'author_9_ratio', 'author_9_h_index', 'author_9_centrality',
                                   'author_10_name', 'author_10_papers', 'author_10_ratio', 'author_10_h_index', 'author_10_centrality',
                                   'author_11_name', 'author_11_papers', 'author_11_ratio', 'author_11_h_index', 'author_11_centrality',
                                   'author_12_name', 'author_12_papers', 'author_12_ratio', 'author_12_h_index', 'author_12_centrality',
                                   'author_13_name', 'author_13_papers', 'author_13_ratio', 'author_13_h_index', 'author_13_centrality',
                                   'author_14_name', 'author_14_papers', 'author_14_ratio', 'author_14_h_index', 'author_14_centrality',
                                   'author_15_name', 'author_15_papers', 'author_15_ratio', 'author_15_h_index', 'author_15_centrality',
                                   'author_16_name', 'author_16_papers', 'author_16_ratio', 'author_16_h_index', 'author_16_centrality',
                                   'author_17_name', 'author_17_papers', 'author_17_ratio', 'author_17_h_index', 'author_17_centrality',
                                   'author_18_name', 'author_18_papers', 'author_18_ratio', 'author_18_h_index', 'author_18_centrality',
                                   'author_19_name', 'author_19_papers', 'author_19_ratio', 'author_19_h_index', 'author_19_centrality',
                                   'author_20_name', 'author_20_papers', 'author_20_ratio', 'author_20_h_index', 'author_20_centrality'];
        
        // 突现词分析排名字段的特殊处理
        const burstRankingFields = ['burst_1_term', 'burst_1_strength', 'burst_1_start_year', 'burst_1_duration',
                                  'burst_2_term', 'burst_2_strength', 'burst_2_start_year', 'burst_2_duration',
                                  'burst_3_term', 'burst_3_strength', 'burst_3_start_year', 'burst_3_duration',
                                  'burst_4_term', 'burst_4_strength', 'burst_4_start_year', 'burst_4_duration',
                                  'burst_5_term', 'burst_5_strength', 'burst_5_start_year', 'burst_5_duration',
                                  'burst_6_term', 'burst_6_strength', 'burst_6_start_year', 'burst_6_duration',
                                  'burst_7_term', 'burst_7_strength', 'burst_7_start_year', 'burst_7_duration',
                                  'burst_8_term', 'burst_8_strength', 'burst_8_start_year', 'burst_8_duration',
                                  'burst_9_term', 'burst_9_strength', 'burst_9_start_year', 'burst_9_duration',
                                  'burst_10_term', 'burst_10_strength', 'burst_10_start_year', 'burst_10_duration'];
        
        // 关键词分析排名字段的特殊处理
        const keywordRankingFields = ['keyword_1_term', 'keyword_1_frequency', 'keyword_1_centrality', 'keyword_1_first_year',
                                    'keyword_2_term', 'keyword_2_frequency', 'keyword_2_centrality', 'keyword_2_first_year',
                                    'keyword_3_term', 'keyword_3_frequency', 'keyword_3_centrality', 'keyword_3_first_year',
                                    'keyword_4_term', 'keyword_4_frequency', 'keyword_4_centrality', 'keyword_4_first_year',
                                    'keyword_5_term', 'keyword_5_frequency', 'keyword_5_centrality', 'keyword_5_first_year',
                                    'keyword_6_term', 'keyword_6_frequency', 'keyword_6_centrality', 'keyword_6_first_year',
                                    'keyword_7_term', 'keyword_7_frequency', 'keyword_7_centrality', 'keyword_7_first_year',
                                    'keyword_8_term', 'keyword_8_frequency', 'keyword_8_centrality', 'keyword_8_first_year',
                                    'keyword_9_term', 'keyword_9_frequency', 'keyword_9_centrality', 'keyword_9_first_year',
                                    'keyword_10_term', 'keyword_10_frequency', 'keyword_10_centrality', 'keyword_10_first_year',
                                    'keyword_11_term', 'keyword_11_frequency', 'keyword_11_centrality', 'keyword_11_first_year',
                                    'keyword_12_term', 'keyword_12_frequency', 'keyword_12_centrality', 'keyword_12_first_year',
                                    'keyword_13_term', 'keyword_13_frequency', 'keyword_13_centrality', 'keyword_13_first_year',
                                    'keyword_14_term', 'keyword_14_frequency', 'keyword_14_centrality', 'keyword_14_first_year',
                                    'keyword_15_term', 'keyword_15_frequency', 'keyword_15_centrality', 'keyword_15_first_year',
                                    'keyword_16_term', 'keyword_16_frequency', 'keyword_16_centrality', 'keyword_16_first_year',
                                    'keyword_17_term', 'keyword_17_frequency', 'keyword_17_centrality', 'keyword_17_first_year',
                                    'keyword_18_term', 'keyword_18_frequency', 'keyword_18_centrality', 'keyword_18_first_year',
                                    'keyword_19_term', 'keyword_19_frequency', 'keyword_19_centrality', 'keyword_19_first_year',
                                    'keyword_20_term', 'keyword_20_frequency', 'keyword_20_centrality', 'keyword_20_first_year'];
        
        // 检查是否为国家/地区分布模块
        const isCountryDistributionModule = descriptor.title && descriptor.title.includes('国家/地区分布');
        
        // 检查是否为期刊分布模块
        const isJournalDistributionModule = descriptor.title && descriptor.title.includes('期刊分布');
        
        // 检查是否为机构分布模块
        const isInstitutionDistributionModule = descriptor.title && descriptor.title.includes('机构分布');
        
        // 检查是否为作者分析模块
        const isAuthorAnalysisModule = descriptor.title && descriptor.title.includes('作者分析');
        
        // 检查是否为突现词分析模块
        const isBurstAnalysisModule = descriptor.title && descriptor.title.includes('突现词分析');
        
        // 检查是否为关键词分析模块
        const isKeywordAnalysisModule = descriptor.title && descriptor.title.includes('关键词分析');
        
        if (isCountryDistributionModule) {
            console.log('检测到国家/地区分布模块，启用排名字段特殊处理');
            
            // 处理排名字段
            countryRankingFields.forEach(fieldId => {
                if (processedData[fieldId] !== undefined) {
                    console.log(`国家/地区分布字段匹配: ${fieldId} = ${processedData[fieldId]}`);
                }
            });
        }
        
        if (isJournalDistributionModule) {
            console.log('检测到期刊分布模块，启用排名字段特殊处理');
            
            // 处理排名字段
            journalRankingFields.forEach(fieldId => {
                if (processedData[fieldId] !== undefined) {
                    console.log(`期刊分布字段匹配: ${fieldId} = ${processedData[fieldId]}`);
                }
            });
        }
        
        if (isInstitutionDistributionModule) {
            console.log('检测到机构分布模块，启用排名字段特殊处理');
            
            // 处理排名字段
            institutionRankingFields.forEach(fieldId => {
                if (processedData[fieldId] !== undefined) {
                    console.log(`机构分布字段匹配: ${fieldId} = ${processedData[fieldId]}`);
                }
            });
        }
        
        if (isAuthorAnalysisModule) {
            console.log('检测到作者分析模块，启用排名字段特殊处理');
            
            // 处理排名字段
            authorRankingFields.forEach(fieldId => {
                if (processedData[fieldId] !== undefined) {
                    console.log(`作者分析字段匹配: ${fieldId} = ${processedData[fieldId]}`);
                }
            });
        }
        
        if (isBurstAnalysisModule) {
            console.log('检测到突现词分析模块，启用排名字段特殊处理');
            
            // 处理排名字段
            burstRankingFields.forEach(fieldId => {
                if (processedData[fieldId] !== undefined) {
                    console.log(`突现词分析字段匹配: ${fieldId} = ${processedData[fieldId]}`);
                }
            });
        }
        
        if (isKeywordAnalysisModule) {
            console.log('检测到关键词分析模块，启用排名字段特殊处理');
            
            // 处理排名字段
            keywordRankingFields.forEach(fieldId => {
                if (processedData[fieldId] !== undefined) {
                    console.log(`关键词分析字段匹配: ${fieldId} = ${processedData[fieldId]}`);
                }
            });
        }
        
        descriptor.fields.forEach(field => {
            const allKeys = Object.keys(processedData);
            let matched = false;
            
            // 1. 精确匹配（不区分大小写）
            const exactMatch = allKeys.find(key => 
                key.toLowerCase() === field.fieldId.toLowerCase()
            );
            
            if (exactMatch) {
                processedData[field.fieldId] = processedData[exactMatch];
                matched = true;
                console.log(`精确匹配字段: ${field.fieldId} = ${processedData[exactMatch]}`);
                return;
            }
            
            // 2. AI解析字段名直接映射匹配
            const directMapping = enhancedFieldMappings[field.fieldId];
            if (directMapping && directMapping.length > 0) {
                for (const aiFieldName of directMapping) {
                    const aiFieldMatch = allKeys.find(key => 
                        key.toLowerCase() === aiFieldName.toLowerCase()
                    );
                    
                    if (aiFieldMatch) {
                        let value = processedData[aiFieldMatch];
                        
                        // 数值字段的清理处理
                        if (field.type === 'number' || field.fieldId.includes('count') || field.fieldId.includes('rate')) {
                            value = cleanNumericValue(value);
                        }
                        
                        processedData[field.fieldId] = value;
                        matched = true;
                        console.log(`直接映射匹配字段: ${field.fieldId} = ${value} (来自 ${aiFieldMatch})`);
                        break;
                    }
                }
            }
            
            if (matched) return;
            
            // 3. 增强同义词匹配
            const synonyms = enhancedFieldMappings[field.fieldId] || [];
            for (const synonym of synonyms) {
                const synonymMatch = allKeys.find(key => {
                    const keyLower = key.toLowerCase().trim();
                    const synonymLower = synonym.toLowerCase();
                    
                    // 完全匹配
                    if (keyLower === synonymLower) return true;
                    
                    // 包含匹配
                    if (keyLower.includes(synonymLower)) return true;
                    
                    // 模糊匹配（编辑距离小于2）
                    if (isSimilarString(keyLower, synonymLower, 2)) return true;
                    
                    return false;
                });
                
                if (synonymMatch) {
                    let value = processedData[synonymMatch];
                    
                    // 数值字段的清理处理
                    if (field.type === 'number' || field.fieldId.includes('count') || field.fieldId.includes('rate')) {
                        value = cleanNumericValue(value);
                    }
                    
                    processedData[field.fieldId] = value;
                    matched = true;
                    console.log(`同义词匹配字段: ${field.fieldId} = ${value} (来自 ${synonymMatch})`);
                    break;
                }
            }
            
            if (matched) return;
            
            // 4. 智能部分匹配
            const fieldWords = field.fieldId.toLowerCase().split('_');
            const partialMatch = allKeys.find(key => {
                const keyLower = key.toLowerCase();
                
                // 检查核心词汇匹配度
                let matchScore = 0;
                fieldWords.forEach(word => {
                    if (keyLower.includes(word)) matchScore += 1;
                });
                
                // 至少匹配一半的核心词汇
                return matchScore >= Math.ceil(fieldWords.length / 2);
            });
            
            if (partialMatch) {
                let value = processedData[partialMatch];
                if (field.type === 'number') {
                    value = cleanNumericValue(value);
                }
                processedData[field.fieldId] = value;
                console.log(`部分匹配字段: ${field.fieldId} = ${value} (来自 ${partialMatch})`);
            }
        });
        validFields = descriptor.fields.filter(f => processedData[f.fieldId] !== undefined);
        console.log('智能模糊匹配后的有效字段:', validFields);
    }
    
    // 5. 数值字段的特殊处理
    if (validFields.length === 0) {
        // 检查是否有数值数据可以匹配到数值字段
        const numericFields = descriptor.fields.filter(f => 
            f.fieldId.includes('count') || f.fieldId.includes('total') || f.fieldId.includes('number')
        );
        
        const numericValues = Object.values(processedData).filter(v => 
            typeof v === 'number' || (typeof v === 'string' && !isNaN(v))
        );
        
        if (numericValues.length > 0 && numericFields.length > 0) {
            // 将最大的数值赋给total_papers字段
            const maxValue = Math.max(...numericValues.map(v => Number(v)));
            const totalField = numericFields.find(f => f.fieldId === 'total_papers');
            if (totalField) {
                processedData['total_papers'] = maxValue;
                validFields.push(totalField);
            }
        }
    }
    
    // 6. 如果仍然无匹配，显示原始数据供用户查看
    if (validFields.length === 0) {
        console.log('提取的原始数据:', processedData);
        
        // 创建一个简化版的显示，展示所有可用数据
        const allKeys = Object.keys(processedData);
        if (allKeys.length > 0) {
            let debugHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="color: #f39c12; font-size: 48px; margin-bottom: 10px;">⚠️</div>
                    <h4 style="color: #f39c12; margin-bottom: 10px;">数据格式不匹配</h4>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                        已提取到 ${allKeys.length} 个数据字段，但格式与页面字段不匹配
                    </p>
                    <div style="text-align: left; max-width: 500px; margin: 0 auto 20px;">
                        <h5>提取的数据:</h5>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                            <thead style="background: #f8f9fa;">
                                <tr>
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">字段名</th>
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">值</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            allKeys.forEach(key => {
                const value = processedData[key];
                debugHTML += `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><code>${key}</code></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${value}</td>
                    </tr>
                `;
            });
            
            debugHTML += `
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <h5>页面期望字段:</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;">
                            ${descriptor.fields.map(f => `<span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${f.fieldId}</span>`).join('')}
                        </div>
                    </div>
                    <button onclick="confirmTextCapture()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
                        重新采集
                    </button>
                    <button onclick="applyRawData('${JSON.stringify(processedData).replace(/'/g, "\\'")}');" style="padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        手动应用数据
                    </button>
                </div>
            `;
            
            resultsDiv.innerHTML = debugHTML;
            
            // 存储原始数据供手动应用
            const hiddenStore = document.createElement('div');
            hiddenStore.setAttribute('data-raw-data', JSON.stringify(processedData));
            hiddenStore.style.display = 'none';
            resultsDiv.appendChild(hiddenStore);
            
        } else {
            resultsDiv.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="color: #e74c3c; font-size: 48px; margin-bottom: 10px;">⚠️</div>
                    <h4 style="color: #e74c3c; margin-bottom: 10px;">未提取到有效数据</h4>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                        请检查输入内容是否包含相关数据，或尝试其他描述方式
                    </p>
                    <button onclick="confirmTextCapture()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        重新采集
                    </button>
                </div>
            `;
        }
        
        // 仍然显示结果容器，让用户能看到调试信息
        const statusContainer = document.getElementById('captureStatusContainer');
        if (statusContainer) {
            statusContainer.style.display = 'none';
        }
        
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.zIndex = '1000';
        
        return;
    }
    
    // 使用传入的descriptor参数，如果没有则使用当前激活的section
    let allFields = [];
    if (descriptor && descriptor.fields) {
        allFields = descriptor.fields;
    } else {
        // 如果没有传入descriptor，尝试获取当前激活的section
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            const sectionDescriptor = getSectionDescriptor(activeSection);
            allFields = sectionDescriptor.fields;
        } else {
            // 如果都没有，使用validFields作为后备
            allFields = validFields;
        }
    }
    
    // 构建结果表格 - 优化显示版本
    let tableHTML = `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="color: #0ea5e9; font-size: 18px; margin-right: 8px;">✓</div>
                <h4 style="margin: 0; color: #0f172a; font-weight:700; font-size: 16px;">识别结果预览</h4>
                <div style="margin-left: auto; background: #e0f2fe; padding: 3px 8px; border-radius: 8px; font-size: 11px; color: #0ea5e9; font-weight: 700;">
                    识别到 ${validFields.length}/${allFields.length} 个字段
                </div>
            </div>
            <div style="border: 1px solid #e6e9f2; border-radius: 8px; background: #ffffff; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead style="background: #0ea5e9; color: white;">
                        <tr>
                            <th style="padding: 8px 10px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 12px;">字段名称</th>
                            <th style="padding: 8px 10px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 12px;">识别值</th>
                            <th style="padding: 8px 10px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 12px;">状态</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // 显示所有字段，包括未采集到的字段
    allFields.forEach((field, index) => {
        const value = processedData[field.fieldId]; // 使用processedData而不是extractedData
        const isEven = index % 2 === 0;
        
        // 确定状态
        let statusText, statusColor, displayValue;
        if (value !== undefined && value !== null && value !== '') {
            statusText = '✅ 已识别';
            statusColor = '#27ae60';
            displayValue = value;
        } else {
            statusText = '❌ 未采集到数据';
            statusColor = '#e74c3c';
            displayValue = '未采集到数据';
        }
        
        tableHTML += `
            <tr style="background: ${isEven ? '#ffffff' : '#f8fff8'};">
                <td style="padding: 8px 10px; border-bottom: 1px solid #e8f5e8; font-weight: 600; color: #2c3e50; font-size: 12px;">${field.label || field.fieldId}</td>
                <td style="padding: 8px 10px; border-bottom: 1px solid #e8f5e8; font-weight: bold; color: ${statusColor}; word-break: break-word; font-size: 12px;">${displayValue}</td>
                <td style="padding: 8px 10px; border-bottom: 1px solid #e8f5e8; text-align: center; font-size: 11px; font-weight: 600; color: ${statusColor};">${statusText}</td>
            </tr>
        `;
    });
    
    tableHTML += `
                    </tbody>
                </table>
            </div>
        </div>
        <div style="text-align: center; padding: 15px 0; border-top: 1px solid #eee;">
            <div style="margin-bottom: 12px; padding: 8px; background: #f1f5f9; border-radius: 6px; border-left: 3px solid #0ea5e9;">
                <p style="margin: 0; color: #0f172a; font-size: 12px;">
                    <strong>📋 采集结果说明：</strong>系统已成功识别到 ${validFields.length} 个字段。
                </p>
            </div>
        </div>
    `;
    
    // 确保所有相关容器的状态正确
    const statusContainer = document.getElementById('captureStatusContainer');
    if (statusContainer) {
        statusContainer.style.display = 'none';
    }
    
    // 强制显示结果容器
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.zIndex = '1000';
    
    // 填充内容
    resultsDiv.innerHTML = tableHTML;
    
    // 调试信息：在控制台输出处理后的数据
    console.log('=== 字段匹配调试信息 ===');
    console.log('原始提取数据:', extractedData);
    console.log('处理后的数据 (processedData):', processedData);
    console.log('传入的descriptor:', descriptor);
    console.log('有效字段数量:', validFields.length);
    console.log('所有字段数量:', allFields.length);
    console.log('字段匹配详情:', validFields);
    console.log('所有期望字段:', allFields);
    console.log('字段匹配结果:');
    allFields.forEach(field => {
        const value = processedData[field.fieldId];
        console.log(`  ${field.fieldId}: ${value !== undefined ? '✅ ' + value : '❌ 未匹配'}`);
    });
    
    // 验证字段匹配
    if (descriptor) {
        validateFieldMatching(processedData, descriptor);
    }
    
    console.log('=== 调试信息结束 ===');
    
    // 在表格下方添加原始数据显示（仅用于调试）
    if (Object.keys(processedData).length > 0) {
        let debugHTML = `
            <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <details style="cursor: pointer;">
                    <summary style="font-weight: 600; color: #495057; font-size: 12px;">🔍 查看原始解析数据 (调试)</summary>
                    <div style="margin-top: 8px; font-size: 11px; color: #6c757d;">
                        <pre style="background: #ffffff; padding: 8px; border-radius: 4px; border: 1px solid #dee2e6; overflow-x: auto; white-space: pre-wrap;">${JSON.stringify(processedData, null, 2)}</pre>
                    </div>
                </details>
            </div>
        `;
        resultsDiv.innerHTML += debugHTML;
    }
    
    // 在容器内放置一个隐藏元素以存储数据，方便选择器读取
    const hiddenStore = document.createElement('div');
    hiddenStore.setAttribute('data-extracted-data', JSON.stringify(processedData)); // 使用processedData
    hiddenStore.style.display = 'none';
    resultsDiv.appendChild(hiddenStore);
    
    // 确保弹窗保持打开状态
    const overlay = document.getElementById('textCaptureOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
    
    // 保存结果数据供后续使用
    container.__captureResults = processedData;
    
    // 显示底部"应用结果"按钮
    const footerApplyBtn = document.getElementById('applyToFormBtn');
    if (footerApplyBtn) footerApplyBtn.style.display = 'inline-block';
    const confirmBtn = document.getElementById('confirmTextCaptureBtn');
    if (confirmBtn) confirmBtn.textContent = '重新采集';
    
    // 确保滚动到结果区域
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // 显示成功提示
    showToast(`成功识别到 ${validFields.length} 个字段的数据！`, 'success');
}

// 新增：手动应用原始数据的函数
window.applyRawData = function(rawDataStr) {
    try {
        const rawData = JSON.parse(rawDataStr);
        const descriptor = getCurrentDescriptor();
        
        // 创建映射关系
        const fieldMapping = {};
        descriptor.fields.forEach(field => {
            // 查找最匹配的字段
            const possibleKeys = Object.keys(rawData).filter(key => {
                const keyLower = key.toLowerCase();
                const fieldLower = field.fieldId.toLowerCase();
                return keyLower.includes(fieldLower) || fieldLower.includes(keyLower);
            });
            
            if (possibleKeys.length > 0) {
                fieldMapping[field.fieldId] = possibleKeys[0];
            }
        });
        
        // 应用映射的数据
        const mappedData = {};
        Object.keys(fieldMapping).forEach(targetField => {
            const sourceField = fieldMapping[targetField];
            mappedData[targetField] = rawData[sourceField];
        });
        
        // 调用应用函数
        applyCaptureResults(mappedData);
        
    } catch (error) {
        console.error('手动应用数据失败:', error);
        alert('应用数据失败，请重试');
    }
};

// 新增：获取当前描述符的函数（完全对应index.html实际字段）
function getCurrentDescriptor() {
    return {
        name: '数据检索基础信息',
        fields: [
            { fieldId: 'database_source', name: '数据库来源' },
            { fieldId: 'search_strategy', name: '检索策略/关键词' },
            { fieldId: 'time_range', name: '时间范围' },
            { fieldId: 'subject_scope', name: '学科范围' },
            { fieldId: 'initial_papers', name: '初检文献数' },
            { fieldId: 'final_papers', name: '最终有效文献数' },
            { fieldId: 'document_type_limit', name: '文献类型限制' },
            { fieldId: 'language_limit', name: '语言限制' },
            { fieldId: 'citespace_version', name: 'CiteSpace版本' },
            { fieldId: 'time_slice', name: '时间切片' },
            { fieldId: 'node_threshold', name: '节点阈值' },
            { fieldId: 'pruning_method', name: '网络剪枝方法' }
        ]
    };
}

// 使用ai-utils.js中定义的辅助函数

// 辅助函数：验证字段匹配
function validateFieldMatching(extractedData, descriptor) {
    console.log('=== 字段匹配验证 ===');
    console.log('提取的数据字段:', Object.keys(extractedData));
    console.log('期望的字段:', descriptor.fields.map(f => f.fieldId));
    
    const matches = [];
    const unmatched = [];
    
    descriptor.fields.forEach(field => {
        const value = extractedData[field.fieldId];
        if (value !== undefined && value !== null && value !== '') {
            matches.push({ field: field.fieldId, value: value });
        } else {
            unmatched.push(field.fieldId);
        }
    });
    
    console.log('匹配的字段:', matches);
    console.log('未匹配的字段:', unmatched);
    console.log('匹配率:', `${matches.length}/${descriptor.fields.length} (${Math.round(matches.length/descriptor.fields.length*100)}%)`);
    
    return { matches, unmatched, matchRate: matches.length/descriptor.fields.length };
}

// 测试函数：模拟AI返回的数据
window.testFieldMatching = function() {
    const testData = {
        "database_source": "CNKI, CSSCI",
        "search_strategy": "主题or关键词=*海洋*经济*or*海洋*产业*",
        "time_range": "1982~2013",
        "subject_scope": "海洋经济学",
        "initial_papers": 4262,
        "final_papers": 3441,
        "document_type_limit": "中文核心期刊和CSSCI来源期刊",
        "language_limit": "中文",
        "citespace_version": "3.8.R1",
        "time_slice": 1,
        "node_threshold": "2,2,20",
        "pruning_method": "Pathfinder"
    };
    
    const descriptor = getCurrentDescriptor();
    console.log('测试数据:', testData);
    console.log('期望字段:', descriptor);
    
    // 测试字段匹配
    const result = validateFieldMatching(testData, descriptor);
    
    // 显示结果
    displayCaptureResults(testData, descriptor, null, "测试文本");
    
    return result;
};

// 导出函数供其他模块使用
window.displayCaptureResults = displayCaptureResults;
window.validateFieldMatching = validateFieldMatching;