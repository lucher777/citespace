// 主初始化模块
// 负责页面初始化、事件绑定和模块协调

/* ---------------- 初始化 ---------------- */
document.addEventListener('DOMContentLoaded', function() {
    initializeSections();
    if (typeof loadApiSettings === 'function') {
        loadApiSettings();
    }
    
    // 初始化模型下拉列表（初始化时跳过自动保存）
    if (typeof updateModelOptions === 'function') {
        updateModelOptions(true);
    }
    
    // 验证并显示当前模型状态
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG.getGlobalModelStatus) {
        const modelStatus = API_CONFIG.getGlobalModelStatus();
        console.log('=== 全局模型状态 ===');
        console.log('当前模型:', modelStatus.displayName);
        console.log('模型有效性:', modelStatus.isValid);
        console.log('视觉模型支持:', modelStatus.isVisionSupported);
        console.log('===================');
        
        // 如果模型无效，显示警告
        if (!modelStatus.isValid) {
            showToast('⚠️ 模型配置已自动调整', 'warning');
        }
    }
    
    // 初始化保存按钮状态
    if (typeof updateSaveButtonState === 'function') {
        updateSaveButtonState();
    }
    
    // 绑定提供商选择变化事件
    document.getElementById('provider_select').addEventListener('change', () => {
        if (typeof updateModelOptions === 'function') {
            updateModelOptions();
        }
        // 更新保存按钮状态
        if (typeof updateSaveButtonState === 'function') {
            updateSaveButtonState();
        }
        // 显示提示，告知用户需要保存设置
        showToast('⚠️ 请点击"保存设置"按钮来应用新的提供商选择', 'warning');
    });
    
    // 绑定模型选择变化事件
    document.getElementById('model_select').addEventListener('change', () => {
        // 更新保存按钮状态
        if (typeof updateSaveButtonState === 'function') {
            updateSaveButtonState();
        }
        // 显示提示，告知用户需要保存设置
        showToast('⚠️ 请点击"保存设置"按钮来应用新的模型选择', 'warning');
    });
    
    // 检查测试连接按钮是否存在
    const testBtn = document.getElementById('testApiConnectionBtn');
    console.log('测试连接按钮元素:', testBtn);
    console.log('testApiConnection函数:', typeof testApiConnection);
    if (testBtn && typeof testApiConnection === 'function') {
        testBtn.addEventListener('click', () => testApiConnection(false));
        console.log('测试连接按钮事件监听器已添加');
    } else {
        console.log('测试连接按钮未找到或testApiConnection函数不存在');
    }
    
    // 绑定清空表单按钮事件
    const clearAllBtnTop = document.getElementById('clearAllBtnTop');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    if (clearAllBtnTop) {
        clearAllBtnTop.addEventListener('click', clearAllFormData);
        console.log('顶部清空表单按钮事件监听器已添加');
    }
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFormData);
        console.log('底部清空表单按钮事件监听器已添加');
    }
    
    // 绑定图文采集按钮事件
    const textCaptureBtns = document.querySelectorAll('.text-capture-btn');
    if (textCaptureBtns.length > 0) {
        textCaptureBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                if (typeof openTextCaptureModal === 'function') {
                    openTextCaptureModal(event);
                } else {
                    console.error('openTextCaptureModal function not found');
                }
            });
        });
    }
    
    // 设置自动保存
    if (typeof startAutoSave === 'function') {
        startAutoSave();
    }
    
    if (typeof loadAutoSave === 'function') {
        loadAutoSave();
    }
    
    // 添加加载动画样式
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// 清空所有表单数据
function clearAllFormData() {
    // 显示确认对话框
    if (!confirm('确定要清空所有表单数据吗？此操作不可撤销。')) {
        return;
    }
    
    // 清空所有表单字段
    document.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type !== 'button' && field.type !== 'submit') {
            field.value = '';
        }
    });
    
    // 清空自动保存数据
    localStorage.removeItem('citespace_auto_save');
    
    // 显示成功提示
    showToast('所有表单数据已清空', 'success');
    
    console.log('所有表单数据已清空');
}

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    stopAutoSave();
});

// 导出清空表单函数
window.clearAllFormData = clearAllFormData;
