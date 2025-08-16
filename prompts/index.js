// CiteSpace数据采集系统 - Prompts主索引文件
// 统一管理所有模块的提示词

// 模块映射表 - 用于根据模块名称获取对应的prompt
const PROMPT_MAPPING = {
    // 数据检索基础信息
    'data-retrieval': 'CITESPACE_ANALYSIS_PROMPT',
    
    // 年发文量趋势分析
    'temporal-evolution': 'PUBLICATION_EVOLUTION_PROMPT',
    
    // 国家/地区分布
    'country-distribution': 'COUNTRY_DISTRIBUTION_PROMPT',
    
    // 期刊分布
    'journal-distribution': 'JOURNAL_DISTRIBUTION_PROMPT',
    
    // 机构分布
    'institution-distribution': 'INSTITUTION_DISTRIBUTION_PROMPT',
    
    // 作者分析
    'author-analysis': 'AUTHOR_ANALYSIS_PROMPT',
    
    // 突现词分析
    'burst-analysis': 'BURST_ANALYSIS_PROMPT',
    
    // 聚类分析
    'cluster-analysis': 'CLUSTER_ANALYSIS_PROMPT',
    
    // 关键词分析
    'keyword-analysis': 'KEYWORD_ANALYSIS_PROMPT',
    
    // 时间演化分析（用于其他时间相关分析）
    'time-evolution': 'TEMPORAL_EVOLUTION_PROMPT',
    
    // 核心引文
    'core-citations': 'CORE_CITATIONS_PROMPT',
    
    // 网络拓扑特征
    'network-topology': 'NETWORK_TOPOLOGY_PROMPT',
    
    // 引用模式分析
    'citation-pattern': 'CITATION_PATTERN_PROMPT',
    
    // 数据质量与可靠性
    'data-quality': 'DATA_QUALITY_PROMPT'
};

// 获取指定模块的prompt函数
function getModulePrompt(moduleName) {
    const promptName = PROMPT_MAPPING[moduleName];
    if (promptName && window[promptName]) {
        return window[promptName];
    }
    console.warn(`未找到模块 "${moduleName}" 的prompt`);
    return null;
}

// 获取所有可用的模块列表
function getAvailableModules() {
    return Object.keys(PROMPT_MAPPING);
}

// 获取所有prompts的映射表
function getAllPrompts() {
    const prompts = {};
    for (const [moduleName, promptName] of Object.entries(PROMPT_MAPPING)) {
        if (window[promptName]) {
            prompts[moduleName] = window[promptName];
        }
    }
    return prompts;
}

// 导出到全局作用域
window.PROMPT_MAPPING = PROMPT_MAPPING;
window.getModulePrompt = getModulePrompt;
window.getAvailableModules = getAvailableModules;
window.getAllPrompts = getAllPrompts;

