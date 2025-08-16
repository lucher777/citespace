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
        '成熟期时间段': 'maturity_period',
        '成熟期': 'maturity_period',
        '成熟期年均发文量': 'maturity_papers',
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
            'maturity_period': ['成熟期时间段', '成熟期', '稳定阶段', 'maturity period', 'stable period'],
            'maturity_papers': ['成熟期年均发文量', '成熟期发文量', 'maturity papers'],
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