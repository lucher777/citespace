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
    
    // 初始化瀑布流布局功能
    initWaterfallFeatures();
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

// 瀑布流布局优化 - 合并到主初始化中
function initWaterfallFeatures() {
    // 初始化瀑布流布局
    initWaterfallLayout();
    
    // 监听窗口大小变化，重新调整布局
    window.addEventListener('resize', debounce(function() {
        adjustWaterfallLayout();
    }, 250));
    
    // 监听模块内容变化，重新调整布局（简化版）
    const observer = new MutationObserver(function(mutations) {
        let needsAdjustment = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                needsAdjustment = true;
            } else if (mutation.type === 'attributes' && 
                      (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                // 只有当模块被隐藏时才调整
                const target = mutation.target;
                if (target.classList.contains('section') && target.style.display === 'none') {
                    needsAdjustment = true;
                }
            }
        });
        
        if (needsAdjustment) {
            adjustWaterfallLayout();
        }
    });
    
    // 观察表单容器的变化
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        observer.observe(formContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }
}

// 初始化瀑布流布局
function initWaterfallLayout() {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) return;
    
    // 确保所有模块都是可见的
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'block';
        section.style.opacity = '1';
    });
    
    // 添加模块悬停效果
    addModuleHoverEffects();
    
    // 添加模块点击展开/收起功能
    addModuleToggleEffects();
}

// 调整瀑布流布局
function adjustWaterfallLayout() {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) return;
    
    // 确保容器始终显示为grid
    if (formContainer.style.display !== 'grid') {
        formContainer.style.display = 'grid';
    }
    
    // 确保所有模块都是可见的
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.style.display === 'none') {
            section.style.display = 'block';
        }
        if (section.style.opacity !== '1') {
            section.style.opacity = '1';
        }
    });
}

// 添加模块悬停效果
function addModuleHoverEffects() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        // 添加鼠标进入效果
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
        });
        
        // 添加鼠标离开效果
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        });
    });
}

// 添加模块点击展开/收起功能
function addModuleToggleEffects() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const header = section.querySelector('h3');
        if (!header) return;
        
        // 添加点击指示器
        header.style.cursor = 'pointer';
        header.innerHTML += '<span class="toggle-indicator" style="margin-left: auto; font-size: 12px; opacity: 0.6;">▼</span>';
        
        // 添加点击事件
        header.addEventListener('click', function(e) {
            // 如果点击的是按钮，不触发折叠
            if (e.target.closest('.text-capture-btn')) {
                return;
            }
            
            const content = section.querySelector('.form-grid, .stats-row, .ranking-group, .cluster-grid, .timeline-item');
            if (content) {
                const isCollapsed = content.style.display === 'none';
                content.style.display = isCollapsed ? 'block' : 'none';
                
                const indicator = this.querySelector('.toggle-indicator');
                if (indicator) {
                    indicator.textContent = isCollapsed ? '▼' : '▶';
                }
                
                // 重新调整布局
                setTimeout(() => {
                    adjustWaterfallLayout();
                }, 300);
            }
        });
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 搜索功能已删除，确保模块正常显示
