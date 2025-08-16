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
        fields: ['total_countries', 'international_collaboration_papers', 'international_collaboration_ratio', 'country_1_name', 'country_1_papers', 'country_1_ratio', 'country_1_centrality', 'country_2_name', 'country_2_papers', 'country_2_ratio', 'country_2_centrality', 'country_3_name', 'country_3_papers', 'country_3_ratio', 'country_3_centrality', 'country_4_name', 'country_4_papers', 'country_4_ratio', 'country_4_centrality', 'country_5_name', 'country_5_papers', 'country_5_ratio', 'country_5_centrality']
    },
    'journal-distribution': {
        name: '期刊分布',
        description: '分析文献的期刊分布和发表质量',
        fields: ['total_journals', 'core_journals_count', 'q1_journals_papers', 'high_if_journals_count', 'journal_1_name', 'journal_1_papers', 'journal_1_ratio', 'journal_1_impact_factor', 'journal_2_name', 'journal_2_papers', 'journal_2_ratio', 'journal_2_impact_factor', 'journal_3_name', 'journal_3_papers', 'journal_3_ratio', 'journal_3_impact_factor', 'journal_4_name', 'journal_4_papers', 'journal_4_ratio', 'journal_4_impact_factor', 'journal_5_name', 'journal_5_papers', 'journal_5_ratio', 'journal_5_impact_factor']
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
        fields: ['total_burst_terms', 'current_burst_terms', 'burst_1_term', 'burst_1_strength', 'burst_1_start_year', 'burst_1_duration', 'burst_2_term', 'burst_2_strength', 'burst_2_start_year', 'burst_2_duration', 'burst_3_term', 'burst_3_strength', 'burst_3_start_year', 'burst_3_duration', 'burst_4_term', 'burst_4_strength', 'burst_4_start_year', 'burst_4_duration', 'burst_5_term', 'burst_5_strength', 'burst_5_start_year', 'burst_5_duration']
    },
    'cluster-analysis': {
        name: '聚类分析',
        description: '分析研究主题的聚类结构',
        fields: ['cluster_count', 'cluster_labels', 'cluster_sizes', 'cluster_silhouette', 'cluster_themes', 'cluster_evolution', 'cluster_connections', 'cluster_importance']
    },
    'keyword-analysis': {
        name: '关键词分析',
        description: '分析关键词的分布和重要性',
        fields: ['top_keywords', 'keyword_frequency', 'keyword_centrality', 'keyword_clusters', 'keyword_evolution', 'keyword_connections', 'keyword_impact', 'keyword_trends']
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
