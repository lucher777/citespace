// 表单初始化模块
// 负责表单字段的初始化和字段ID管理

/* ---------------- 表单初始化 ---------------- */
function initializeSections() {
    // 为所有section中的表单字段添加data-field-id属性
    document.querySelectorAll('.section').forEach(section => {
        section.querySelectorAll('input, select, textarea').forEach((field, index) => {
            if (!field.getAttribute('data-field-id')) {
                // 尝试从各种属性获取字段名称
                let fieldName = field.name || field.id || field.placeholder || field.className;
                
                // 如果没有合适的名称，生成一个基于section和索引的名称
                if (!fieldName || fieldName === '') {
                    const sectionTitle = section.querySelector('h3')?.textContent?.trim() || 'section';
                    const cleanSectionTitle = sectionTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').substring(0, 10);
                    fieldName = `${cleanSectionTitle}_field_${index + 1}`;
                }
                
                // 清理字段名称，只保留字母、数字和中文字符
                fieldName = fieldName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
                
                field.setAttribute('data-field-id', fieldName);
            }
        });
    });
}

function getSectionDescriptor(sectionEl) {
    const title = sectionEl.querySelector('h3')?.textContent?.trim() || '未知区域';
    const fields = [];
    
    sectionEl.querySelectorAll('input, select, textarea').forEach((el, index) => {
        // 尝试获取字段标签
        let label = el.closest('.form-group')?.querySelector('label')?.textContent?.trim();
        
        if (!label) {
            // 尝试从stats-label获取标签
            const statsLabel = el.closest('.stats-item')?.querySelector('.stats-label')?.textContent?.trim();
            if (statsLabel) {
                label = statsLabel;
            } else {
                // 使用placeholder或生成默认标签
                label = el.placeholder || el.getAttribute('aria-label') || `字段${index + 1}`;
            }
        }
        
        // 确保字段有data-field-id
        let fieldId = el.getAttribute('data-field-id');
        if (!fieldId) {
            // 如果没有，生成一个
            const cleanLabel = label.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
            fieldId = `${cleanLabel}_${index}`;
            el.setAttribute('data-field-id', fieldId);
        }
        
        fields.push({
            fieldId: fieldId,
            label: label,
            type: el.type || el.tagName.toLowerCase(),
            placeholder: el.placeholder || '',
            name: el.name || '',
            idAttr: el.id || '',
            classes: (el.className || '').toString()
        });
    });
    
    return { title, fields };
}

// 导出函数供其他模块使用
window.initializeSections = initializeSections;
window.getSectionDescriptor = getSectionDescriptor;
