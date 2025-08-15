// 修复JSON片段的辅助函数
function fixJsonFragment(jsonStr) {
    let fixed = jsonStr.trim();

    // 1. 修复属性名缺少引号的问题
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

    // 2. 修复单引号为双引号
    fixed = fixed.replace(/'/g, '"');

    // 3. 修复末尾多余的逗号
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

    // 4. 修复转义字符问题
    fixed = fixed.replace(/\\(?!["\\/bfnrt])/g, '');
    
    // 5. 修复Unicode转义序列
    fixed = fixed.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });
    
    // 6. 检查括号平衡性并修复
    let openBraceCount = (fixed.match(/{/g) || []).length;
    let closeBraceCount = (fixed.match(/}/g) || []).length;
    let braceDiff = openBraceCount - closeBraceCount;

    if (braceDiff > 0) {
        // 添加缺少的闭合括号
        fixed += '}'.repeat(braceDiff);
        console.log('修复缺少的闭合括号');
    } else if (braceDiff < 0) {
        // 移除多余的闭合括号
        const chars = fixed.split('');
        let newChars = [];
        let currentDiff = 0;

        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            if (char === '{') {
                currentDiff++;
                newChars.push(char);
            } else if (char === '}') {
                if (currentDiff > 0) {
                    currentDiff--;
                    newChars.push(char);
                } else {
                    // 跳过多余的闭合括号
                    console.log('移除多余的闭合括号');
                }
            } else {
                newChars.push(char);
            }
        }

        fixed = newChars.join('');
    }

    return fixed;
}

// 从AI文本中稳健提取JSON
function parseJsonFromAi(text) {
    // 存储原始文本用于调试
    const originalText = text;
    
    // 1) 去掉markdown围栏
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
    
    // 2) 尝试直接解析
    try {
        const result = JSON.parse(cleaned);
        console.log('JSON解析成功 (直接解析)');
        return result;
    } catch (e) {
        console.log('直接解析失败:', e.message);
    }
    
    // 3) 贪婪匹配第一个平衡的大括号片段
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        const candidate = cleaned.slice(start, end + 1);
        try {
            const result = JSON.parse(candidate);
            console.log('JSON解析成功 (贪婪匹配)');
            return result;
        } catch (e) {
            console.log('贪婪匹配解析失败:', e.message);
        }
    }
    
    // 4) 回退：提取最外层JSON对象（简单栈解析）
    const stack = [];
    let begin = -1;
    for (let i = 0; i < cleaned.length; i++) {
        const ch = cleaned[i];
        if (ch === '{') {
            if (stack.length === 0) begin = i;
            stack.push('{');
        } else if (ch === '}') {
            stack.pop();
            if (stack.length === 0 && begin !== -1) {
                const frag = cleaned.slice(begin, i + 1);
                try {
                    const result = JSON.parse(frag);
                    console.log('JSON解析成功 (栈解析)');
                    return result;
                } catch (e) {
                    console.log('栈解析失败:', e.message);
                }
                begin = -1;
            }
        }
    }
    
    // 5) 最后尝试：修复常见JSON格式问题
    let fixed = cleaned;
    
    // 修复单引号为双引号（但保留字符串中的单引号）
    fixed = fixed.replace(/(?<!["'])'(?!["'])/g, '"');
    
    // 修复中文键名没有引号的情况
    fixed = fixed.replace(/([{,]\s*)([\u4e00-\u9fa5a-zA-Z_][\u4e00-\u9fa5a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
    
    // 修复数值键名
    fixed = fixed.replace(/([{,]\s*)(\d+(?:\.\d+)?)\s*:/g, '$1"$2":');
    
    // 修复末尾多余的逗号
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    fixed = fixed.replace(/,(\s*$)/gm, '');
    
    // 修复控制字符和特殊空格
    fixed = fixed.replace(/[\u0000-\u001F\u007F\u200B-\u200F\u2028-\u202F]/g, '');
    
    // 修复转义字符问题
    fixed = fixed.replace(/\\(?!["\\/bfnrtu])/g, '');
    
    // 修复中文引号
    fixed = fixed.replace(/[""]/g, '"');
    fixed = fixed.replace(/['']/g, '"');
    
    // 修复Unicode转义序列
    fixed = fixed.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        try {
            return String.fromCharCode(parseInt(hex, 16));
        } catch (e) {
            return match; // 如果解析失败，保留原样
        }
    });
    
    // 修复未转义的引号
    fixed = fixed.replace(/([^\\])"(?![:,}\]])/g, '$1\\"');
    
    try {
        const result = JSON.parse(fixed);
        console.log('JSON解析成功 (格式修复后)');
        return result;
    } catch (e) {
        console.log('格式修复后解析失败:', e.message);
        console.log('修复后的JSON:', fixed);
    }
    
    // 6) 如果还是失败，尝试提取所有可能的JSON片段并增强错误处理
    try {
        // 改进的正则表达式，支持更复杂的嵌套结构
        const jsonRegex = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/g;
        const jsonMatches = cleaned.match(jsonRegex);
        if (jsonMatches) {
            console.log('找到', jsonMatches.length, '个可能的JSON片段');
            for (const match of jsonMatches) {
                try {
                    const result = JSON.parse(match);
                    console.log('JSON解析成功 (片段提取)');
                    return result;
                } catch (e) {
                    console.log('片段解析失败:', e.message, '在:', match);
                    // 尝试修复该片段
                    const fixedMatch = fixJsonFragment(match);
                    try {
                        const result = JSON.parse(fixedMatch);
                        console.log('JSON解析成功 (修复后片段)');
                        return result;
                    } catch (e2) {
                        console.log('修复后片段解析失败:', e2.message);
                    }
                }
            }
        }
    } catch (regexError) {
        console.error('正则表达式执行错误:', regexError.message);
    }
    
    // 7) 最后尝试：从纯文本中提取关键信息并生成结构化数据
    console.log('尝试从纯文本中提取关键信息...');
    try {
        // 创建基础JSON结构
        const structuredData = {
            "type": "literature_review",
            "content": cleaned,
            "summary": {
                "total_papers": 0,
                "databases": [],
                "time_range": "",
                "key_findings": [],
                "metrics": {}
            },
            "metadata": {
                "extraction_method": "text_analysis",
                "original_format": "text",
                "confidence": 0.8
            }
        };
        
        // 提取数字和统计信息
        const patterns = {
            total_papers: /(?:共|总计|总数|检索出|找到)\s*(\d+(?:\s\d{3})*(?:,\d{3})*(?:\.\d+)?)\s*(?:篇|条|项|个|文献|论文)/gi,
            journal_papers: /(?:期刊|杂志|论文)\s*(\d+(?:\s\d{3})*(?:,\d{3})*(?:\.\d+)?)/gi,
            conference_papers: /(?:会议|会议论文)\s*(\d+(?:\s\d{3})*(?:,\d{3})*(?:\.\d+)?)/gi,
            thesis_papers: /(?:博硕士|学位|论文)\s*(\d+(?:\s\d{3})*(?:,\d{3})*(?:\.\d+)?)/gi,
            books: /(?:图书|书籍|专著)\s*(\d+(?:\s\d{3})*(?:,\d{3})*(?:\.\d+)?)/gi
        };
        
        Object.keys(patterns).forEach(key => {
            const matches = [...cleaned.matchAll(patterns[key])];
            if (matches.length > 0) {
                const value = parseInt(matches[0][1].replace(/,/g, ''));
                if (key === 'total_papers') {
                    structuredData.summary.total_papers = value;
                } else {
                    structuredData.summary.metrics[key] = value;
                }
            }
        });
        
        // 提取数据库信息
        const dbPatterns = {
            'CNKI': /CNKI|中国知网|知网/gi,
            'CSSCI': /CSSCI|中文社会科学引文索引/gi,
            '万方': /万方|Wanfang/gi,
            '维普': /维普|VIP|CQVIP/gi,
            '读秀': /读秀|Duxiu/gi,
            'Web of Science': /Web\s*of\s*Science|WoS/gi,
            'Scopus': /Scopus/gi,
            'PubMed': /PubMed/gi
        };
        
        Object.keys(dbPatterns).forEach(db => {
            if (dbPatterns[db].test(cleaned)) {
                structuredData.summary.databases.push(db);
            }
        });
        
        // 提取时间范围
        const yearPatterns = [
            /(\d{4})\s*[-–—]\s*(\d{4})/g,  // 2006-2015
            /(\d{4})\s*年\s*到\s*(\d{4})\s*年/g,  // 2006年到2015年
            /(\d{4})\s*至\s*(\d{4})/g,  // 2006至2015
            /(\d{4})\s*-\s*至今/g  // 2006-至今
        ];
        
        for (const pattern of yearPatterns) {
            const match = cleaned.match(pattern);
            if (match) {
                const years = [...cleaned.matchAll(pattern)];
                if (years.length > 0) {
                    const [start, end] = [parseInt(years[0][1]), parseInt(years[0][2] || new Date().getFullYear())];
                    structuredData.summary.time_range = `${start}-${end}`;
                    break;
                }
            }
        }
        
        // 如果没有找到时间范围，尝试提取单独的年份
        if (!structuredData.summary.time_range) {
            const yearMatches = cleaned.match(/\d{4}/g);
            if (yearMatches) {
                const years = yearMatches.map(y => parseInt(y)).filter(y => y >= 2000 && y <= 2024);
                if (years.length > 0) {
                    structuredData.summary.time_range = `${Math.min(...years)}-${Math.max(...years)}`;
                }
            }
        }
        
        // 提取关键指标
        const metricPatterns = {
            "h指数": /h指数[:：]\s*(\d+(?:\.\d+)?)/gi,
            "g指数": /g指数[:：]\s*(\d+(?:\.\d+)?)/gi,
            "平均被引": /平均被引频次?[:：]\s*(\d+(?:\.\d+)?)/gi,
            "自引率": /自引率[:：]\s*(\d+(?:\.\d+)?)/gi,
            "网络密度": /网络密度[:：]\s*(\d+(?:\.\d+)?)/gi,
            "聚类系数": /聚类系数[:：]\s*(\d+(?:\.\d+)?)/gi
        };
        
        Object.keys(metricPatterns).forEach(metric => {
            const matches = [...cleaned.matchAll(metricPatterns[metric])];
            if (matches.length > 0) {
                const value = parseFloat(matches[0][1]);
                structuredData.summary.metrics[metric] = value;
            }
        });
        
        // 提取关键词和主题
        const keywordPattern = /(?:关键词|主题词|主题)[:：]\s*([^\n]+)/gi;
        const keywordMatch = cleaned.match(keywordPattern);
        if (keywordMatch) {
            const keywords = keywordMatch[0].split(/[:：,，；;\s]+/).slice(1).filter(k => k.trim().length > 0);
            structuredData.summary.key_findings = keywords.slice(0, 5); // 取前5个
        }
        
        // 如果没有提取到任何数据，降低置信度
        if (structuredData.summary.total_papers === 0 && structuredData.summary.databases.length === 0) {
            structuredData.metadata.confidence = 0.3;
            structuredData.summary.total_papers = cleaned.length > 100 ? 1 : 0;
        }
        
        console.log('成功从纯文本生成结构化数据');
        console.log('提取结果:', structuredData);
        return structuredData;
    } catch (textExtractionError) {
        console.log('文本提取失败:', textExtractionError.message);
    }
    
    // 保存原始文本和清理后的文本到全局变量，便于调试
    window.__lastFailedJsonText = originalText;
    window.__lastFailedCleanedText = cleaned;
    window.__lastFailedFixedText = fixed;

    // 显示更详细的错误信息
    const errorMsg = '无法解析API返回的数据格式。请检查控制台获取更多调试信息。';
    console.error(errorMsg);
    console.error('原始文本:', originalText);
    console.error('清理后的文本:', cleaned);
    console.error('修复后的文本:', fixed);
    throw new Error(errorMsg);
}

// 导出函数供其他模块使用
// showToast函数在text-capture.js中定义
window.parseJsonFromAi = parseJsonFromAi;

// 添加调试工具函数
function debugLastFailedJson() {
    if (window.__lastFailedJsonText) {
        console.log('===== 上次JSON解析失败调试信息 =====');
        console.log('原始文本:', window.__lastFailedJsonText);
        console.log('清理后文本:', window.__lastFailedCleanedText);
        return {
            original: window.__lastFailedJsonText,
            cleaned: window.__lastFailedCleanedText
        };
    } else {
        console.log('没有找到上次JSON解析失败的记录');
        return null;
    }
}
window.debugLastFailedJson = debugLastFailedJson;

// 图片格式转换函数：将非JPG格式的图片转换为JPG格式
async function convertToJpeg(file) {
    // 如果已经是JPEG格式，直接返回原文件
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        return file;
    }
    
    // 创建一个Promise来处理图片转换
    return new Promise((resolve, reject) => {
        // 创建一个FileReader来读取文件
        const reader = new FileReader();
        
        // 当文件读取完成后
        reader.onload = function(event) {
            // 创建一个img元素
            const img = new Image();
            
            // 当图片加载完成后
            img.onload = function() {
                // 创建一个canvas元素
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 设置canvas的尺寸与图片一致
                canvas.width = img.width;
                canvas.height = img.height;
                
                // 在canvas上绘制图片
                ctx.drawImage(img, 0, 0);
                
                // 将canvas内容转换为JPEG格式的Blob
                canvas.toBlob(function(blob) {
                    // 创建一个新的File对象，类型为image/jpeg
                    const jpegFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    
                    // 返回转换后的JPEG文件
                    resolve(jpegFile);
                }, 'image/jpeg', 0.95); // 0.95是JPEG质量，可以在0-1之间调整
            };
            
            // 如果图片加载失败
            img.onerror = function() {
                reject(new Error('图片加载失败'));
            };
            
            // 设置图片源
            img.src = event.target.result;
        };
        
        // 如果文件读取失败
        reader.onerror = function() {
            reject(new Error('文件读取失败'));
        };
        
        // 读取文件为DataURL
        reader.readAsDataURL(file);
    });
}

// 导出图片转换函数
window.convertToJpeg = convertToJpeg;
