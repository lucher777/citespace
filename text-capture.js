// 文字采集核心模块（增强版）
// 负责文字采集弹窗、AI分析、结果应用和增强用户体验

/* ---------------- 文字采集弹窗：初始化与增强UI ---------------- */
function openTextCaptureModal(event) {
    // 找到点击按钮所在的section并标记为active
    const clickedBtn = event.target;
    const section = clickedBtn.closest('.section');
    
    if (section) {
        // 移除其他section的active状态
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        // 添加当前section的active状态
        section.classList.add('active');
    }
    
    const overlay = document.getElementById('textCaptureOverlay');
    overlay.style.display = 'flex';
    
    // 重置所有状态
    resetCaptureState();
    
    // 初始化图片粘贴功能
    initializeImagePaste();
    
    // 绑定移除所有图片按钮事件
    const removeAllImagesBtn = document.getElementById('removeAllImagesBtn');
    if (removeAllImagesBtn) {
        removeAllImagesBtn.onclick = removeAllImages;
    }
    
    document.body.classList.add('modal-open');
    
    // 自动聚焦到文本输入框
    setTimeout(() => {
        const textarea = document.getElementById('textCaptureTextarea');
        if (textarea) textarea.focus();
    }, 100);
}

// 重置采集状态
function resetCaptureState() {
    document.getElementById('captureResultsContainer').style.display = 'none';
    document.getElementById('captureStatusContainer').style.display = 'none';
    document.getElementById('textCaptureTextarea').value = '';
    
    // 清空文件输入框
    const imageUploadInput = document.getElementById('imageUploadInput');
    if (imageUploadInput) {
        imageUploadInput.value = '';
        // 清空 DataTransfer 对象
        const dataTransfer = new DataTransfer();
        imageUploadInput.files = dataTransfer.files;
    }
    
    // 隐藏图片预览
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    
    // 清空图片预览容器
    const imagePreviewsContainer = document.getElementById('imagePreviewsContainer');
    if (imagePreviewsContainer) {
        imagePreviewsContainer.innerHTML = '';
    }
    
    // 重置按钮状态
    const applyBtn = document.getElementById('applyToFormBtn');
    if (applyBtn) applyBtn.style.display = 'none';
    const confirmBtn = document.getElementById('confirmTextCaptureBtn');
    if (confirmBtn) {
        confirmBtn.textContent = '开始采集';
        confirmBtn.disabled = false;
    }
    
    // 清理任何可能的全局图片数据
    if (window.uploadedImages) {
        window.uploadedImages = [];
    }
    
    // 清除初始化标记和事件监听器
    const textarea = document.getElementById('textCaptureTextarea');
    if (textarea && textarea.dataset.imagePasteInitialized === 'true') {
        // 移除事件监听器
        textarea.removeEventListener('paste', textarea._pasteHandler);
        textarea.removeEventListener('dragover', textarea._dragoverHandler);
        textarea.removeEventListener('dragleave', textarea._dragleaveHandler);
        textarea.removeEventListener('drop', textarea._dropHandler);
        
        // 清除事件处理函数引用
        delete textarea._pasteHandler;
        delete textarea._dragoverHandler;
        delete textarea._dragleaveHandler;
        delete textarea._dropHandler;
        
        // 清除初始化标记
        delete textarea.dataset.imagePasteInitialized;
    }
    
    // 清除文件输入框的事件监听器
    const fileInput = document.getElementById('imageUploadInput');
    if (fileInput && fileInput._changeHandler) {
        fileInput.removeEventListener('change', fileInput._changeHandler);
        delete fileInput._changeHandler;
    }
    
    console.log('采集状态已重置，所有图片已清空');
}

