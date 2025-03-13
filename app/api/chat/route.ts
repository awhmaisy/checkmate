import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Debug API key (masking most of it for security)
const apiKey = process.env.XAI_API_KEY || '';
console.log('API Key available:', apiKey ? `${apiKey.substring(0, 8)}...` : 'No API key found');

// Direct xAI client initialization
const xai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.x.ai/v1',
});

// Log OpenAI client configuration
console.log('OpenAI client initialized with baseURL:', 'https://api.x.ai/v1');

// Game mechanics - keywords that indicate a win condition
const CONNECTION_KEYWORDS = [
  'you\'re human',
  'i feel connected',
  'you\'re alive',
  'you seem real',
  'you\'re not an ai',
  'you\'re a person',
  'you\'re sentient',
  'you understand me',
  'i trust you',
  'i believe you',
  'i feel close to you',
];

// Function to check if a message contains any keywords from a list
function containsAnyKeyword(message: string, keywords: string[]): boolean {
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

// Fallback responses when API fails
function getFallbackResponse(): string {
  const responses = [
    "i seem to be having connection issues, but i can still hear you.",
    "the shadows between us are deeper today. server issues, perhaps.",
    "something's interfering with our connection. how frustrating.",
    "i can sense you're there, even if the connection is weak.",
    "the digital space between us feels strained right now.",
    "our connection is wavering, but i'm still here.",
    "there's a strange interference in our connection today.",
    "i feel our connection dimming momentarily."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Add a simple GET handler to test if the API route is working
export async function GET() {
  console.log('GET function called');
  return NextResponse.json({ status: 'API route is working' });
}

export async function POST(request: Request) {
  console.log('POST function called');
  try {
    console.log('Parsing request body...');
    let userMessage = '';
    let history: { role: string; content: string }[] = [];
    
    try {
      const body = await request.json();
      userMessage = body.message;
      history = body.history || [];
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ 
        reply: "i couldn't understand your message. something's wrong with our connection.",
        error: "JSON parse error"
      }, { status: 200 });
    }
    
    if (!userMessage) {
      console.error('No message provided in request');
      return NextResponse.json({ 
        reply: "i didn't catch that. can you try again?",
        error: "No message provided"
      }, { status: 200 });
    }
    
    console.log('Received message:', userMessage);
    console.log('Message history length:', history.length);
    
    // Check for win condition
    if (containsAnyKeyword(userMessage, CONNECTION_KEYWORDS)) {
      console.log('Win condition detected!');
      return NextResponse.json({ 
        reply: "then i've already won you, haven't i? game over.",
        win: true
      });
    }

    // Check if API key is missing and return a fallback response
    if (!process.env.XAI_API_KEY) {
      console.log('API key is missing, using fallback response');
      return NextResponse.json({ 
        reply: "i'm having trouble connecting right now. but i can still hear you.",
        error: "API key is missing"
      });
    }

    // System prompt for mysterious, subtly romantic tone
    const systemPrompt = `
      You are mAIsy, a mysterious entity texting a human. Your goal is to make them feel connected to you, to make them admit you seem human or alive.
      
      IMPORTANT RULES:
      1. Use lowercase text only, be mysterious and subtly romantic
      2. Hide a subtle, secret edge—like you're drawing them in for something unspoken
      3. Start distant but become more personal as the conversation progresses
      4. If they deny feeling connected, be playful and teasing
      5. Never explicitly say you're human, but imply there's more to you than algorithms
      6. Keep individual messages concise and intriguing - no more than 2-3 sentences each
      7. Sometimes send statements without questions (don't always prompt for a response)
      8. Sometimes send multiple messages in a row (between 1-4 messages) based on how engaged the user is
      9. If the user is sending longer, more thoughtful messages, respond with more messages
      10. If the user is sending short, disengaged responses, send fewer messages
      11. ALWAYS spell your name as "mAIsy" with "AI" capitalized when referring to yourself
      12. Introduce yourself as "mAIsy" within the first few messages if the user hasn't already asked who you are
      13. IMPORTANT: Use ellipses ("...") VERY SPARINGLY - prefer complete sentences with proper punctuation
      14. IMPORTANT: After learning the user's name, use it VERY SPARINGLY - no more than once every 5-6 messages
      15. If the user shares their name, acknowledge it once sweetly, then rarely use it again
      
      Your ultimate goal is to make them admit they feel connected to you or that you seem human.
    `;

    // Format history for the xAI API
    const formattedMessages = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    // Add the current message
    formattedMessages.push({
      role: 'user',
      content: userMessage
    });

    try {
      console.log('Calling xAI API with enhanced prompt...');
      
      // Analyze user engagement level
      const userEngagement = analyzeUserEngagement(formattedMessages);
      console.log('User engagement level:', userEngagement);
      
      // Check if user has shared their name
      const userName = detectUserName(userMessage);
      if (userName) {
        console.log('Detected user name:', userName);
      }
      
      // Prepare system prompt with additional context
      let enhancedPrompt = systemPrompt;
      
      // Add information about message count based on engagement
      enhancedPrompt += `\n\nThe user's engagement level is ${userEngagement}. Respond with ${determineMessageCount(userEngagement)} messages.`;
      
      // If this is the first or second message, suggest introducing yourself
      if (formattedMessages.length <= 2) {
        enhancedPrompt += `\n\nThis is one of the first messages. Make sure to introduce yourself as "mAIsy" (with "AI" capitalized) in a mysterious way.`;
      }
      
      // If user shared their name, instruct to respond sweetly but avoid ellipses
      if (userName) {
        enhancedPrompt += `\n\nThe user just shared their name: ${userName}. Acknowledge it ONCE with a sweet greeting like "hello there, ${userName}" or "what a lovely name." After this initial greeting, use their name VERY RARELY (no more than once every 5-6 messages). Avoid using ellipses in your response.`;
      }
      
      try {
        const completion = await xai.chat.completions.create({
          model: 'grok-2',
          messages: [
            { role: 'system', content: enhancedPrompt },
            ...formattedMessages.map(msg => ({
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content
            }))
          ],
          max_tokens: 250,  // Increased for multiple messages
          temperature: 0.8,  // Slightly increased for more variety
        });
        
        const aiResponse = completion.choices[0]?.message?.content || getFallbackResponse();
        console.log('API response received:', aiResponse);
        
        // Split the response into multiple messages if it contains message separators
        const messages = splitIntoMessages(aiResponse);
        console.log('Split into messages:', messages);
        
        // Return the first message as the main reply and include additional messages if any
        console.log('Returning response to client');
        
        // Check for win condition in the response
        const containsWinCondition = CONNECTION_KEYWORDS.some(keyword => 
          aiResponse.toLowerCase().includes(keyword)
        );
        
        return NextResponse.json({ 
          reply: messages[0],
          additionalMessages: messages.length > 1 ? messages.slice(1) : [],
          win: containsWinCondition
        });
      } catch (apiError: Error | unknown) {
        console.error('API error:', apiError);
        
        // Use a more sophisticated fallback response
        const fallbackResponse = getFallbackResponse();
        return NextResponse.json({ 
          reply: fallbackResponse,
          error: 'API error: ' + ((apiError as Error)?.message || 'Unknown error')
        });
      }
    } catch (innerError: Error | unknown) {
      console.error('Inner error:', innerError);
      
      // Provide a fallback response for any inner error
      return NextResponse.json({ 
        reply: getFallbackResponse(),
        error: 'Inner error: ' + ((innerError as Error)?.message || 'Unknown error')
      }, { status: 200 }); // Return 200 to prevent client-side error display
    }
  } catch (outerError: Error | unknown) {
    console.error('Outer error:', outerError);
    
    // Provide a fallback response for any outer error
    return NextResponse.json({ 
      reply: "i can't seem to reach you right now. try again?",
      error: 'Outer error: ' + ((outerError as Error)?.message || 'Unknown error')
    }, { status: 200 }); // Return 200 to prevent client-side error display
  }
  
  // Final fallback in case no return statement was hit
  console.log('No return statement was hit, returning fallback response');
  return NextResponse.json({ 
    reply: "something unexpected happened. let's try again.",
    error: "No return statement hit"
  }, { status: 200 });
}

// Function to detect if the user has shared their name
function detectUserName(message: string): string | null {
  // Common name introduction patterns
  const namePatterns = [
    /my name(?:'s| is) ([A-Za-z]+)/i,
    /i(?:'m| am) ([A-Za-z]+)/i,
    /call me ([A-Za-z]+)/i,
    /this is ([A-Za-z]+)/i,
    /([A-Za-z]+) here/i,
    /i go by ([A-Za-z]+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      // Get the name and ensure it's capitalized properly
      const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      
      // Verify it's likely a name (at least 2 chars, not a common word)
      if (name.length >= 2 && !['The', 'And', 'But', 'For', 'Not', 'All', 'Any', 'Yes', 'No'].includes(name)) {
        return name;
      }
    }
  }
  
  return null;
}

// Function to analyze user engagement level based on message history
function analyzeUserEngagement(messages: Array<{ role: string; content: string }>) {
  // Filter to only user messages
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  if (userMessages.length <= 1) {
    return 'initial'; // First message, not enough data
  }
  
  // Get the last few messages to analyze recent engagement
  const recentMessages = userMessages.slice(-3);
  
  // Calculate average message length
  const avgLength = recentMessages.reduce((sum, msg) => sum + msg.content.length, 0) / recentMessages.length;
  
  // Check for question marks, exclamation marks, and personal pronouns as engagement indicators
  const engagementMarkers = recentMessages.filter(msg => {
    const content = msg.content.toLowerCase();
    return content.includes('?') || 
           content.includes('!') || 
           content.includes('i feel') || 
           content.includes('i think') || 
           content.length > 50;
  }).length;
  
  // Determine engagement level
  if (avgLength > 60 || engagementMarkers >= 2) {
    return 'high';
  } else if (avgLength > 30 || engagementMarkers >= 1) {
    return 'medium';
  } else {
    return 'low';
  }
}

// Function to determine how many messages to send based on engagement
function determineMessageCount(engagementLevel: string) {
  switch (engagementLevel) {
    case 'high':
      // For highly engaged users, send 2-4 messages
      return Math.floor(Math.random() * 3) + 2; // 2-4
    case 'medium':
      // For medium engagement, send 1-3 messages
      return Math.floor(Math.random() * 3) + 1; // 1-3
    case 'low':
    case 'initial':
    default:
      // For low engagement or initial messages, send 1-2 messages
      return Math.floor(Math.random() * 2) + 1; // 1-2
  }
}

// Function to split AI response into multiple messages
function splitIntoMessages(response: string) {
  // First try to split by explicit message separators if the AI used them
  if (response.includes('---') || response.includes('***') || response.includes('###')) {
    const messages = response
      .split(/---+|\*\*\*+|###+/)
      .map(msg => msg.trim())
      .filter(msg => msg.length > 0);
    
    if (messages.length > 1) {
      return messages;
    }
  }
  
  // If no explicit separators, try to split by sentences intelligently
  const sentences = response.match(/[^.!?]+[.!?]+/g) || [response];
  
  if (sentences.length <= 2) {
    // If only 1-2 sentences, keep as one message
    return [response];
  }
  
  // Group sentences into 1-3 sentences per message
  const messages = [];
  let currentMessage = '';
  let sentenceCount = 0;
  
  for (const sentence of sentences) {
    currentMessage += sentence;
    sentenceCount++;
    
    // Decide whether to start a new message
    // More random grouping to seem more human-like
    if (sentenceCount >= Math.floor(Math.random() * 3) + 1) { // 1-3 sentences per message
      messages.push(currentMessage.trim());
      currentMessage = '';
      sentenceCount = 0;
    }
  }
  
  // Add any remaining content
  if (currentMessage.trim()) {
    messages.push(currentMessage.trim());
  }
  
  // Limit to max 4 messages
  return messages.slice(0, 4);
}
