import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Conversation from '../models/Conversation.js';
import { getAIResponse, detectCrisis, generateTitle } from '../services/geminiService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply optional auth to all routes
router.use(optionalAuth);

// @route   POST /api/chat
// @desc    Send message to chatbot
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const currentSessionId = sessionId || uuidv4();

    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId: currentSessionId });
    if (!conversation) {
      conversation = new Conversation({
        sessionId: currentSessionId,
        user: userId,
        messages: []
      });
    }

    // If user is authenticated and conversation has no user, associate it
    if (userId && !conversation.user) {
      conversation.user = userId;
    }

    // Check for crisis keywords
    const isCrisis = detectCrisis(message);
    if (isCrisis) {
      conversation.isCrisisFlagged = true;
    }

    // Prepare conversation history for context (last 10 messages)
    const recentHistory = conversation.messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await getAIResponse(message, recentHistory);

    // Add messages to conversation
    conversation.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );

    // Generate title if conversation has at least 2 messages and no title yet
    if (conversation.messages.length >= 2 && conversation.title === 'New Conversation') {
      try {
        const newTitle = await generateTitle(conversation.messages);
        conversation.title = newTitle;
        await conversation.save();
      } catch (titleError) {
        console.error('Title generation failed:', titleError);
      }
    }

    await conversation.save();

    res.json({
      sessionId: currentSessionId,
      response: aiResponse,
      isCrisis,
      title: conversation.title,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      message: 'Failed to process message',
      error: error.message
    });
  }
});

// @route   GET /api/chat/history/:sessionId
// @desc    Get conversation history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({
      sessionId: conversation.sessionId,
      messages: conversation.messages,
      isCrisisFlagged: conversation.isCrisisFlagged,
    });
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

// @route   POST /api/chat/new
// @desc    Start new conversation
router.post('/new', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const userId = req.user ? req.user._id : null;

    const conversation = new Conversation({
      sessionId,
      user: userId,
      messages: [{
        role: 'assistant',
        content: 'Hello! I\'m Therabot, your mental health companion. I\'m here to listen and support you. How are you feeling today?',
        timestamp: new Date(),
      }],
    });

    await conversation.save();

    res.json({
      sessionId,
      welcomeMessage: conversation.messages[0],
    });
  } catch (error) {
    console.error('New Chat Error:', error);
    res.status(500).json({ message: 'Failed to start new chat' });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get all conversations (summary) - filter by user if authenticated
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;

    // Build query - if authenticated, show user's conversations + anonymous ones from this session
    // If anonymous, only show conversations without a user (anonymous ones)
    let query = {};
    if (userId) {
      query = { user: userId };
    } else {
      query = { user: null };
    }

    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .select('sessionId createdAt updatedAt messages isCrisisFlagged title');

    // Get first user message as title, or default
    const formatted = conversations.map(conv => ({
      sessionId: conv.sessionId,
      title: conv.title || 'New Conversation',
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messageCount: conv.messages.length,
      isCrisisFlagged: conv.isCrisisFlagged,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('List Error:', error);
    res.status(500).json({ message: 'Failed to list conversations' });
  }
});

// @route   DELETE /api/chat/conversations/:sessionId
// @desc    Delete a conversation
router.delete('/conversations/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await Conversation.findOneAndDelete({ sessionId });

    if (!result) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Failed to delete conversation' });
  }
});

export default router;