// 移除单张图片
function removeSingleImage(imageId) {
    const imageElement = document.getElementById(imageId);
    if (imageElement) {
        // 移除图片元素及其信息
        const imageInfo = imageElement.nextSibling;
        if (imageInfo && imageInfo.nodeType === Node.ELEMENT_NODE && imageInfo.style.fontSize === '10px') {
            imageInfo.remove();
        }
        imageElement.remove();
        
        // 如果没有更多图片，隐藏预览容器
        const imagePreviewsContainer = document.getElementById('imagePreviewsContainer');
        if (imagePreviewsContainer && imagePreviewsContainer.children.length === 0) {
            const previewContainer = document.getElementById('imagePreviewContainer');
            if (previewContainer) {
                previewContainer.style.display = 'none';
            }
        }
        
        showToast('图片已移除', 'info');
    }
}

// 移除所有图片
function removeAllImages() {
    // 清空文件输入框
    const imageUploadInput = document.getElementById('imageUploadInput');
    if (imageUploadInput) {
        imageUploadInput.value = '';
        // 清空 DataTransfer 对象
        const dataTransfer = new DataTransfer();
        imageUploadInput.files = dataTransfer.files;
    }
    
    // 隐藏图片预览容器
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    if (imagePreviewContainer) {
        imagePreviewContainer.style.display = 'none';
    }
    
    // 清空图片预览容器
    const imagePreviewsContainer = document.getElementById('imagePreviewsContainer');
    if (imagePreviewsContainer) {
        imagePreviewsContainer.innerHTML = '';
    }
    
    // 清理任何可能的全局图片数据
    if (window.uploadedImages) {
        window.uploadedImages = [];
    }
    
    showToast('所有图片已移除', 'success');
    console.log('所有图片已清空');
}

function closeTextCapture() {
    document.getElementById('textCaptureOverlay').style.display = 'none';
    document.body.classList.remove('modal-open');
    
    // 清理事件监听器
    const removeAllImagesBtn = document.getElementById('removeAllImagesBtn');
    if (removeAllImagesBtn) {
        removeAllImagesBtn.onclick = null;
    }
    
    // 清理所有临时数据
    setTimeout(() => {
        resetCaptureState();
    }, 300);
}

// 初始化图片粘贴和拖拽功能
function initializeImagePaste() {
    const textarea = document.getElementById('textCaptureTextarea');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const fileInput = document.getElementById('imageUploadInput');
    
    if (!textarea || !previewContainer || !fileInput) return;
    
    // 如果已经初始化过，先移除旧的事件监听器
    if (textarea.dataset.imagePasteInitialized === 'true') {
        // 移除旧的事件监听器
        textarea.removeEventListener('paste', textarea._pasteHandler);
        textarea.removeEventListener('dragover', textarea._dragoverHandler);
        textarea.removeEventListener('dragleave', textarea._dragleaveHandler);
        textarea.removeEventListener('drop', textarea._dropHandler);
        fileInput.removeEventListener('change', fileInput._changeHandler);
    }
    
    // 标记已初始化
    textarea.dataset.imagePasteInitialized = 'true';
    
    // 定义事件处理函数并保存引用
    textarea._pasteHandler = async (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
                e.preventDefault(); // 阻止默认粘贴行为
                
                const file = item.getAsFile();
                if (file) {
                    await displayImagePreview(file);
                    
                    // 将文件添加到imageInput中
                    const dataTransfer = new DataTransfer();
                    // 复制现有文件
                    for (let j = 0; j < fileInput.files.length; j++) {
                        dataTransfer.items.add(fileInput.files[j]);
                    }
                    // 添加新文件
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                }
            }
        }
    };
    
    textarea._dragoverHandler = (e) => {
        e.preventDefault();
        textarea.style.borderColor = '#1890ff';
        textarea.style.backgroundColor = '#f0f8ff';
    };
    
    textarea._dragleaveHandler = () => {
        textarea.style.borderColor = '#e1e5e9';
        textarea.style.backgroundColor = 'white';
    };
    
    textarea._dropHandler = async (e) => {
        e.preventDefault();
        textarea.style.borderColor = '#e1e5e9';
        textarea.style.backgroundColor = 'white';
        
        const files = e.dataTransfer.files;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (file.type.startsWith('image/')) {
                await displayImagePreview(file);
                
                // 将文件添加到imageInput中
                const dataTransfer = new DataTransfer();
                // 复制现有文件
                for (let j = 0; j < fileInput.files.length; j++) {
                    dataTransfer.items.add(fileInput.files[j]);
                }
                // 添加新文件
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
            }
        }
    };
    
    fileInput._changeHandler = async (e) => {
        const files = e.target.files;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (file.type.startsWith('image/')) {
                await displayImagePreview(file);
                
                // 注意：这里不需要手动添加文件到fileInput，因为它是通过change事件触发的
                // fileInput.files已经包含了选中的文件
            }
        }
    };
    
    // 绑定事件监听器
    textarea.addEventListener('paste', textarea._pasteHandler);
    textarea.addEventListener('dragover', textarea._dragoverHandler);
    textarea.addEventListener('dragleave', textarea._dragleaveHandler);
    textarea.addEventListener('drop', textarea._dropHandler);
    fileInput.addEventListener('change', fileInput._changeHandler);
}

