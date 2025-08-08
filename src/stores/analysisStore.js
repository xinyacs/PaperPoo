import { ref } from 'vue'

// 全局分析状态管理
const analysisCache = ref(new Map())
const currentAnalysisHash = ref(null)
const isAnalysisLoading = ref(false)

export const useAnalysisStore = () => {
  const setAnalysisResult = (hash, result) => {
    analysisCache.value.set(hash, result)
    currentAnalysisHash.value = hash
  }

  const getAnalysisResult = (hash) => {
    return analysisCache.value.get(hash)
  }

  const hasAnalysisResult = (hash) => {
    return analysisCache.value.has(hash)
  }

  const clearAnalysisResult = (hash) => {
    if (hash) {
      analysisCache.value.delete(hash)
    } else {
      analysisCache.value.clear()
    }
  }

  const setCurrentHash = (hash) => {
    currentAnalysisHash.value = hash
  }

  const getCurrentHash = () => {
    return currentAnalysisHash.value
  }

  const setLoading = (loading) => {
    isAnalysisLoading.value = loading
  }

  const isLoading = () => {
    return isAnalysisLoading.value
  }

  return {
    setAnalysisResult,
    getAnalysisResult,
    hasAnalysisResult,
    clearAnalysisResult,
    setCurrentHash,
    getCurrentHash,
    setLoading,
    isLoading
  }
}
