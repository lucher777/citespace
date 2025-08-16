// API配置管理模块
// 负责API设置的保存、加载和模型选项管理

/* ---------------- API 配置管理 ---------------- */
function autoSaveApiSettings() {
    const provider = document.getElementById('provider_select').value;
    const model = document.getElementById('model_select').value;
    
    // 更新config.js中的配置
    API_CONFIG.setProvider(provider);
    API_CONFIG.setModel(model);
    API_CONFIG.saveConfigToStorage();
    
    // 立即更新所有显示
    updateCurrentModelStatus();
    updateModelInfoDisplay();
    updateSaveButtonState();
    
    console.log('设置已自动保存:', { provider, model });
}

async function saveApiSettings() {
    // 由于设置已经自动保存，这里只进行连接测试
    showToast('正在测试当前模型连接...', 'success');
    
    // 测试连接
    if (typeof testApiConnection === 'function') {
        const ok = await testApiConnection(false);
        if (ok) {
            showToast('当前模型连接测试成功！', 'success');
        } else {
            showToast('连接测试失败，请检查配置', 'error');
        }
    }
}

function loadApiSettings() {
    // 从config.js加载配置
    API_CONFIG.loadConfigFromStorage();
    
    const provider = API_CONFIG.CURRENT_CONFIG.provider;
    const model = API_CONFIG.CURRENT_CONFIG.model;
    
    if (provider) {
        document.getElementById('provider_select').value = provider;
    }
    
    // 先更新模型选项，再设置选中的模型（初始化时跳过自动保存）
    updateModelOptions(true);
    
    if (model) {
        document.getElementById('model_select').value = model;
    }
    
    // 更新当前模型状态显示
    updateCurrentModelStatus();
    
    // 确保左上角模型信息显示正确
    setTimeout(() => {
        updateModelInfoDisplay();
    }, 100);
}

/* ---------------- 模型下拉列表管理 ---------------- */
function updateModelOptions(skipAutoSave = false) {
    const provider = document.getElementById('provider_select').value;
    const modelSelect = document.getElementById('model_select');
    
    // 使用config.js中的模型配置
    const providerModels = API_CONFIG.getProviderModels(provider);
    
    modelSelect.innerHTML = '';
    providerModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = model.displayName;
        modelSelect.appendChild(option);
    });
    
    // 恢复当前选择的模型；若无则默认选择该提供商的flash/默认模型
    const currentModel = API_CONFIG.CURRENT_CONFIG.model;
    if (currentModel && providerModels.some(m => m.name === currentModel)) {
        modelSelect.value = currentModel;
    } else if (provider === 'doubao') {
        const flash = providerModels.find(m => m.key === 'flash');
        if (flash) {
            modelSelect.value = flash.name;
            // 自动保存默认选择
            if (!skipAutoSave) {
                autoSaveApiSettings();
            }
        } else if (providerModels.length > 0) {
            // 如果没有找到flash模型，但有其他模型可用，则选择第一个
            modelSelect.value = providerModels[0].name;
            // 自动保存默认选择
            if (!skipAutoSave) {
                autoSaveApiSettings();
            }
        }
    }
    
    // 更新模型信息显示
    updateModelInfoDisplay();
    
    // 更新保存按钮状态
    updateSaveButtonState();
}

/* ---------------- API连接测试 ---------------- */
async function testApiConnection(silent = false) {
    console.log('testApiConnection函数被调用');
    // 使用config.js中的API配置
    const apiKey = API_CONFIG.getStoredApiKey();
    const provider = API_CONFIG.CURRENT_CONFIG.provider;
    
    console.log('当前提供商:', provider);
    console.log('API密钥:', apiKey ? '已找到' : '未找到');
    
    if (!apiKey) {
        if (!silent) showToast('未找到API密钥，请在config.js中配置', 'error');
        return false;
    }
    
    const testBtn = document.getElementById('testApiConnectionBtn');
    let originalText = '';
    if (!silent && testBtn) {
        originalText = testBtn.textContent;
        testBtn.textContent = '测试中...';
        testBtn.disabled = true;
    }
    
    try {
        const apiUrl = API_CONFIG.getApiUrl();
        const headers = API_CONFIG.getApiHeaders(apiKey);
        
        console.log('API URL:', apiUrl);
        console.log('请求头:', headers);
        
        let payload = {
            model: API_CONFIG.getCurrentModel(),
            messages: [
                { role: 'user', content: '你好' }
            ],
            max_tokens: 10,
            temperature: 0.1
        };
        
        console.log('请求载荷:', payload);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        
        console.log('响应状态:', response.status);
        console.log('响应对象:', response);
        
        if (response.ok) {
            const data = await response.json();
            if (!silent) showToast('API连接成功！', 'success');
            return true;
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('API错误响应:', errorData);
            if (!silent) showToast(`连接失败: ${response.status} ${errorData.error?.message || response.statusText}`, 'error');
            return false;
        }
    } catch (error) {
        console.error('API请求异常:', error);
        if (!silent) showToast(`连接失败: ${error.message}`, 'error');
        return false;
    } finally {
        if (!silent && testBtn) {
            testBtn.textContent = originalText;
            testBtn.disabled = false;
        }
    }
}