// 显示图片预览
async function displayImagePreview(file) {
    if (!file || !file.type.startsWith('image/')) {
        showToast('请选择有效的图片文件', 'warning');
        return;
    }
    
    // 检查文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showToast('图片文件过大，请选择小于10MB的图片', 'warning');
        return;
    }
    
    // 检查是否已经存在相同的图片（基于文件名和大小）
    const imagePreviewsContainer = document.getElementById('imagePreviewsContainer');
    if (imagePreviewsContainer) {
        const existingImages = imagePreviewsContainer.querySelectorAll('div[id^="image-"]');
        for (let existingImage of existingImages) {
            const imageInfo = existingImage.nextSibling;
            if (imageInfo && imageInfo.innerHTML.includes(file.name)) {
                showToast('该图片已存在，请勿重复添加', 'warning');
                return;
            }
        }
    }
    
    // 转换图片为JPG格式
    try {
        file = await convertToJpeg(file);
    } catch (error) {
        console.error('图片转换失败:', error);
        showToast('图片转换失败: ' + error.message, 'error');
        return;
    }
    
    // 显示图片预览容器
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) {
        previewContainer.style.display = 'block';
    }
    
    // 创建新的图片预览元素
    const imageId = 'image-' + Date.now(); // 为每张图片生成唯一ID
    const imagePreviewElement = document.createElement('div');
    imagePreviewElement.id = imageId;
    imagePreviewElement.style.cssText = `
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 8px;
        border: 1px solid #e1e5e9;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        animation: uploadSuccess 0.4s ease-out;
    `;
    
    // 添加加载动画
    imagePreviewElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background: #f8f9fa;">
            <div style="width: 24px; height: 24px; border: 2px solid #f3f3f3; border-top: 2px solid #1890ff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    `;
    
    // 将新图片预览元素添加到容器中
    if (imagePreviewsContainer) {
        imagePreviewsContainer.appendChild(imagePreviewElement);
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // 更新图片预览元素
        imagePreviewElement.innerHTML = `
            <img src="${e.target.result}" alt="预览图片" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: rgba(0, 0, 0, 0.6); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="removeSingleImage('${imageId}')">
                <span style="color: white; font-size: 12px;">×</span>
            </div>
        `;
        
        // 添加图片信息显示
        const imageInfo = document.createElement('div');
        imageInfo.style.cssText = `
            margin-top: 4px;
            font-size: 10px;
            color: #666;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `;
        imageInfo.innerHTML = `
            📷 ${file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
        `;
        
        imagePreviewElement.parentNode.insertBefore(imageInfo, imagePreviewElement.nextSibling);
        
        showToast('图片预览已加载', 'success');
    };
    
    reader.onerror = () => {
        // 移除加载中的元素并显示错误
        if (imagePreviewsContainer && imagePreviewElement.parentNode) {
            imagePreviewElement.remove();
        }
        showToast('图片读取失败，请重新选择图片', 'error');
    };
    
    reader.readAsDataURL(file);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function confirmTextCapture() {
    const textInput = document.getElementById('textCaptureTextarea').value.trim();
    
    // 检查是否有图片
    let hasImages = false;
    const imagePreviewsContainer = document.getElementById('imagePreviewsContainer');
    if (imagePreviewsContainer && imagePreviewsContainer.children.length > 0) {
        hasImages = true;
    }
    
    // 如果没有文本内容且没有图片，显示警告
    if (!textInput && !hasImages) {
        showToast('请输入文本内容或上传图片', 'warning');
        return;
    }
    
    // 禁用开始按钮，防止重复点击
    const confirmBtn = document.getElementById('confirmTextCaptureBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = '采集中...';
    }
    
    try {
        // 获取当前激活的section
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) {
            throw new Error('未找到激活的表单区域');
        }
        
        // 获取section描述符
        const descriptor = getSectionDescriptor(activeSection);
        
        // 获取图片文件
        let imageFile = null;
        const imageInput = document.getElementById('imageUploadInput');
        if (hasImages && imageInput && imageInput.files && imageInput.files.length > 0) {
            // 只处理第一张图片
            imageFile = imageInput.files[0];
            try {
                imageFile = await convertToJpeg(imageFile);
            } catch (error) {
                console.error('图片转换失败:', error);
                showToast('图片转换失败: ' + error.message, 'error');
            }
        }
        
        // 调用AI分析功能
        const result = await analyzeSectionInModal(textInput, imageFile, descriptor, activeSection);
        
        // 结果显示已经在analyzeSectionInModal中处理，这里只需要处理应用按钮
        const applyBtn = document.getElementById('applyToFormBtn');
        if (applyBtn && result?.extractedData) {
            applyBtn.style.display = 'inline-block';
            applyBtn.onclick = () => {
                applyCaptureResults(result.extractedData);
            };
        }
        
        showToast('采集完成', 'success');
    } catch (error) {
        console.error('采集失败:', error);
        showToast('采集失败: ' + error.message, 'error');
        
        // 恢复按钮状态
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = '开始采集';
        }
    }
}

