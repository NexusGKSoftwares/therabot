import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const MENTAL_HEALTH_PROMPT = `You are Therabot, a compassionate AI mental health support assistant for university students in Kenya. 

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

export const getAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    
    // Build conversation context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: MENTAL_HEALTH_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am Therabot, ready to provide compassionate mental health support to students.' }],
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI response');
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
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    
    // Get first user message and response for context
    const firstExchange = messages.slice(0, 4);
    const conversationText = firstExchange
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');
    
    const prompt = `Based on this conversation, generate a short, meaningful title (3-5 words max) that summarizes the topic. 
    
Conversation:
${conversationText}

Rules:
- Keep it under 5 words
- Make it descriptive of the emotional topic
- No quotes in the title
- Example: "Exam Stress Discussion" or "Anxiety About Future"

Title:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let title = response.text().trim();
    
    // Clean up the title
    title = title.replace(/^["']|["']$/g, ''); // Remove quotes
    title = title.split('\n')[0]; // Take first line only
    
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    return title || 'Mental Health Support';
  } catch (error) {
    console.error('Title generation error:', error);
    // Fallback: use first user message excerpt
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      const excerpt = firstUserMsg.content.slice(0, 30);
      return excerpt + (firstUserMsg.content.length > 30 ? '...' : '');
    }
    return 'Mental Health Support';
  }
};
