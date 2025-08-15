// 数据管理模块
// 负责数据的保存、导出、导入和自动保存功能

let autoSaveInterval;

/* ---------------- 数据保存与导出 ---------------- */
function saveData() {
    const data = {};
    document.querySelectorAll('[data-section-id]').forEach(section => {
        const sectionId = section.getAttribute('data-section-id');
        data[sectionId] = {};
        
        section.querySelectorAll('input, select, textarea').forEach(field => {
            const fieldId = field.getAttribute('data-field-id');
            if (fieldId) {
                data[sectionId][fieldId] = field.value;
            }
        });
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citespace_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function exportData() {
    saveData();
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    loadDataFromObject(data);
                    showToast('数据导入成功！', 'success');
                } catch (error) {
                    showToast('导入失败：文件格式错误', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function loadDataFromObject(data) {
    Object.keys(data).forEach(sectionId => {
        const section = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (section) {
            Object.keys(data[sectionId]).forEach(fieldId => {
                const field = section.querySelector(`[data-field-id="${fieldId}"]`);
                if (field) {
                    field.value = data[sectionId][fieldId];
                }
            });
        }
    });
}

/* ---------------- 自动保存 ---------------- */
function autoSave() {
    const data = {};
    document.querySelectorAll('[data-section-id]').forEach(section => {
        const sectionId = section.getAttribute('data-section-id');
        data[sectionId] = {};
        
        section.querySelectorAll('input, select, textarea').forEach(field => {
            const fieldId = field.getAttribute('data-field-id');
            if (fieldId) {
                data[sectionId][fieldId] = field.value;
            }
        });
    });
    
    localStorage.setItem('citespace_auto_save', JSON.stringify(data));
}

function loadAutoSave() {
    const saved = localStorage.getItem('citespace_auto_save');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            loadDataFromObject(data);
        } catch (error) {
            console.error('自动保存数据加载失败:', error);
        }
    }
}

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(autoSave, 30000);
    
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', autoSave);
        input.addEventListener('input', autoSave);
    });
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// 导出函数供其他模块使用
window.saveData = saveData;
window.exportData = exportData;
window.importData = importData;
window.loadAutoSave = loadAutoSave;
window.startAutoSave = startAutoSave;
window.stopAutoSave = stopAutoSave;