// 更新当前模型状态显示
function updateCurrentModelStatus() {
    // 由于移除了右侧状态显示，只更新左上角的模型信息显示
    updateModelInfoDisplay();
}

// 更新左上角模型信息显示
function updateModelInfoDisplay() {
    const currentModelInfo = document.getElementById('currentModelInfo');
    const modelDetails = document.getElementById('modelDetails');
    
    if (!currentModelInfo || !modelDetails) return;
    
    // 获取已保存的模型配置（确保显示的是实际使用的模型）
    const savedProvider = API_CONFIG.CURRENT_CONFIG.provider;
    const savedModel = API_CONFIG.CURRENT_CONFIG.model;
    
    const providerName = API_CONFIG.PROVIDER_CONFIG[savedProvider]?.name || savedProvider;
    const modelDisplayName = getModelDisplayNameForStatus(savedModel);
    
    // 获取模型类型信息
    const getModelType = (modelName) => {
        if (modelName.includes('vision') || modelName.includes('vl')) return '视觉模型';
        if (modelName.includes('32k')) return '大上下文模型';
        if (modelName.includes('pro')) return '专业模型';
        if (modelName.includes('lite')) return '轻量模型';
        if (modelName.includes('flash')) return '快速模型';
        return '标准模型';
    };
    
    const modelType = getModelType(savedModel);
    
    // 构建模型功能列表
    const features = [];
    if (savedModel.includes('vision') || savedModel.includes('vl')) {
        features.push('图片分析');
    }
    if (savedModel.includes('32k')) {
        features.push('32K上下文');
    }
    if (savedModel.includes('pro')) {
        features.push('专业版');
    }
    if (savedModel.includes('lite')) {
        features.push('轻量版');
    }
    if (savedModel.includes('flash')) {
        features.push('快速响应');
    }
    
    // 更新当前模型显示
    currentModelInfo.innerHTML = `
        <div>${providerName}</div>
        <div>${modelDisplayName} <span class="model-type-badge">${modelType}</span></div>
    `;
    
    // 更新详细信息
    modelDetails.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">提供商</span>
            <span class="detail-value">${providerName}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">模型名称</span>
            <span class="detail-value">${modelDisplayName}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">模型类型</span>
            <span class="detail-value">${modelType}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">技术名称</span>
            <span class="detail-value">${savedModel}</span>
        </div>
        ${features.length > 0 ? `
        <div class="model-features">
            ${features.map(feature => `<span class="feature">${feature}</span>`).join('')}
        </div>
        ` : ''}
    `;
}

// 获取模型显示名称（用于状态显示）
function getModelDisplayNameForStatus(modelName) {
    const displayNames = {
        // 豆包模型 - 使用更完整的显示名称
        'doubao-seed-1-6-flash-250715': '豆包 Flash',
        'kimi-k2-250711': 'Kimi K2',
        'doubao-seed-1-6-250615': '豆包 Seed-1-6',
        'doubao-1.5-vision-pro-250328': '豆包 1.5 Vision Pro',
        'doubao-1.5-vision-lite-250315': '豆包 1.5 Vision Lite',
        'doubao-1-5-vision-pro-32k-250115': '豆包 1-5 Vision Pro 32K',
        'doubao-1-5-ui-tars-250428': '豆包 1-5 UI Tars',
        'doubao-1-5-lite-32k-250115': '豆包 1-5 Lite 32K',
        'doubao-1-5-pro-32k-250115': '豆包 1-5 Pro 32K',
        
        // DeepSeek 模型
        'deepseek-chat': 'DeepSeek Chat',
        'deepseek-reasoner': 'DeepSeek Reasoner',
        'deepseek-vl': 'DeepSeek Vision',
        
        // OpenAI 模型
        'gpt-4': 'GPT-4',
        'gpt-4o': 'GPT-4o',
        'gpt-4o-mini': 'GPT-4o Mini',
        'gpt-4-vision-preview': 'GPT-4 Vision',
        'gpt-3.5-turbo': 'GPT-3.5'
    };
    
    return displayNames[modelName] || modelName;
}

// 全局模型显示名称获取函数（供其他模块使用）
window.getModelDisplayName = function(modelName) {
    return getModelDisplayNameForStatus(modelName);
};

// 检查是否有未保存的设置更改
function hasUnsavedChanges() {
    // 由于现在设置会自动保存，所以总是返回false
    return false;
}

// 更新保存按钮状态
function updateSaveButtonState() {
    const saveBtn = document.getElementById('saveApiSettingsBtn');
    if (saveBtn) {
        // 由于设置会自动保存，按钮现在主要用于测试连接
        saveBtn.textContent = '🔗 测试连接';
        saveBtn.style.background = '';
        saveBtn.style.color = '';
    }
}

// 导出函数供其他模块使用
window.autoSaveApiSettings = autoSaveApiSettings;
window.saveApiSettings = saveApiSettings;
window.loadApiSettings = loadApiSettings;
window.updateModelOptions = updateModelOptions;
window.testApiConnection = testApiConnection;
window.hasUnsavedChanges = hasUnsavedChanges;
window.updateSaveButtonState = updateSaveButtonState;
window.updateModelInfoDisplay = updateModelInfoDisplay;

// 添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 监听提供商选择变化
    const providerSelect = document.getElementById('provider_select');
    if (providerSelect) {
        providerSelect.addEventListener('change', function() {
            updateModelOptions();
            // 提供商变化时，模型会自动保存（在updateModelOptions中处理）
        });
    }
    
    // 监听模型选择变化
    const modelSelect = document.getElementById('model_select');
    if (modelSelect) {
        modelSelect.addEventListener('change', function() {
            // 立即保存新的模型设置
            autoSaveApiSettings();
            // 显示成功提示
            showToast('模型已自动保存并设置为当前使用模型', 'success');
        });
    }
});
// 测试全局模型选择功能
window.testGlobalModelSelection = function() {
    console.log('=== 全局模型选择测试 ===');
    
    // 1. 获取当前模型状态
    const modelStatus = API_CONFIG.getGlobalModelStatus();
    console.log('当前模型状态:', modelStatus);
    
    // 2. 验证模型选择
    const isValid = API_CONFIG.validateModelSelection();
    console.log('模型选择有效性:', isValid);
    
    // 3. 测试不同场景的模型获取
    const textModel = API_CONFIG.getCurrentModel(false);
    const visionModel = API_CONFIG.getCurrentModel(true);
    console.log('文本模型:', textModel);
    console.log('视觉模型:', visionModel);
    
    // 4. 显示结果
    const result = {
        currentProvider: modelStatus.providerName,
        currentModel: modelStatus.model,
        visionModel: modelStatus.visionModel,
        isValid: isValid,
        textModel: textModel,
        visionModel: visionModel,
        isVisionSupported: modelStatus.isVisionSupported
    };
    
    console.log('测试结果:', result);
    
    // 5. 更新状态显示
    updateCurrentModelStatus();
    
    return result;
};

window.updateCurrentModelStatus = updateCurrentModelStatus;

// 验证模型配置是否正确保存和加载
window.verifyModelConfiguration = function() {
    console.log('=== 模型配置验证 ===');
    
    // 获取当前选择的模型
    const selectedProvider = document.getElementById('provider_select')?.value;
    const selectedModel = document.getElementById('model_select')?.value;
    
    // 获取已保存的模型
    const savedProvider = API_CONFIG.CURRENT_CONFIG.provider;
    const savedModel = API_CONFIG.CURRENT_CONFIG.model;
    
    console.log('当前选择:', { provider: selectedProvider, model: selectedModel });
    console.log('已保存配置:', { provider: savedProvider, model: savedModel });
    
    // 验证是否一致
    const isConsistent = selectedProvider === savedProvider && selectedModel === savedModel;
    console.log('配置一致性:', isConsistent ? '✅ 一致' : '❌ 不一致');
    
    // 验证模型是否可用
    const providerModels = API_CONFIG.getProviderModels(savedProvider);
    const modelExists = providerModels.some(m => m.name === savedModel);
    console.log('模型可用性:', modelExists ? '✅ 可用' : '❌ 不可用');
    
    return {
        selected: { provider: selectedProvider, model: selectedModel },
        saved: { provider: savedProvider, model: savedModel },
        isConsistent: isConsistent,
        modelExists: modelExists
    };
};
