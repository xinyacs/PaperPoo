/**
 * PDF优化工具函数
 * 用于压缩和优化PDF导出
 */

/**
 * 压缩canvas图片
 * @param {HTMLCanvasElement} canvas - 要压缩的canvas
 * @param {string} format - 图片格式 ('jpeg' | 'png' | 'webp')
 * @param {number} quality - 压缩质量 (0-1)
 * @returns {string} 压缩后的base64图片数据
 */
export function compressCanvasImage(canvas, format = 'jpeg', quality = 0.7) {
  // 对于JPEG格式，使用指定的质量
  if (format === 'jpeg') {
    return canvas.toDataURL('image/jpeg', quality)
  }
  
  // 对于PNG格式，先转换为JPEG再转回PNG以减少大小
  if (format === 'png') {
    // 创建临时canvas进行压缩
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    
    // 填充白色背景（JPEG不支持透明）
    tempCtx.fillStyle = '#ffffff'
    tempCtx.fillRect(0, 0, canvas.width, canvas.height)
    tempCtx.drawImage(canvas, 0, 0)
    
    return tempCanvas.toDataURL('image/jpeg', quality)
  }
  
  // 对于WebP格式
  if (format === 'webp') {
    return canvas.toDataURL('image/webp', quality)
  }
  
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * 获取优化的html2canvas配置
 * @param {Object} options - 自定义选项
 * @returns {Object} 优化的配置对象
 */
export function getOptimizedHtml2CanvasConfig(options = {}) {
  return {
    scale: options.scale || 1.5, // 降低分辨率以减少文件大小
    useCORS: true,
    allowTaint: true,
    removeContainer: true,
    imageTimeout: 15000,
    logging: false,
    backgroundColor: options.backgroundColor || '#111827',
    width: options.width,
    height: options.height,
    // 优化渲染性能
    foreignObjectRendering: false,
    ignoreElements: (element) => {
      // 忽略某些不必要的元素
      return element.classList?.contains('no-export') || false
    },
    ...options
  }
}

/**
 * 获取优化的jsPDF配置
 * @param {Object} options - 自定义选项
 * @returns {Object} 优化的PDF配置
 */
export function getOptimizedPdfConfig(options = {}) {
  return {
    orientation: options.orientation || 'p',
    unit: options.unit || 'mm',
    format: options.format || 'a4',
    compress: true, // 启用PDF压缩
    precision: 2, // 降低精度以减少文件大小
    ...options
  }
}

/**
 * 计算保持原始宽度的图片尺寸
 * @param {HTMLCanvasElement} canvas - 原始canvas
 * @param {Object} pdfPage - PDF页面对象
 * @param {number} margin - 页面边距（现在忽略）
 * @returns {Object} 包含宽度和高度的对象
 */
export function calculateOptimalImageSize(canvas, pdfPage, margin = 0) {
  // 保持原始canvas的宽高比，不受PDF页面尺寸限制
  return {
    width: canvas.width,
    height: canvas.height
  }
}

/**
 * 添加图片到PDF（不分页，无边距）
 * @param {Object} pdf - jsPDF实例
 * @param {string} imgData - 图片数据
 * @param {Object} dimensions - 图片尺寸
 * @param {number} margin - 页面边距（忽略，保持兼容性）
 */
export function addImageWithPagination(pdf, imgData, dimensions, margin = 0) {
  // 直接添加图片，不分页，无边距，保持原始尺寸
  pdf.addImage(imgData, 'JPEG', 0, 0, dimensions.width, dimensions.height)
}

/**
 * 预设的压缩配置
 */
export const COMPRESSION_PRESETS = {
  // 高质量 (较大文件)
  HIGH_QUALITY: {
    scale: 2,
    quality: 0.9,
    format: 'jpeg'
  },
  // 中等质量 (平衡)
  MEDIUM_QUALITY: {
    scale: 1.5,
    quality: 0.7,
    format: 'jpeg'
  },
  // 低质量 (小文件)
  LOW_QUALITY: {
    scale: 1.2,
    quality: 0.5,
    format: 'jpeg'
  },
  // 极小文件
  MINIMAL_SIZE: {
    scale: 1,
    quality: 0.3,
    format: 'jpeg'
  }
}

/**
 * 完整的PDF导出优化函数
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {string} filename - 文件名
 * @param {Object} options - 配置选项
 */
export async function exportOptimizedPdf(element, filename, options = {}) {
  const html2canvas = (await import('html2canvas')).default
  const jsPDF = (await import('jspdf')).default

  // 应用预设配置
  const preset = options.preset ? COMPRESSION_PRESETS[options.preset] : COMPRESSION_PRESETS.MEDIUM_QUALITY
  const finalOptions = {
    quality: preset.quality,
    ...options,
    canvas: {
      scale: preset.scale,
      ...options.canvas
    }
  }

  // 获取优化配置
  const canvasConfig = getOptimizedHtml2CanvasConfig(finalOptions.canvas)

  // 生成canvas
  const canvas = await html2canvas(element, canvasConfig)

  // 压缩图片
  const imgData = compressCanvasImage(canvas, preset.format, finalOptions.quality)

  // 使用canvas的原始尺寸创建PDF，不使用标准页面格式
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'l' : 'p',
    unit: 'px',
    format: [canvas.width, canvas.height], // 使用canvas的确切尺寸
    compress: true,
    precision: 2
  })

  // 计算尺寸（现在就是canvas的原始尺寸）
  const dimensions = calculateOptimalImageSize(canvas, pdf.internal.pageSize, 0)

  // 添加图片（无边距，不分页）
  addImageWithPagination(pdf, imgData, dimensions, 0)

  // 保存文件
  pdf.save(filename)
}
