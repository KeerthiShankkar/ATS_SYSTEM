import { pipeline } from '@xenova/transformers';
import * as math from 'mathjs';

let embedder = null;

export async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

// Cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = math.dot(vecA, vecB);
  const normA = math.norm(vecA);
  const normB = math.norm(vecB);
  return dotProduct / (normA * normB);
}

function extractEmbedding(embedding) {
  console.log('Full embedding structure:', embedding);
  console.log('Embedding shape:', embedding.dims || 'no dims');
  
  if (embedding.data && embedding.dims) {
    const [batchSize, seqLen, hiddenSize] = embedding.dims;
    console.log(`Dimensions: batch=${batchSize}, seq=${seqLen}, hidden=${hiddenSize}`);
    
    const tokenVectors = [];
    for (let i = 0; i < seqLen; i++) {
      const tokenVector = [];
      for (let j = 0; j < hiddenSize; j++) {
        tokenVector.push(embedding.data[i * hiddenSize + j]);
      }
      tokenVectors.push(tokenVector);
    }
    
    const pooled = new Array(hiddenSize).fill(0);
    for (let i = 0; i < seqLen; i++) {
      for (let j = 0; j < hiddenSize; j++) {
        pooled[j] += tokenVectors[i][j];
      }
    }
    
    return pooled.map(val => val / seqLen);
  } else if (embedding.data) {
    return Array.from(embedding.data);
  } else if (Array.isArray(embedding)) {
    return embedding;
  } else {
    throw new Error('Unexpected embedding structure');
  }
}

export async function getSimilarity(textA, textB) {
  try {
    const embed = await getEmbedder();

    const embA = await embed(textA);
    const embB = await embed(textB);

    const vecA = extractEmbedding(embA);
    const vecB = extractEmbedding(embB);

    return cosineSimilarity(vecA, vecB);
  } catch (error) {
    console.error('Error in getSimilarity:', error);
    throw error;
  }
}