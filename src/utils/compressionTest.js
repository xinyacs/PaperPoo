/**
 * PDF压缩效果测试工具
 * 用于比较不同压缩设置的效果
 */

import { COMPRESSION_PRESETS, exportOptimizedPdf } from './pdfOptimizer.js'

/**
 * 估算文件大小（基于base64字符串长度）
 * @param {string} base64String - base64编码的图片数据
 * @returns {number} 估算的文件大小（字节）
 */
function estimateFileSize(base64String) {
  // 移除data:image前缀
  const base64Data = base64String.split(',')[1] || base64String
  // base64编码大约比原始数据大33%
  return Math.round((base64Data.length * 3) / 4)
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化的文件大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 测试不同压缩预设的效果
 * @param {HTMLElement} element - 要测试的DOM元素
 * @returns {Promise<Object>} 测试结果
 */
export async function testCompressionPresets(element) {
  const html2canvas = (await import('html2canvas')).default
  const results = {}

  console.log('🧪 开始测试PDF压缩效果...')

  for (const [presetName, preset] of Object.entries(COMPRESSION_PRESETS)) {
    try {
      console.log(`📊 测试预设: ${presetName}`)
      
      // 生成canvas
      const canvas = await html2canvas(element, {
        scale: preset.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#111827',
        logging: false
      })

      // 生成压缩图片
      const imgData = canvas.toDataURL(`image/${preset.format}`, preset.quality)
      
      // 估算文件大小
      const estimatedSize = estimateFileSize(imgData)
      
      results[presetName] = {
        preset,
        estimatedSize,
        formattedSize: formatFileSize(estimatedSize),
        canvasSize: {
          width: canvas.width,
          height: canvas.height
        }
      }

      console.log(`   ✅ ${presetName}: ${formatFileSize(estimatedSize)}`)
    } catch (error) {
      console.error(`   ❌ ${presetName} 测试失败:`, error)
      results[presetName] = {
        preset,
        error: error.message
      }
    }
  }

  // 计算压缩比
  const highQualitySize = results.HIGH_QUALITY?.estimatedSize
  if (highQualitySize) {
    Object.keys(results).forEach(presetName => {
      if (results[presetName].estimatedSize) {
        const compressionRatio = ((highQualitySize - results[presetName].estimatedSize) / highQualitySize * 100).toFixed(1)
        results[presetName].compressionRatio = `${compressionRatio}%`
      }
    })
  }

  console.log('📈 压缩测试完成!')
  console.table(Object.entries(results).map(([name, data]) => ({
    预设: name,
    文件大小: data.formattedSize || 'Error',
    压缩比: data.compressionRatio || 'N/A',
    分辨率: data.preset ? `${data.preset.scale}x` : 'N/A',
    质量: data.preset ? data.preset.quality : 'N/A'
  })))

  return results
}

/**
 * 在控制台显示压缩建议
 * @param {Object} testResults - 测试结果
 */
export function showCompressionRecommendations(testResults) {
  console.log('\n💡 压缩建议:')
  
  const sizes = Object.entries(testResults)
    .filter(([_, data]) => data.estimatedSize)
    .sort((a, b) => a[1].estimatedSize - b[1].estimatedSize)

  if (sizes.length > 0) {
    const smallest = sizes[0]
    const largest = sizes[sizes.length - 1]
    
    console.log(`🏆 最小文件: ${smallest[0]} (${smallest[1].formattedSize})`)
    console.log(`📏 最大文件: ${largest[0]} (${largest[1].formattedSize})`)
    
    if (largest[1].estimatedSize > 10 * 1024 * 1024) { // 10MB
      console.log('⚠️  建议使用 LOW_QUALITY 或 MINIMAL_SIZE 预设以减少文件大小')
    } else if (largest[1].estimatedSize > 5 * 1024 * 1024) { // 5MB
      console.log('💡 建议使用 MEDIUM_QUALITY 或 LOW_QUALITY 预设')
    } else {
      console.log('✅ 当前文件大小合理，可以使用任何预设')
    }
  }
}

/**
 * 快速测试当前页面的压缩效果
 * 在浏览器控制台中调用此函数
 */
export async function quickCompressionTest() {
  // 查找可能的导出元素
  const testElement = document.querySelector('[data-export]') || 
                     document.querySelector('.results') ||
                     document.querySelector('main') ||
                     document.body

  if (!testElement) {
    console.error('❌ 未找到可测试的元素')
    return
  }

  console.log('🎯 测试元素:', testElement.tagName, testElement.className)
  
  const results = await testCompressionPresets(testElement)
  showCompressionRecommendations(results)
  
  return results
}

// 在开发环境中将函数暴露到全局作用域
if (import.meta.env.DEV) {
  window.quickCompressionTest = quickCompressionTest
  window.testCompressionPresets = testCompressionPresets
}
