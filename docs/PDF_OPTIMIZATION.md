# PDF导出优化说明

## 优化前后对比

### 优化前
- 文件大小：~50MB
- 分辨率：scale: 2 (高分辨率)
- 图片格式：PNG (无压缩)
- PDF配置：无压缩设置

### 优化后
- 文件大小：预计 **5-10MB** (减少80-90%)
- 分辨率：scale: 1.2 (适中分辨率)
- 图片格式：JPEG (有损压缩)
- PDF配置：启用压缩

## 优化措施

### 1. 降低Canvas分辨率
```javascript
// 优化前
scale: 2

// 优化后
scale: 1.2  // 降低分辨率但保持可读性
```

### 2. 使用JPEG格式替代PNG
```javascript
// 优化前
canvas.toDataURL('image/png')

// 优化后
canvas.toDataURL('image/jpeg', 0.5)  // 使用JPEG格式，质量0.5
```

### 3. 启用PDF压缩和自适应尺寸
```javascript
const pdf = new jsPDF({
  orientation: canvas.width > canvas.height ? 'l' : 'p',
  unit: 'px',
  format: [canvas.width, canvas.height], // 使用canvas的确切尺寸
  compress: true,  // 启用PDF压缩
  precision: 2     // 降低精度
})
```

### 4. 优化html2canvas配置
```javascript
{
  scale: 1.2,
  useCORS: true,
  allowTaint: true,
  removeContainer: true,
  imageTimeout: 15000,
  logging: false,
  foreignObjectRendering: false
}
```

## 压缩预设

提供了4个压缩预设供选择：

### HIGH_QUALITY (高质量)
- 分辨率：scale: 2
- 质量：0.9
- 预计文件大小：15-25MB

### MEDIUM_QUALITY (中等质量) - 默认
- 分辨率：scale: 1.5
- 质量：0.7
- 预计文件大小：8-15MB

### LOW_QUALITY (低质量) - 当前使用
- 分辨率：scale: 1.2
- 质量：0.5
- 预计文件大小：5-10MB

### MINIMAL_SIZE (极小文件)
- 分辨率：scale: 1
- 质量：0.3
- 预计文件大小：2-5MB

## 使用方法

### 在代码中切换预设
```javascript
await exportOptimizedPdf(element, filename, {
  preset: 'MINIMAL_SIZE',  // 选择预设
  margin: 10,
  canvas: {
    backgroundColor: '#111827'
  }
})
```

### 自定义配置
```javascript
await exportOptimizedPdf(element, filename, {
  quality: 0.4,  // 自定义质量
  canvas: {
    scale: 1.0,  // 自定义分辨率
    backgroundColor: '#111827'
  }
  // PDF尺寸自动根据canvas调整，无需手动设置
})
```

## 性能优化

### 1. 异步加载依赖
```javascript
const html2canvas = (await import('html2canvas')).default
const jsPDF = (await import('jspdf')).default
```

### 2. 忽略不必要元素
```javascript
ignoreElements: (element) => {
  return element.classList?.contains('no-export') || false
}
```

### 3. 优化分页处理
- 智能计算页面高度
- 避免重复渲染
- 优化图片定位

## 重要特性

### 保持原始宽度
- PDF尺寸自动匹配canvas尺寸
- 不会因为标准页面格式而改变内容宽度
- 确保内容完整显示

### 无边距设计
- 图片填满整个PDF页面
- 没有白边或空白区域
- 最大化内容显示区域

### 单页输出
- 不进行分页处理
- 整个内容在一个PDF页面中
- 避免内容被截断

## 注意事项

1. **质量与文件大小的平衡**：降低质量会减少文件大小，但可能影响可读性
2. **分辨率选择**：scale值越低文件越小，但文字可能模糊
3. **JPEG vs PNG**：JPEG文件更小但不支持透明背景
4. **浏览器兼容性**：确保目标浏览器支持所使用的压缩格式
5. **长内容处理**：由于不分页，很长的内容会创建很高的PDF页面

## 建议设置

对于不同使用场景的建议：

- **打印用途**：使用 HIGH_QUALITY 预设
- **在线分享**：使用 MEDIUM_QUALITY 预设
- **快速预览**：使用 LOW_QUALITY 预设
- **移动设备**：使用 MINIMAL_SIZE 预设
