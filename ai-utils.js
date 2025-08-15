// AI分析辅助函数模块
// 包含AI分析中使用的辅助函数

// 字符串相似度计算
function isSimilarString(str1, str2, maxDistance) {
    if (Math.abs(str1.length - str2.length) > maxDistance) return false;
    
    let distance = 0;
    const minLength = Math.min(str1.length, str2.length);
    
    for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) distance++;
        if (distance > maxDistance) return false;
    }
    
    distance += Math.abs(str1.length - str2.length);
    return distance <= maxDistance;
}

// 清理数值
function cleanNumericValue(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return value;
    
    // 提取数字（包括小数和负数）
    const match = value.toString().match(/[-+]?\d*\.?\d+/);
    return match ? parseFloat(match[0]) : value;
}

// 导出函数供其他模块使用
window.isSimilarString = isSimilarString;
window.cleanNumericValue = cleanNumericValue;