// 模块信息表
const MODULE_INFO = {
    'data-retrieval': {
        name: '数据检索基础信息',
        description: '提取文献检索的基本参数和设置信息',
        fields: ['database_source', 'search_strategy', 'time_range', 'subject_scope', 'initial_papers', 'final_papers', 'document_type_limit', 'language_limit', 'citespace_version', 'time_slice', 'node_threshold', 'pruning_method']
    },
    'publication-trend': {
        name: '年发文量趋势分析',
        description: '分析文献发表的时间趋势和变化模式',
        fields: ['total_publications', 'time_span', 'peak_year', 'peak_publications', 'growth_rate', 'trend_description', 'development_stages', 'key_events']
    },
    'country-distribution': {
        name: '国家/地区分布',
        description: '分析文献的地理分布和国际合作情况',
        fields: ['total_countries', 'international_collaboration_papers', 'international_collaboration_ratio', 'country_1_name', 'country_1_papers', 'country_1_ratio', 'country_1_centrality', 'country_2_name', 'country_2_papers', 'country_2_ratio', 'country_2_centrality', 'country_3_name', 'country_3_papers', 'country_3_ratio', 'country_3_centrality', 'country_4_name', 'country_4_papers', 'country_4_ratio', 'country_4_centrality', 'country_5_name', 'country_5_papers', 'country_5_ratio', 'country_5_centrality', 'country_6_name', 'country_6_papers', 'country_6_ratio', 'country_6_centrality', 'country_7_name', 'country_7_papers', 'country_7_ratio', 'country_7_centrality', 'country_8_name', 'country_8_papers', 'country_8_ratio', 'country_8_centrality', 'country_9_name', 'country_9_papers', 'country_9_ratio', 'country_9_centrality', 'country_10_name', 'country_10_papers', 'country_10_ratio', 'country_10_centrality', 'country_11_name', 'country_11_papers', 'country_11_ratio', 'country_11_centrality', 'country_12_name', 'country_12_papers', 'country_12_ratio', 'country_12_centrality', 'country_13_name', 'country_13_papers', 'country_13_ratio', 'country_13_centrality', 'country_14_name', 'country_14_papers', 'country_14_ratio', 'country_14_centrality', 'country_15_name', 'country_15_papers', 'country_15_ratio', 'country_15_centrality', 'country_16_name', 'country_16_papers', 'country_16_ratio', 'country_16_centrality', 'country_17_name', 'country_17_papers', 'country_17_ratio', 'country_17_centrality', 'country_18_name', 'country_18_papers', 'country_18_ratio', 'country_18_centrality', 'country_19_name', 'country_19_papers', 'country_19_ratio', 'country_19_centrality', 'country_20_name', 'country_20_papers', 'country_20_ratio', 'country_20_centrality']
    },
    'journal-distribution': {
        name: '期刊分布',
        description: '分析文献的期刊分布和发表质量',
        fields: ['total_journals', 'core_journals_count', 'q1_journals_papers', 'high_if_journals_count', 'journal_1_name', 'journal_1_papers', 'journal_1_ratio', 'journal_1_impact_factor', 'journal_2_name', 'journal_2_papers', 'journal_2_ratio', 'journal_2_impact_factor', 'journal_3_name', 'journal_3_papers', 'journal_3_ratio', 'journal_3_impact_factor', 'journal_4_name', 'journal_4_papers', 'journal_4_ratio', 'journal_4_impact_factor', 'journal_5_name', 'journal_5_papers', 'journal_5_ratio', 'journal_5_impact_factor', 'journal_6_name', 'journal_6_papers', 'journal_6_ratio', 'journal_6_impact_factor', 'journal_7_name', 'journal_7_papers', 'journal_7_ratio', 'journal_7_impact_factor', 'journal_8_name', 'journal_8_papers', 'journal_8_ratio', 'journal_8_impact_factor', 'journal_9_name', 'journal_9_papers', 'journal_9_ratio', 'journal_9_impact_factor', 'journal_10_name', 'journal_10_papers', 'journal_10_ratio', 'journal_10_impact_factor', 'journal_11_name', 'journal_11_papers', 'journal_11_ratio', 'journal_11_impact_factor', 'journal_12_name', 'journal_12_papers', 'journal_12_ratio', 'journal_12_impact_factor', 'journal_13_name', 'journal_13_papers', 'journal_13_ratio', 'journal_13_impact_factor', 'journal_14_name', 'journal_14_papers', 'journal_14_ratio', 'journal_14_impact_factor', 'journal_15_name', 'journal_15_papers', 'journal_15_ratio', 'journal_15_impact_factor', 'journal_16_name', 'journal_16_papers', 'journal_16_ratio', 'journal_16_impact_factor', 'journal_17_name', 'journal_17_papers', 'journal_17_ratio', 'journal_17_impact_factor', 'journal_18_name', 'journal_18_papers', 'journal_18_ratio', 'journal_18_impact_factor', 'journal_19_name', 'journal_19_papers', 'journal_19_ratio', 'journal_19_impact_factor', 'journal_20_name', 'journal_20_papers', 'journal_20_ratio', 'journal_20_impact_factor']
    },
    'institution-distribution': {
        name: '机构分布',
        description: '分析研究机构的分布和合作网络',
        fields: ['top_institutions', 'institution_publications', 'institution_types', 'international_institutions', 'collaboration_networks', 'research_centers', 'institution_ranking', 'funding_organizations']
    },
    'author-analysis': {
        name: '作者分析',
        description: '分析作者的贡献和合作网络',
        fields: ['top_authors', 'author_publications', 'h_index_authors', 'author_collaboration', 'core_authors', 'author_citations', 'author_networks', 'emerging_authors']
    },
    'burst-analysis': {
        name: '突现词分析',
        description: '识别和分析突现性关键词',
        fields: ['total_burst_terms', 'current_burst_terms', 'burst_1_term', 'burst_1_strength', 'burst_1_start_year', 'burst_1_duration', 'burst_2_term', 'burst_2_strength', 'burst_2_start_year', 'burst_2_duration', 'burst_3_term', 'burst_3_strength', 'burst_3_start_year', 'burst_3_duration', 'burst_4_term', 'burst_4_strength', 'burst_4_start_year', 'burst_4_duration', 'burst_5_term', 'burst_5_strength', 'burst_5_start_year', 'burst_5_duration', 'burst_6_term', 'burst_6_strength', 'burst_6_start_year', 'burst_6_duration', 'burst_7_term', 'burst_7_strength', 'burst_7_start_year', 'burst_7_duration', 'burst_8_term', 'burst_8_strength', 'burst_8_start_year', 'burst_8_duration', 'burst_9_term', 'burst_9_strength', 'burst_9_start_year', 'burst_9_duration', 'burst_10_term', 'burst_10_strength', 'burst_10_start_year', 'burst_10_duration']
    },
    'cluster-analysis': {
        name: '聚类分析',
        description: '分析研究主题的聚类结构',
        fields: ['cluster_count', 'cluster_labels', 'cluster_sizes', 'cluster_silhouette', 'cluster_themes', 'cluster_evolution', 'cluster_connections', 'cluster_importance']
    },
    'keyword-analysis': {
        name: '关键词分析',
        description: '分析关键词的分布和重要性',
        fields: ['total_keywords', 'high_frequency_keywords', 'keyword_1_term', 'keyword_1_frequency', 'keyword_1_centrality', 'keyword_1_first_year', 'keyword_2_term', 'keyword_2_frequency', 'keyword_2_centrality', 'keyword_2_first_year', 'keyword_3_term', 'keyword_3_frequency', 'keyword_3_centrality', 'keyword_3_first_year', 'keyword_4_term', 'keyword_4_frequency', 'keyword_4_centrality', 'keyword_4_first_year', 'keyword_5_term', 'keyword_5_frequency', 'keyword_5_centrality', 'keyword_5_first_year', 'keyword_6_term', 'keyword_6_frequency', 'keyword_6_centrality', 'keyword_6_first_year', 'keyword_7_term', 'keyword_7_frequency', 'keyword_7_centrality', 'keyword_7_first_year', 'keyword_8_term', 'keyword_8_frequency', 'keyword_8_centrality', 'keyword_8_first_year', 'keyword_9_term', 'keyword_9_frequency', 'keyword_9_centrality', 'keyword_9_first_year', 'keyword_10_term', 'keyword_10_frequency', 'keyword_10_centrality', 'keyword_10_first_year', 'keyword_11_term', 'keyword_11_frequency', 'keyword_11_centrality', 'keyword_11_first_year', 'keyword_12_term', 'keyword_12_frequency', 'keyword_12_centrality', 'keyword_12_first_year', 'keyword_13_term', 'keyword_13_frequency', 'keyword_13_centrality', 'keyword_13_first_year', 'keyword_14_term', 'keyword_14_frequency', 'keyword_14_centrality', 'keyword_14_first_year', 'keyword_15_term', 'keyword_15_frequency', 'keyword_15_centrality', 'keyword_15_first_year', 'keyword_16_term', 'keyword_16_frequency', 'keyword_16_centrality', 'keyword_16_first_year', 'keyword_17_term', 'keyword_17_frequency', 'keyword_17_centrality', 'keyword_17_first_year', 'keyword_18_term', 'keyword_18_frequency', 'keyword_18_centrality', 'keyword_18_first_year', 'keyword_19_term', 'keyword_19_frequency', 'keyword_19_centrality', 'keyword_19_first_year', 'keyword_20_term', 'keyword_20_frequency', 'keyword_20_centrality', 'keyword_20_first_year']
    },
    'temporal-evolution': {
        name: '年发文量趋势分析',
        description: '分析文献发表的时间趋势和变化模式',
        fields: ['startup_period', 'startup_papers', 'growth_period', 'growth_papers', 'burst_period', 'burst_papers', 'peak_year', 'peak_papers', 'trough_year', 'trough_papers', 'overall_growth_rate', 'recent_5yr_growth_rate']
    },
    'core-citations': {
        name: '核心引文',
        description: '识别和分析核心引用文献',
        fields: ['core_papers', 'citation_frequency', 'high_cited_papers', 'citation_networks', 'citation_impact', 'citation_trends', 'citation_clusters', 'citation_evolution']
    },
    'network-topology': {
        name: '网络拓扑特征',
        description: '分析知识网络的拓扑结构特征',
        fields: ['network_nodes', 'network_edges', 'network_density', 'network_clustering', 'network_centrality', 'network_modularity', 'network_diameter', 'network_efficiency']
    },
    'citation-pattern': {
        name: '引用模式分析',
        description: '分析文献引用的模式和特征',
        fields: ['citation_patterns', 'citation_frequency', 'citation_networks', 'citation_clusters', 'citation_evolution', 'citation_impact', 'citation_trends', 'citation_quality']
    },
    'data-quality': {
        name: '数据质量与可靠性',
        description: '评估数据质量和可靠性指标',
        fields: ['data_completeness', 'data_accuracy', 'data_consistency', 'data_reliability', 'data_validity', 'data_quality_issues', 'data_cleaning', 'data_validation']
    }
};

// 导出模块信息
window.MODULE_INFO = MODULE_INFO;

console.log('CiteSpace Prompts 模块已加载完成');
console.log('可用模块:', getAvailableModules());
