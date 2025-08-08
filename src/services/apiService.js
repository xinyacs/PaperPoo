import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://127.0.0.1:1234';

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

// Fake service for development/testing - generates random mock data
// import { GoogleGenAI, Type } from "@google/genai";

// if (!import.meta.env.VITE_API_KEY) {
//     throw new Error("VITE_API_KEY environment variable not set");
// }

// const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

// Original schema and instructions kept for reference but commented out since we're using fake data
// const responseSchema = { ... };
// const sarcasticSystemInstruction = "...";
// const seriousSystemInstruction = "...";

// Mock data arrays for generating random responses
const sarcasticTitles = [
    "A Beautiful Disaster",
    "Nice Try, But Nope",
    "What Went Horribly Wrong",
    "How to Not Completely Fail Next Time",
    "The Art of Academic Self-Destruction",
    "A Masterclass in Missing the Point",
    "When Good Ideas Go Bad",
    "The Emperor's New Research"
];

const sarcasticSummaries = [
    "This paper reads like it was written by someone who heard about research through a game of telephone. The methodology is questionable at best, and the conclusions are about as solid as a house of cards in a hurricane.",
    "The author has successfully created a work that manages to be both overly complicated and painfully simple at the same time. It's like watching someone use a sledgehammer to crack a nut, then missing the nut entirely.",
    "This research appears to have been conducted with all the rigor of a casual weekend hobby. The data analysis is so creative, it belongs in an art gallery rather than an academic journal."
];

const sarcasticComments = [
    "Well, at least you tried... sort of.",
    "I've seen more convincing arguments in fortune cookies.",
    "This is what happens when ambition meets reality and reality wins.",
    "The bar was low, but somehow you managed to limbo under it.",
    "Points for creativity, minus points for everything else.",
    "It's not the worst thing I've ever read, but it's definitely in the running.",
    "Your confidence is admirable, your execution... less so."
];

const sarcasticProblems = [
    "The methodology has more holes than Swiss cheese",
    "The literature review appears to have been done with a blindfold on",
    "The data analysis is so creative it defies the laws of statistics",
    "The conclusions are based on wishful thinking rather than evidence",
    "The writing style makes academic jargon look accessible",
    "The research questions are about as clear as mud",
    "The sample size is smaller than my patience for this paper"
];

const sarcasticSuggestions = [
    "Maybe try reading some actual research before writing your own",
    "Consider hiring a statistician who actually understands statistics",
    "A basic writing course might work wonders for clarity",
    "Perhaps start with a smaller, more manageable research question",
    "Try using evidence to support your claims - it's all the rage these days",
    "Consider peer review before submission, preferably from actual peers",
    "Maybe take a break and come back when you have a clearer vision"
];

const seriousTitles = [
    "Critical Analysis Summary",
    "Methodological Assessment",
    "Structural and Content Issues",
    "Recommendations for Improvement",
    "Academic Standards Review",
    "Research Quality Evaluation"
];

const seriousComments = [
    "Requires substantial revision to meet academic standards.",
    "The current approach lacks methodological rigor.",
    "Significant improvements needed in data presentation.",
    "The theoretical framework needs strengthening.",
    "More comprehensive literature review required.",
    "Statistical analysis requires professional oversight.",
    "Clarity and precision must be improved throughout."
];

const seriousProblems = [
    "Insufficient sample size compromises statistical validity",
    "Methodology lacks proper controls and validation",
    "Literature review is incomplete and outdated",
    "Data analysis contains statistical errors",
    "Research questions are poorly defined",
    "Theoretical framework is inadequately developed",
    "Results interpretation exceeds data limitations"
];

const seriousSuggestions = [
    "Conduct a comprehensive literature review using current sources",
    "Implement proper statistical controls and validation procedures",
    "Clearly define research objectives and hypotheses",
    "Expand sample size to achieve statistical significance",
    "Seek consultation with subject matter experts",
    "Revise methodology to address identified limitations",
    "Improve data presentation with appropriate visualizations"
];

// Helper functions for generating random data
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomElements = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
const getRandomScore = (max) => Math.floor(Math.random() * max) + 1;

/**
 * Fake service that generates random mock data for paper analysis
 * @param {string} _paperText - Paper text (unused in fake service)
 * @param {boolean} isSeriousMode - Whether to use serious or sarcastic tone
 * @returns {Promise<Object>}
 */
export const roastMyPaper = async (_paperText, isSeriousMode) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    try {
        const titles = isSeriousMode ? seriousTitles : sarcasticTitles;
        const summaries = isSeriousMode ? seriousComments : sarcasticSummaries;
        const comments = isSeriousMode ? seriousComments : sarcasticComments;
        const problems = isSeriousMode ? seriousProblems : sarcasticProblems;
        const suggestions = isSeriousMode ? seriousSuggestions : sarcasticSuggestions;

        const result = {
            summary: {
                title: getRandomElement(titles),
                text: getRandomElement(summaries)
            },
            score: {
                title: getRandomElement(titles),
                overall: {
                    value: getRandomScore(isSeriousMode ? 60 : 40), // Serious mode gets slightly higher scores
                    comment: getRandomElement(comments)
                },
                creativity: {
                    value: getRandomScore(30),
                    comment: getRandomElement(comments)
                },
                grammar: {
                    value: getRandomScore(20),
                    comment: getRandomElement(comments)
                },
                structure: {
                    value: getRandomScore(10),
                    comment: getRandomElement(comments)
                }
            },
            majorProblems: {
                title: getRandomElement(titles),
                problems: getRandomElements(problems, 3 + Math.floor(Math.random() * 2)) // 3-4 problems
            },
            suggestions: {
                title: getRandomElement(titles),
                tips: getRandomElements(suggestions, 3 + Math.floor(Math.random() * 2)) // 3-4 suggestions
            }
        };

        return result;
    } catch (error) {
        console.error("Error in fake service:", error);
        throw new Error("Fake service encountered an error - this shouldn't happen!");
    }
};
