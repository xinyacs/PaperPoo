import axios from 'axios';

// API base URL
const API_BASE_URL = 'https://pp.airesource.tech/api';

/**
 * Upload file for analysis
 * @param {File} file - The PDF file to analyze
 * @param {boolean} serious - Whether to use serious mode (default: true)
 * @param {string} locate - Language locale (default: 'zh')
 * @returns {Promise<Object>} Response containing analysis hash
 */
export const uploadFileForAnalysis = async (file, serious = true, locate = 'zh') => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('serious', serious.toString());

        const response = await axios.post(
            `${API_BASE_URL}/analysis/analysis?locate=${locate}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'accept': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading file for analysis:', error);
        throw new Error(`Failed to upload file: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Get analysis result by hash
 * @param {string} hash - The analysis hash returned from upload
 * @returns {Promise<Object>} Analysis result
 */
export const getAnalysisResult = async (hash) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/analysis/result?hash=${hash}`,
            {
                headers: {
                    'accept': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error getting analysis result:', error);
        throw new Error(`Failed to get analysis result: ${error.response?.data?.message || error.message}`);
    }
};
