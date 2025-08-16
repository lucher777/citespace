// 数据应用模块
// 负责将AI分析结果应用到表单中

function applyCaptureResults(customData = null) {
    // 获取当前激活的section
    const targetSection = document.querySelector('.section.active');
    if (!targetSection) {
        showToast('未找到目标区域！', 'error');
        return;
    }
    
    // 获取数据
    let extractedData;
    if (customData) {
        extractedData = customData;
    } else {
        // 从结果容器中获取数据
        const resultsContainer = document.getElementById('captureResultsContainer');
        let dataElement = resultsContainer.querySelector('[data-extracted-data]');
        if (!dataElement && resultsContainer.hasAttribute('data-extracted-data')) {
            dataElement = resultsContainer;
        }
        if (!dataElement) {
            showToast('未找到提取的数据！', 'error');
            return;
        }
        
        extractedData = JSON.parse(dataElement.getAttribute('data-extracted-data'));
    }
    
    // 检查extractedData是否有效
    if (!extractedData || typeof extractedData !== 'object') {
        showToast('提取的数据无效！', 'error');
        return;
    }
    
    let appliedCount = 0;
    
    // 应用数据到表单字段
    targetSection.querySelectorAll('input, select, textarea').forEach(field => {
        const fieldId = field.getAttribute('data-field-id');
        if (extractedData[fieldId] !== undefined) {
            field.value = extractedData[fieldId];
            appliedCount++;
            
            // 添加高亮效果
            field.style.backgroundColor = '#e8f5e8';
            field.style.borderColor = '#27ae60';
            field.style.boxShadow = '0 0 0 2px rgba(39, 174, 96, 0.2)';
            
            // 3秒后恢复原样式
            setTimeout(() => {
                field.style.backgroundColor = '';
                field.style.borderColor = '';
                field.style.boxShadow = '';
            }, 3000);
        }
    });
    
    if (appliedCount > 0) {
        // 显示详细的应用结果
        const appliedFields = [];
        targetSection.querySelectorAll('input, select, textarea').forEach(field => {
            const fieldId = field.getAttribute('data-field-id');
            if (extractedData[fieldId] !== undefined) {
                const label = field.placeholder || field.closest('.stats-item')?.querySelector('.stats-label')?.textContent || fieldId;
                appliedFields.push(label);
            }
        });
        
        showToast(`成功应用 ${appliedCount} 个字段到表单！\n已应用字段：${appliedFields.join(', ')}`, 'success');
        
        // 滚动到目标区域
        targetSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // 关闭弹窗
        closeTextCapture();
    } else {
        // 若没有结构化字段匹配，尝试将原始文字填入该区域中的第一个textarea
        const rawText = typeof extractedData.raw_text === 'string' ? extractedData.raw_text : '';
        const firstTextarea = targetSection.querySelector('textarea');
        if (rawText && firstTextarea) {
            firstTextarea.value = rawText;
            firstTextarea.style.backgroundColor = '#e8f5e8';
            firstTextarea.style.borderColor = '#27ae60';
            firstTextarea.style.boxShadow = '0 0 0 2px rgba(39, 174, 96, 0.2)';
            setTimeout(() => {
                firstTextarea.style.backgroundColor = '';
                firstTextarea.style.borderColor = '';
                firstTextarea.style.boxShadow = '';
            }, 3000);
            showToast('已将采集到的文字应用到该区域的文本框', 'success');
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            showToast('没有找到匹配的字段！请检查字段映射是否正确。', 'warning');
        }
    }
}

// 导出函数供其他模块使用
window.applyCaptureResults = applyCaptureResults;