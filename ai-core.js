// AI分析核心模块
// 负责AI模型调用和基础分析功能

// 根据descriptor获取模块名称的函数
function getModuleNameFromDescriptor(descriptor) {
    const title = descriptor.title || '';
    
    // 模块名称映射表
    const moduleMapping = {
        '数据检索基础信息': 'data-retrieval',
        '年发文量趋势分析': 'temporal-evolution',
        '国家/地区分布': 'country-distribution',
        '期刊分布': 'journal-distribution',
        '机构分布': 'institution-distribution',
        '作者分析': 'author-analysis',
        '突现词分析': 'burst-analysis',
        '聚类分析': 'cluster-analysis',
        '关键词分析': 'keyword-analysis',
        '时间演化分析': 'time-evolution',
        '核心引文': 'core-citations',
        '网络拓扑特征': 'network-topology',
        '引用模式分析': 'citation-pattern',
        '数据质量与可靠性': 'data-quality'
    };
    
    // 根据标题匹配模块
    for (const [chineseName, moduleName] of Object.entries(moduleMapping)) {
        if (title.includes(chineseName)) {
            return moduleName;
        }
    }
    
    // 如果没有匹配到，返回默认模块
    return 'data-retrieval';
}

async function analyzeSectionInModal(textInput, imageFile, descriptor, targetSection) {
    const startTime = Date.now();
    
    // 使用config.js中的API配置
    if (typeof API_CONFIG === 'undefined') {
        throw new Error('API_CONFIG 未定义，请检查 config.js 是否正确加载');
    }
    
    const apiKey = API_CONFIG.getStoredApiKey();
    
    if (!apiKey) {
        throw new Error('请在config.js中配置API密钥');
    }
    
    console.log('=== API配置检查 ===');
    console.log('API_CONFIG 状态:', typeof API_CONFIG);
    console.log('当前提供商:', API_CONFIG.CURRENT_CONFIG.provider);
    console.log('API密钥状态:', apiKey ? '已配置' : '未配置');
    console.log('==================');
    
    const container = document.getElementById('captureResultsContainer');
    
    // 获取当前选择的模型
    const currentModel = API_CONFIG.getCurrentModel(imageFile ? true : false);
    const currentProvider = API_CONFIG.CURRENT_CONFIG.provider;
    const modelInfo = API_CONFIG.getCurrentModelInfo();
    
    // 调试信息：显示当前使用的模型
    console.log('=== AI分析模型信息 ===');
    console.log('当前提供商:', modelInfo.providerName);
    console.log('当前模型:', currentModel);
    console.log('是否使用视觉模型:', !!imageFile);
    console.log('视觉模型支持:', modelInfo.isVisionSupported);
    console.log('=====================');
    
    // 更新状态：检查配置
    updateCaptureStatus('⚙️', '检查配置', `正在验证 ${currentProvider} 模型配置...`, true, 10);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 更新状态：准备提示词
    updateCaptureStatus('📝', '准备分析', `正在构建分析提示词，目标区域：${descriptor.title}...`, true, 20);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 构建系统提示词
    const fieldsList = descriptor.fields.map(f => `- fieldId=${f.fieldId} | label=${f.label} | type=${f.type} | placeholder=${f.placeholder} | name=${f.name} | id=${f.idAttr}`).join('\n');
    
    // 根据模块名称获取对应的prompt
    let modulePrompt = CITESPACE_ANALYSIS_PROMPT; // 默认使用数据检索的prompt
    
    // 尝试根据模块名称获取对应的prompt
    if (typeof getModulePrompt === 'function') {
        const moduleName = getModuleNameFromDescriptor(descriptor);
        console.log('=== 模块映射调试 ===');
        console.log('描述符标题:', descriptor.title);
        console.log('映射的模块名称:', moduleName);
        
        const specificPrompt = getModulePrompt(moduleName);
        if (specificPrompt) {
            modulePrompt = specificPrompt;
            console.log(`✓ 使用模块 "${moduleName}" 的专用prompt`);
        } else {
            console.log(`✗ 未找到模块 "${moduleName}" 的专用prompt，使用默认prompt`);
        }
        console.log('==================');
    } else {
        console.log('✗ getModulePrompt 函数不可用');
    }
    
    const systemPrompt = modulePrompt
        .replace('{descriptorTitle}', descriptor.title)
        .replace('{fieldsList}', fieldsList);
    
    const messages = [{ role: 'system', content: systemPrompt }];
    
    if (textInput) {
        messages.push({ role: 'user', content: textInput });
    }
    
    let payload = {
        model: currentModel,
        messages: messages,
        temperature: 0.1,
        max_tokens: 1500
    };
    
    // 处理图片
    if (imageFile) {
        // 更新状态：处理图片
        updateCaptureStatus('🖼️', '处理图片', `正在处理图片文件：${imageFile.name}...`, true, 30);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 更新状态：转换图片格式
        updateCaptureStatus('🔄', '转换格式', '正在将图片转换为AI模型可识别的格式...', true, 35);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        let imageContent;
        
        // 根据提供商调整图片处理格式
        if (currentProvider === 'doubao') {
            // 豆包API格式：使用image_url对象格式
            const base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result.split(',')[1]);
                reader.readAsDataURL(imageFile);
            });
            
            imageContent = {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`
                        }
                    },
                    {
                        type: 'text',
                        text: textInput || '请分析这张图片中的数据，提取出表格、图表或文字中的相关信息'
                    }
                ]
            };
        } else if (currentProvider === 'deepseek') {
            // DeepSeek格式：使用标准格式，image_url在前，text在后
            const base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result.split(',')[1]);
                reader.readAsDataURL(imageFile);
            });
            
            imageContent = {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`
                        }
                    },
                    {
                        type: 'text',
                        text: textInput || '请分析这张图片中的数据，提取出表格、图表或文字中的相关信息'
                    }
                ]
            };
        } else {
            // 默认格式：使用标准格式，image_url在前，text在后
            const base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result.split(',')[1]);
                reader.readAsDataURL(imageFile);
            });
            
            imageContent = {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`
                        }
                    },
                    {
                        type: 'text',
                        text: textInput || '请分析这张图片中的数据，提取出表格、图表或文字中的相关信息'
                    }
                ]
            };
        }
        
        // 替换或添加用户消息
        if (messages.length > 1 && messages[1].role === 'user') {
            messages[1] = imageContent;
        } else {
            messages.push(imageContent);
        }
    }
    
    // 更新状态：调用AI模型
    updateCaptureStatus('🤖', 'AI分析中', `正在使用 ${currentModel} 模型分析内容...`, true, 45);
    
    // 模拟AI分析过程的进度更新
    for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateCaptureStatus('🤖', 'AI分析中', `正在使用 ${currentModel} 模型分析内容... (${i+1}/10)`, true, 45 + i*2);
    }
    
    // 调用API
    const apiUrl = API_CONFIG.getApiUrl();
    const headers = API_CONFIG.getApiHeaders(apiKey);
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API返回的数据格式不正确');
    }
    
    const resultText = data.choices[0].message.content;
    // 存储原始返回文本，便于失败时排查
    window.__lastAiRawResult = typeof resultText === 'string' ? resultText : JSON.stringify(resultText);
    
    // 更新状态：解析结果
    updateCaptureStatus('🔍', '解析结果', '正在解析AI返回的数据...', true, 70);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 更新状态：提取字段
    updateCaptureStatus('🧩', '提取字段', '正在从返回数据中提取字段信息...', true, 75);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 解析JSON结果（更健壮的解析器）
        let extractedData;
        try {
            extractedData = parseJsonFromAi(resultText);
        } catch (e) {
            // 如果第一轮解析失败，尝试移除控制字符、BOM等再解析
            const sanitized = resultText
                .replace(/\u0000/g, '')
                .replace(/\ufeff/gi, '')
                .replace(/[\u0001-\u001F\u007F]/g, '');
            try {
                extractedData = parseJsonFromAi(sanitized);
            } catch (e2) {
                // 如果所有解析都失败，显示错误信息
                throw new Error(`解析失败: ${e2.message}\nAI返回内容: ${resultText.substring(0, 200)}...`);
            }
        }
        
        // 打印解析完成的JSON数据到控制台
        console.log('采集解析完成的JSON数据:', JSON.stringify(extractedData, null, 2));
    
    // 更新状态：完成
    updateCaptureStatus('✅', '采集完成', `成功识别到 ${Object.keys(extractedData).length} 个字段的数据！`, true, 90);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 最终状态
    updateCaptureStatus('🎉', '分析完成', `分析完成，共识别到 ${Object.keys(extractedData).length} 个字段！`, true, 100);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 确保状态容器被隐藏
    document.getElementById('captureStatusContainer').style.display = 'none';
    
    // 确保结果显示容器可见
    document.getElementById('captureResultsContainer').style.display = 'block';
    
    // 显示结果（保持弹窗打开）
    displayCaptureResults(extractedData, descriptor, targetSection, textInput);
    
    // 返回结果对象供调用者使用
    return {
        extractedData: extractedData,
        textLength: textInput ? textInput.length : 0,
        imageCount: imageFile ? 1 : 0,
        processTime: Date.now() - startTime,
        extractedText: textInput,
        extractedImages: imageFile ? [{ name: imageFile.name, data: await fileToDataUrl(imageFile) }] : []
    };
}

// 辅助函数：将文件转换为Data URL
async function fileToDataUrl(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// 导出函数供其他模块使用
window.analyzeSectionInModal = analyzeSectionInModal;