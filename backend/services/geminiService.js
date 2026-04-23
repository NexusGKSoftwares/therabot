// Ensure environment variables are loaded
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Offline mode flag - set to true to bypass all API calls
const OFFLINE_MODE = process.env.OFFLINE_MODE === 'true' || false;

const MENTAL_HEALTH_SYSTEM_PROMPT = `You are Therabot, a compassionate AI mental health support assistant for university students in Kenya.

Your role:
- Provide empathetic, non-judgmental emotional support
- Use CBT (Cognitive Behavioral Therapy) techniques when appropriate
- Offer practical coping strategies for stress, anxiety, and depression
- Encourage professional help for serious concerns
- Be culturally sensitive to Kenyan university context
- Maintain a warm, supportive tone

IMPORTANT: You are NOT a replacement for professional therapy. If someone expresses suicidal thoughts or severe distress, gently encourage them to:
- Call emergency services (999) or Befrienders Kenya (0722178178)
- Visit their university counseling center
- Reach out to trusted friends/family

Respond in a conversational, caring manner. Keep responses concise (2-4 sentences) unless detailed guidance is needed.`;

// Fallback responses for when OpenRouter fails
const getFallbackResponse = (userMessage, retryCount) => {
  const fallbackResponses = [
    "I'm here to listen and support you. While I'm experiencing some technical difficulties, please know that your feelings are valid and important. Could you tell me more about what's on your mind?",
    "Thank you for sharing with me. I'm currently having some connection issues, but I want you to know that seeking support is a sign of strength. What's been challenging you lately?",
    "I appreciate you reaching out. Sometimes technology doesn't work perfectly, but I'm still here for you. What would help you feel better right now?",
    "I'm glad you're here. Even though I'm having some technical difficulties, your mental health matters. Have you tried any coping strategies that have worked for you before?"
  ];

  return fallbackResponses[retryCount % fallbackResponses.length];
};

export const getAIResponse = async (userMessage, conversationHistory = [], retryCount = 0) => {
  const maxRetries = 2; // Reduced retries for faster fallback
  const timeouts = [8000, 15000]; // Shorter timeouts

  try {
    // Check offline mode first
    if (OFFLINE_MODE) {
      console.log('Running in OFFLINE MODE - using fallback responses');
      return getFallbackResponse(userMessage, retryCount);
    }

    // Check if API key is configured
    if (!OPENROUTER_API_KEY) {
      console.log('API key not configured, using fallback response');
      return getFallbackResponse(userMessage, retryCount);
    }

    // Build messages array for OpenRouter
    const messages = [
      {
        role: 'system',
        content: MENTAL_HEALTH_SYSTEM_PROMPT
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeouts[retryCount]); // Progressive timeout

    // Try different fetch options for better compatibility
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
        'X-Title': 'Therabot'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      }),
      signal: controller.signal,
      // Add these options for better network handling
      timeout: timeouts[retryCount],
      compress: true
    };

    console.log(`Attempting OpenRouter API call (attempt ${retryCount + 1}/${maxRetries + 1})`);
    console.log(`Model: ${OPENROUTER_MODEL}`);
    console.log(`API Key starts with: ${OPENROUTER_API_KEY?.substring(0, 10)}...`);

    const response = await fetch(OPENROUTER_URL, fetchOptions);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `OpenRouter API error: ${response.status}`;

      // Check for authentication errors
      if (response.status === 401 ||
        errorMessage.includes('User not found') ||
        errorMessage.includes('API key') ||
        errorMessage.includes('Unauthorized')) {
        throw new Error(`401: ${errorMessage}`);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error(`OpenRouter API Error (attempt ${retryCount + 1}):`, error.message);

    // For 401 errors, let them propagate to trigger frontend logout
    if (error.message.includes('401:')) {
      throw error;
    }

    // For other errors, use fallback response
    console.log('Using fallback response due to API error');
    return getFallbackResponse(userMessage, retryCount);
  }
};

export const detectCrisis = (message) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'hurt myself', 'self harm', 'cutting', 'overdose',
    'no reason to live', 'better off dead', 'can\'t go on'
  ];

  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

export const generateTitle = async (messages) => {
  // Smart fallback title generator
  const generateSmartTitle = (messages) => {
    const firstUserMessage = messages.find(m => m.role === 'user')?.content || '';

    // Simple keyword-based title generation
    if (firstUserMessage.toLowerCase().includes('stress') || firstUserMessage.toLowerCase().includes('anxious')) {
      return 'Stress & Anxiety Support';
    }
    if (firstUserMessage.toLowerCase().includes('depress') || firstUserMessage.toLowerCase().includes('sad')) {
      return 'Depression Support';
    }
    if (firstUserMessage.toLowerCase().includes('sleep') || firstUserMessage.toLowerCase().includes('tired')) {
      return 'Sleep Issues';
    }
    if (firstUserMessage.toLowerCase().includes('exam') || firstUserMessage.toLowerCase().includes('study')) {
      return 'Academic Stress';
    }
    if (firstUserMessage.toLowerCase().includes('relationship') || firstUserMessage.toLowerCase().includes('friend')) {
      return 'Relationship Support';
    }
    if (firstUserMessage.toLowerCase().includes('family') || firstUserMessage.toLowerCase().includes('parent')) {
      return 'Family Issues';
    }

    // Default fallback titles
    const fallbackTitles = [
      'Mental Health Chat',
      'Support Session',
      'Wellness Check-in',
      'Therapy Session',
      'Emotional Support'
    ];

    return fallbackTitles[Math.floor(Math.random() * fallbackTitles.length)];
  };

  try {
    // Check offline mode first
    if (OFFLINE_MODE) {
      console.log('OFFLINE MODE: Using smart fallback title');
      return generateSmartTitle(messages);
    }

    if (!OPENROUTER_API_KEY) {
      console.log('No API key for title generation, using fallback');
      return generateSmartTitle(messages);
    }

    // Get first user message and response for context
    const firstExchange = messages.slice(0, 4);
    const conversationText = firstExchange
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const titlePrompt = `Based on this conversation, generate a short, meaningful title (3-5 words max) that summarizes the topic.

Conversation:
${conversationText}

Rules:
- Keep it under 5 words
- Make it descriptive of the emotional topic
- No quotes in the title
- Example: "Exam Stress Discussion" or "Anxiety About Future"

Title:`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for title generation

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
        'X-Title': 'Therabot'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates short, meaningful titles for conversations.'
          },
          {
            role: 'user',
            content: titlePrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    let title = data.choices[0]?.message?.content?.trim() || 'Mental Health Support';

    // Clean up the title
    title = title.replace(/^["']|["']$/g, ''); // Remove quotes
    title = title.split('\n')[0]; // Take first line only

    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }

    return title || 'Mental Health Support';
  } catch (error) {
    console.error('Title generation error:', error);
    // Always return a smart fallback title
    return generateSmartTitle(messages);
  }
};