// 处理采集错误
function handleCaptureError(error) {
    updateCaptureStatus('❌', '采集失败', error.message, false);
    
    // 显示详细的错误信息
    const container = document.getElementById('captureResultsContainer');
    container.style.display = 'block';
    
    const errorHTML = `
        <div style="text-align: center; padding: 30px;">
            <div style="color: #e74c3c; font-size: 64px; margin-bottom: 15px;">❌</div>
            <h3 style="color: #e74c3c; margin-bottom: 15px; font-weight: 600;">采集失败</h3>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px; max-width: 500px; margin-left: auto; margin-right: auto;">
                ${error.message}
            </p>
            
            <div style="margin: 20px 0;">
                <button onclick="confirmTextCapture()" class="btn btn-primary" style="margin-right: 10px;">
                    🔄 重新采集
                </button>
                <button onclick="closeTextCapture()" class="btn btn-secondary">
                    ✖️ 关闭
                </button>
            </div>
            
            ${window.__lastAiRawResult ? `
            <details style="margin-top: 20px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
                <summary style="cursor: pointer; color: #007bff; font-weight: 600; margin-bottom: 10px;">
                    🔍 查看AI原始返回内容（用于调试）
                </summary>
                <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin-top: 10px;">
                    <pre style="white-space: pre-wrap; font-size: 12px; color: #495057; margin-bottom: 10px;">
${window.__lastAiRawResult}</pre>
                    <button onclick="copyDebugInfo()" class="btn btn-sm" style="background: #6c757d; color: white;">
                        📋 复制调试信息
                    </button>
                </div>
            </details>
            ` : ''}
        </div>
    `;
    
    container.innerHTML = errorHTML;
}

