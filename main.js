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
        console.log('找到图文采集按钮数量:', textCaptureBtns.length);
        textCaptureBtns.forEach((btn, index) => {
            btn.addEventListener('click', (event) => {
                console.log('图文采集按钮被点击:', index);
                event.preventDefault();
                event.stopPropagation();
                if (typeof openTextCaptureModal === 'function') {
                    openTextCaptureModal(event);
                } else {
                    console.error('openTextCaptureModal function not found');
                    alert('图文采集功能暂时不可用');
                }
            });
        });
    } else {
        console.log('未找到图文采集按钮');
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
    
    // 初始化右侧导航栏
    initSideNavigation();
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
    
    // 确保容器使用grid布局
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
            this.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.15)';
            this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
        });
        
        // 添加鼠标离开效果
        section.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.1)';
            this.style.borderColor = 'rgba(102, 126, 234, 0.15)';
        });
    });
}

// 移除模块点击展开/收起功能
function addModuleToggleEffects() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const header = section.querySelector('h3');
        if (!header) return;
        
        // 移除点击指示器和点击事件
        header.style.cursor = 'default';
        
        // 移除可能存在的toggle-indicator
        const existingIndicator = header.querySelector('.toggle-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
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

// 右侧导航栏功能
function initSideNavigation() {
    const navList = document.getElementById('navList');
    const navToggle = document.getElementById('navToggle');
    const sideNav = document.querySelector('.side-navigation');
    
    if (!navList || !navToggle || !sideNav) return;
    
    // 生成导航项
    generateNavigationItems();
    
    // 绑定导航切换事件
    navToggle.addEventListener('click', function() {
        sideNav.classList.toggle('collapsed');
        const isCollapsed = sideNav.classList.contains('collapsed');
        navToggle.textContent = isCollapsed ? '▶' : '◀';
        
        // 导航栏浮动定位，不需要调整主容器边距
    });
    
    // 监听滚动事件，更新当前活动项
    window.addEventListener('scroll', debounce(function() {
        updateActiveNavigationItem();
    }, 100));
}

// 生成导航项
function generateNavigationItems() {
    const navList = document.getElementById('navList');
    const sections = document.querySelectorAll('.section');
    
    if (!navList) return;
    
    const moduleNames = [
        '数据检索基础信息',
        '年发文量趋势分析',
        '国家/地区分布分析',
        '机构分布分析',
        '期刊分布分析',
        '作者分析',
        '关键词分析',
        '突现词分析',
        '网络拓扑特征',
        '核心引文分析',
        '引文模式分析',
        '聚类分析',
        '时间演化分析',
        '数据质量评估'
    ];
    
    navList.innerHTML = '';
    
    sections.forEach((section, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.setAttribute('data-section-index', index);
        
        const icon = document.createElement('div');
        icon.className = 'nav-icon';
        icon.textContent = index + 1;
        
        const text = document.createElement('div');
        text.className = 'nav-text';
        text.textContent = moduleNames[index] || `模块 ${index + 1}`;
        
        navItem.appendChild(icon);
        navItem.appendChild(text);
        
        // 添加点击事件
        navItem.addEventListener('click', function() {
            scrollToSection(section);
        });
        
        navList.appendChild(navItem);
    });
}

// 滚动到指定模块
function scrollToSection(section) {
    if (!section) return;
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const settingsBarHeight = document.querySelector('.settings-bar').offsetHeight;
    const offset = headerHeight + settingsBarHeight + 20;
    
    const sectionTop = section.offsetTop - offset;
    
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
    
    // 添加高亮效果
    section.style.animation = 'highlightPulse 1s ease-out';
    setTimeout(() => {
        section.style.animation = '';
    }, 1000);
}

// 更新当前活动导航项
function updateActiveNavigationItem() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const settingsBarHeight = document.querySelector('.settings-bar').offsetHeight;
    const offset = headerHeight + settingsBarHeight + 100;
    
    let activeIndex = -1;
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
            activeIndex = index;
        }
    });
    
    // 更新导航项状态
    navItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 添加高亮动画
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    @keyframes highlightPulse {
        0% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1); }
        50% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }
        100% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1); }
    }
`;
document.head.appendChild(highlightStyle);
