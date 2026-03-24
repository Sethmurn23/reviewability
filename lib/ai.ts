// lib/ai.ts - AI integration for review analysis
// Works in mock mode without API key

const isMockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_');

// Simple mock analysis for development
function mockAnalyze(content: string, rating: number) {
  const lower = content.toLowerCase();
  let sentiment = 'neutral';
  let urgency = 'low';
  
  if (rating <= 2 || lower.includes('terrible') || lower.includes('worst') || lower.includes('disappointed')) {
    sentiment = 'negative';
    urgency = rating === 1 ? 'high' : 'medium';
  } else if (rating >= 4 || lower.includes('great') || lower.includes('amazing') || lower.includes('perfect')) {
    sentiment = 'positive';
  }
  
  return {
    sentiment,
    sentimentScore: sentiment === 'positive' ? 0.85 : sentiment === 'negative' ? 0.15 : 0.5,
    topics: ['customer service', 'quality', 'delivery'],
    intent: sentiment === 'positive' ? 'compliment' : sentiment === 'negative' ? 'complaint' : 'suggestion',
    urgency,
    language: 'en',
  };
}

function mockGenerateResponse(review: string, businessName: string, tone: string) {
  const responses: Record<string, string> = {
    professional: `Thank you for your feedback about ${businessName}. We take all customer input seriously and appreciate you taking the time to share your experience.`,
    friendly: `Hey there! Thanks so much for your feedback on ${businessName}. We really appreciate you letting us know how we're doing!`,
    apologetic: `I personally apologize for your experience at ${businessName}. We truly value your business and I'm devastated we didn't meet your expectations.`,
  };
  return responses[tone] || responses.professional;
}

function mockGenerateInsights(reviews: any[]) {
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const positive = reviews.filter(r => r.rating >= 4).length;
  const negative = reviews.filter(r => r.rating <= 2).length;
  
  return {
    summary: `This period saw ${reviews.length} reviews with an average rating of ${avgRating.toFixed(1)} stars. ${positive} positive, ${negative} negative.`,
    trends: ['Rating stability', 'Service quality up', 'Delivery improvements'],
    anomalies: negative > positive ? ['Higher than usual negative reviews'] : [],
    recommendations: ['Continue positive momentum', 'Address any shipping concerns'],
  };
}

// Real OpenAI integration
async function realAnalyze(content: string, rating: number) {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const prompt = `Analyze this customer review and rating ${rating} stars:
"${content}"
Return JSON with: sentiment, sentimentScore (0-1), topics (array), intent, urgency, language`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function realGenerateResponse(review: string, businessName: string, tone: string) {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const prompt = `Generate a ${tone} response to this customer review for "${businessName}":
"${review}"
Keep it under 150 words, be specific and not robotic.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });

  return completion.choices[0].message.content;
}

async function realGenerateInsights(reviews: any[]) {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const reviewsText = reviews.map(r => `★${r.rating}: ${r.content}`).join('\n\n');
  
  const prompt = `Analyze these reviews and return JSON with: summary, trends (array), anomalies (array), recommendations (array)`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt + '\n\n' + reviewsText }],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
}

// Export functions that use mock or real based on env
export async function analyzeReview(content: string, rating: number) {
  if (isMockMode) {
    console.log('🤖 AI: Mock mode - using rule-based analysis');
    return mockAnalyze(content, rating);
  }
  return realAnalyze(content, rating);
}

export async function generateResponse(review: string, businessName: string, tone: string = 'professional') {
  if (isMockMode) {
    console.log('🤖 AI: Mock mode - using template response');
    return mockGenerateResponse(review, businessName, tone);
  }
  return realGenerateResponse(review, businessName, tone);
}

export async function generateInsights(reviews: any[]) {
  if (isMockMode) {
    console.log('🤖 AI: Mock mode - using summary analysis');
    return mockGenerateInsights(reviews);
  }
  return realGenerateInsights(reviews);
}

export const mockMode = isMockMode;
console.log(isMockMode ? '🤖 AI: MOCK mode (no API key)' : '🤖 AI: OpenAI connected');

export default { analyzeReview, generateResponse, generateInsights };