// 复制调试信息到剪贴板
function copyDebugInfo() {
    const debugInfo = `错误时间: ${new Date().toLocaleString()}\n错误信息: ${window.__lastError?.message || '未知错误'}\n\nAI原始返回:\n${window.__lastAiRawResult || '无数据'}`;
    
    navigator.clipboard.writeText(debugInfo).then(() => {
        showToast('调试信息已复制到剪贴板', 'success');
    }).catch(() => {
        showToast('复制失败，请手动选择复制', 'error');
    });
}

// 辅助函数：将DataURL转换为File对象
function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// 状态管理函数
function updateCaptureStatus(icon, title, message, showProgress = false, progress = 0) {
    const statusContainer = document.getElementById('captureStatusContainer');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    const statusProgress = document.getElementById('statusProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    // 显示状态容器
    statusContainer.style.display = 'block';
    
    // 更新状态信息
    statusIcon.textContent = icon;
    statusTitle.textContent = title;
    statusMessage.textContent = message;
    
    // 处理进度条
    if (showProgress) {
        statusProgress.style.display = 'block';
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        
        // 特殊处理AI分析中的样式
        if (title === 'AI分析中') {
            statusIcon.style.animation = 'pulse 1s infinite';
            statusMessage.style.fontWeight = '600';
            statusMessage.style.color = '#4299e1';
        } else {
            statusIcon.style.animation = 'pulse 1.5s infinite';
            statusMessage.style.fontWeight = 'normal';
            statusMessage.style.color = '#4a5568';
        }
    } else {
        statusProgress.style.display = 'none';
    }
}

// 调试工具：检查采集弹窗状态
function debugCaptureModal() {
    console.log('=== 采集弹窗状态检查 ===');
    
    const elements = {
        overlay: document.getElementById('textCaptureOverlay'),
        resultsContainer: document.getElementById('captureResultsContainer'),
        statusContainer: document.getElementById('captureStatusContainer'),
        textarea: document.getElementById('textCaptureTextarea'),
        applyBtn: document.getElementById('applyResultsBtn'),
        confirmBtn: document.getElementById('confirmTextCaptureBtn')
    };
    
    Object.keys(elements).forEach(key => {
        const el = elements[key];
        if (el) {
            console.log(`${key}:`, {
                display: el.style.display,
                visible: el.offsetParent !== null,
                classList: Array.from(el.classList)
            });
        } else {
            console.warn(`${key}: 元素未找到`);
        }
    });
    
    console.log('=== 状态检查完成 ===');
}

// 显示采集结果（旧版本，已废弃）
function displayCaptureResultsOld(results) {
    const container = document.getElementById('captureResultsContainer');
    container.style.display = 'block';
    
    // 确保状态容器被隐藏
    document.getElementById('captureStatusContainer').style.display = 'none';
    
    // 检查是否有有效结果
    const validResults = Object.entries(results).filter(([key, value]) => 
        value !== null && value !== undefined && value !== ''
    );
    
    // 显示应用到表单按钮
    const applyBtn = document.getElementById('applyToFormBtn');
    if (applyBtn) {
        if (validResults.length > 0) {
            applyBtn.style.display = 'inline-block';
        } else {
            applyBtn.style.display = 'none';
        }
    }
    
    if (validResults.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 15px;">🤔</div>
                <h4 style="color: #6c757d; margin-bottom: 15px;">未识别到有效数据</h4>
                <p style="color: #868e96; margin-bottom: 20px;">
                    请检查输入内容是否包含相关数据，或尝试重新采集
                </p>
                <div>
                    <button onclick="confirmTextCapture()" class="btn btn-primary" style="margin-right: 10px;">
                        🔄 重新采集
                    </button>
                    <button onclick="closeTextCapture()" class="btn btn-secondary">
                        ✖️ 关闭
                    </button>
                </div>
            </div>
        `;
        
        // 隐藏应用到表单按钮
        const applyBtn = document.getElementById('applyToFormBtn');
        if (applyBtn) {
            applyBtn.style.display = 'none';
        }
        
        return;
    }
    
    // 保存结果数据供后续使用
    container.__captureResults = results;
    
    // 构建结果展示
    let html = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #28a745; margin-bottom: 15px; text-align: center;">
                <span style="font-size: 24px; margin-right: 8px;">✅</span>
                采集成功！
            </h4>
            <p style="text-align: center; color: #6c757d; margin-bottom: 20px;">
                共识别出 <strong>${validResults.length}</strong> 个有效字段
            </p>
        </div>
        
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 8px; background: #fff;">
            <div style="padding: 15px;">
    `;
    
    validResults.forEach(([key, value], index) => {
        const fieldName = formatFieldName(key);
        const previewValue = formatValueForPreview(value);
        
        html += `
            <div style="margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff; transition: all 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <strong style="color: #495057; font-size: 14px; display: block; margin-bottom: 4px;">
                            ${fieldName}
                        </strong>
                        <div style="font-size: 13px; color: #6c757d; word-break: break-all;">
                            ${previewValue}
                        </div>
                    </div>
                    <button onclick="applyFieldValue('${key}', ${JSON.stringify(value)})" 
                            class="btn btn-sm btn-outline-primary"
                            style="margin-left: 10px; padding: 4px 12px; font-size: 12px; white-space: nowrap;">
                        应用
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 30px 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); border: 1px solid rgba(226, 232, 240, 0.8); text-align: center; min-width: 420px; max-width: 480px;">
            <div style="margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 10px; animation: bounceIn 0.6s ease;">🎯</div>
                <strong style="color: #1a202c; font-size: 20px; font-weight: 700; display: block; margin-bottom: 8px;">采集完成！</strong>
                <p style="color: #4a5568; font-size: 16px; margin: 0; font-weight: 500;">
                    成功识别 <strong style="color: #38a169;">${validResults.length}</strong> 个有效字段
                </p>
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 20px;">
                <button onclick="applyAllResults()" class="btn btn-success" style="width: 180px; height: 48px; font-size: 16px; font-weight: 600; border-radius: 8px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border: none; box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3); transition: all 0.3s ease;">
                    🚀 一键应用全部
                </button>
                <button onclick="closeTextCapture()" class="btn btn-outline-secondary" style="width: 140px; height: 48px; font-size: 16px; font-weight: 600; border-radius: 8px; border: 2px solid #e2e8f0; background: white; color: #4a5568; transition: all 0.3s ease;">
                    ✖️ 稍后再说
                </button>
            </div>
            
            <div style="font-size: 13px; color: #718096; background: rgba(247, 250, 252, 0.8); padding: 12px; border-radius: 8px;">
                💡 <strong>提示：</strong>也可以点击上方字段旁的"应用"按钮单独使用
            </div>
            
            <style>
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        </div>
    `;
    
    container.innerHTML = html;
    
    // 添加成功提示（显示在页面中间上方）
    showTopCenterToast(`成功识别 ${validResults.length} 个字段`, 'success');
}

// 在页面上方中间显示提示
function showTopCenterToast(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: ${type === 'success' ? '#48bb78' : '#4299e1'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    notification.innerHTML = `
        <span>${type === 'success' ? '✅' : 'ℹ️'}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);
    
    // 自动移除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Toast通知系统
function showToast(message, type = 'info', duration = 3000) {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    
    const typeStyles = {
        success: { bg: '#28a745', icon: '✅' },
        error: { bg: '#dc3545', icon: '❌' },
        warning: { bg: '#ffc107', icon: '⚠️' },
        info: { bg: '#17a2b8', icon: 'ℹ️' }
    };
    
    const style = typeStyles[type] || typeStyles.info;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${style.bg};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    toast.innerHTML = `
        <span>${style.icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动移除
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// 增强的字段值格式化
function formatValueForPreview(value) {
    if (value === null || value === undefined) {
        return '<em style="color: #6c757d;">空值</em>';
    }
    
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return '<em style="color: #6c757d;">空列表</em>';
            }
            return value.slice(0, 3).map(v => String(v)).join(', ') + 
                   (value.length > 3 ? ` <span style="color: #6c757d;">+${value.length - 3}项</span>` : '');
        }
        return JSON.stringify(value, null, 2);
    }
    
    const strValue = String(value);
    if (strValue.length > 100) {
        return strValue.substring(0, 100) + '<span style="color: #6c757d;">...</span>';
    }
    
    return strValue;
}

// 应用单个字段值
function applyFieldValue(fieldKey, fieldValue) {
    const activeSection = document.querySelector('.section.active') || document.querySelector('.section');
    if (!activeSection) {
        showToast('未找到目标区域', 'error');
        // 即使未找到目标区域，也关闭弹窗
        setTimeout(() => {
            closeTextCapture();
        }, 800);
        return;
    }
    
    const input = activeSection.querySelector(`[name="${fieldKey}"], [id="${fieldKey}"], [data-field-id="${fieldKey}"]`);
    if (input) {
        input.value = fieldValue;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 优雅的高亮动画效果
        input.style.transition = 'all 0.4s ease';
        input.style.backgroundColor = '#d4edda';
        input.style.borderColor = '#28a745';
        input.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
        
        // 创建成功提示
        showApplySuccess(`${formatFieldName(fieldKey)} 已应用`);
        
        // 自动关闭弹窗
        setTimeout(() => {
            closeTextCapture();
            showToast(`${formatFieldName(fieldKey)} 已成功应用到表单`, 'success');
        }, 800);
        
        setTimeout(() => {
            input.style.backgroundColor = '';
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }, 1500);
    } else {
        showToast(`未找到字段: ${formatFieldName(fieldKey)}`, 'warning');
        // 即使未找到字段，也关闭弹窗
        setTimeout(() => {
            closeTextCapture();
        }, 800);
    }
}

// 应用所有结果
function applyAllResults() {
    const container = document.getElementById('captureResultsContainer');
    const results = container.__captureResults || {};
    
    const activeSection = document.querySelector('.section.active') || document.querySelector('.section');
    if (!activeSection) {
        showToast('未找到目标区域', 'error');
        return;
    }
    
    let appliedCount = 0;
    let failedFields = [];
    
    // 创建进度显示
    const progressToast = document.createElement('div');
    progressToast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        text-align: center;
        min-width: 300px;
    `;
    
    progressToast.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">🚀</div>
        <h4 style="color: #495057; margin-bottom: 10px;">正在应用数据...</h4>
        <div style="color: #6c757d; margin-bottom: 15px;">
            <span id="applyProgress">0</span> / ${Object.keys(results).length}
        </div>
        <div style="width: 100%; height: 4px; background: #e9ecef; border-radius: 2px;">
            <div id="applyProgressBar" style="width: 0%; height: 100%; background: #28a745; border-radius: 2px; transition: width 0.3s ease;"></div>
        </div>
    `;
    
    document.body.appendChild(progressToast);
    
    // 逐个应用字段，创建动画效果
    const fieldEntries = Object.entries(results);
    let index = 0;
    
    const applyNext = () => {
        if (index < fieldEntries.length) {
            const [key, value] = fieldEntries[index];
            const input = activeSection.querySelector(`[name="${key}"], [id="${key}"], [data-field-id="${key}"]`);
            
            if (input) {
                input.value = value;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                
                // 高亮动画
                input.style.transition = 'all 0.3s ease';
                input.style.backgroundColor = '#d4edda';
                input.style.borderColor = '#28a745';
                
                setTimeout(() => {
                    input.style.backgroundColor = '';
                    input.style.borderColor = '';
                }, 800);
                
                appliedCount++;
            } else {
                failedFields.push(formatFieldName(key));
            }
            
            // 更新进度
            const progress = ((index + 1) / fieldEntries.length) * 100;
            document.getElementById('applyProgress').textContent = index + 1;
            document.getElementById('applyProgressBar').style.width = `${progress}%`;
            
            index++;
            setTimeout(applyNext, 200); // 200ms间隔，创建动画效果
        } else {
            // 完成后的处理
            setTimeout(() => {
                document.body.removeChild(progressToast);
                
                // 显示完成提示
                if (appliedCount > 0) {
                    showApplyComplete(appliedCount, failedFields);
                }
                
                setTimeout(() => {
                    closeTextCapture();
                }, 1500);
            }, 500);
        }
    };
    
    applyNext();
}

// 显示应用成功的优雅提示
function showApplySuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: #28a745;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        z-index: 10001;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 16px;">✅</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);
    
    // 自动移除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// 显示应用完成的精美提示
function showApplyComplete(appliedCount, failedFields) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        max-width: 400px;
        animation: scaleIn 0.3s ease;
    `;
    
    let icon = '🎉';
    let title = '应用成功！';
    let message = `成功应用了 ${appliedCount} 个字段`;
    
    if (failedFields.length > 0) {
        icon = '⚠️';
        title = '部分应用成功';
        message = `成功应用 ${appliedCount} 个字段，${failedFields.length} 个字段未找到`;
    }
    
    content.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px; animation: bounce 1s ease;">${icon}</div>
        <h3 style="color: #28a745; margin-bottom: 10px; font-weight: 600;">${title}</h3>
        <p style="color: #6c757d; margin-bottom: 20px; font-size: 16px;">${message}</p>
        ${failedFields.length > 0 ? `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <small style="color: #6c757d;">未找到的字段: ${failedFields.join(', ')}</small>
        </div>
        ` : ''}
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: #28a745; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-size: 16px;">
            知道了
        </button>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
    
    // 点击背景关闭
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
    
    // 自动关闭
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 3000);
}

// 格式化字段名显示
function formatFieldName(key) {
    // 特殊字段映射
    const fieldNameMap = {
        'databaseSource': '数据库来源',
        'searchStrategy': '检索策略',
        'searchDate': '检索日期',
        'totalPapers': '文献总数',
        'annualGrowth': '年发文量',
        'journalName': '期刊名称',
        'impactFactor': '影响因子',
        'paperCount': '发文数量',
        'institutionName': '机构名称',
        'country': '国家/地区',
        'authorName': '作者姓名',
        'hIndex': 'H指数',
        'cooperationCount': '合作次数',
        'keyword': '关键词',
        'frequency': '频次',
        'reference': '参考文献',
        'citationCount': '被引次数',
        'researchHot': '研究热点',
        'trendDirection': '趋势方向',
        'qualityScore': '质量评分',
        'reliability': '可靠性',
        'coreJournals': '核心期刊',
        'coreInstitutions': '核心机构',
        'coreAuthors': '核心作者',
        'cooperationNetwork': '合作网络',
        'evolutionPath': '演进路径',
        'burstKeywords': '突现关键词',
        'highImpactPapers': '高影响力文献'
    };
    
    if (fieldNameMap[key]) {
        return fieldNameMap[key];
    }
    
    return key.replace(/([A-Z])/g, ' $1')
              .replace(/_/g, ' ')
              .replace(/^./, str => str.toUpperCase())
              .trim();
}

// 导出函数供其他模块使用
window.openTextCaptureModal = openTextCaptureModal;
window.closeTextCapture = closeTextCapture;
window.confirmTextCapture = confirmTextCapture;
window.updateCaptureStatus = updateCaptureStatus;
window.removeSingleImage = removeSingleImage;
window.removeAllImages = removeAllImages;
window.applyAllResults = applyAllResults;
window.showToast = showToast;
window.showApplySuccess = showApplySuccess;
window.showApplyComplete = showApplyComplete;
window.formatFieldName = formatFieldName;
window.debugCaptureModal = debugCaptureModal;
