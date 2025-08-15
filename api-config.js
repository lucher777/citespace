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
    
    // 更新当前模型状态显示
    updateCurrentModelStatus();
    
    console.log('设置已保存:', { provider, model });
}

async function saveApiSettings() {
    autoSaveApiSettings();
    showToast('设置已保存！正在测试连接...', 'success');
    
    // 更新保存按钮状态
    updateSaveButtonState();
    
    // 保存设置后自动测试连接
    if (typeof testApiConnection === 'function') {
        const ok = await testApiConnection(false);
        if (ok) {
            showToast('✅ 设置已保存并通过连接测试！', 'success');
        } else {
            showToast('❌ 设置已保存但连接测试失败，请检查配置', 'error');
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
            // 不自动设置，等待用户手动保存
        } else if (providerModels.length > 0) {
            // 如果没有找到flash模型，但有其他模型可用，则选择第一个
            modelSelect.value = providerModels[0].name;
            // 不自动设置，等待用户手动保存
        }
    }
    
    // 移除自动保存逻辑，改为手动保存
    // if (!skipAutoSave) {
    //     autoSaveApiSettings();
    // }
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
    const statusElement = document.getElementById('currentModelStatus');
    if (statusElement) {
        const provider = API_CONFIG.CURRENT_CONFIG.provider;
        const model = API_CONFIG.CURRENT_CONFIG.model;
        const providerName = API_CONFIG.PROVIDER_CONFIG[provider]?.name || provider;
        const modelDisplayName = getModelDisplayNameForStatus(model);
        
        statusElement.innerHTML = `🤖 ${providerName} | ${modelDisplayName}`;
        statusElement.title = `当前使用: ${providerName} - ${model}`;
    }
}

// 获取模型显示名称（用于状态显示）
function getModelDisplayNameForStatus(modelName) {
    const shortNames = {
        'doubao-seed-1-6-flash-250715': 'Flash',
        'deepseek-chat': 'Chat',
        'deepseek-reasoner': 'Reasoner',
        'deepseek-vl': 'Vision',
        'gpt-4': 'GPT-4',
        'gpt-4o': 'GPT-4o',
        'gpt-4o-mini': 'GPT-4o Mini',
        'gpt-4-vision-preview': 'GPT-4 Vision',
        'gpt-3.5-turbo': 'GPT-3.5'
    };
    
    return shortNames[modelName] || modelName.split('-').pop() || modelName;
}

// 检查是否有未保存的设置更改
function hasUnsavedChanges() {
    const currentProvider = API_CONFIG.CURRENT_CONFIG.provider;
    const currentModel = API_CONFIG.CURRENT_CONFIG.model;
    
    const selectedProvider = document.getElementById('provider_select').value;
    const selectedModel = document.getElementById('model_select').value;
    
    return currentProvider !== selectedProvider || currentModel !== selectedModel;
}

// 更新保存按钮状态
function updateSaveButtonState() {
    const saveBtn = document.getElementById('saveApiSettingsBtn');
    if (saveBtn) {
        const hasChanges = hasUnsavedChanges();
        if (hasChanges) {
            saveBtn.textContent = '💾 保存设置*';
            saveBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
            saveBtn.style.color = 'white';
        } else {
            saveBtn.textContent = '💾 保存设置';
            saveBtn.style.background = '';
            saveBtn.style.color = '';
        }
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
