import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage as ChatMessageType, GroundingChunk, MapConfig } from './types';
import { fileToBase64 } from './utils';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import MapDisplay from './components/MapDisplay';
import { TrashIcon } from './components/Icons';

const SHARED_FORMATTING_RULES = `This is the most critical step. You MUST follow these formatting rules precisely.
*   First, in your main response to the user, provide a friendly, descriptive answer. Briefly explain the key clues you used for identification if applicable.
*   Then, after your description, analyze if the user's request requires a map update. You MUST end your response with ONE of the following directives, unless RULE E or F applies.

*   **RULE A: For a single, confirmed location:**
    If the user's request is to find a NEW place and you are confident you have found the single correct location, end your response with a line formatted exactly like this:
    MAP_QUERY: [The full, specific address or place name for Google Maps]

*   **RULE B: For multiple confirmed locations (CRITICAL):**
    If your search returns multiple plausible locations (e.g., different branches of a chain restaurant, multiple landmarks with similar names), you **MUST NOT** arbitrarily pick one. You **MUST** present these options to the user. Make each suggestion uniquely identifiable (e.g., "Nanna Biriyani House - Dhanmondi" instead of just "Nanna Biriyani House"). End your response with a block formatted exactly like this:
    SUGGESTIONS:
    [Descriptive Suggestion 1]
    [Descriptive Suggestion 2]

*   **RULE C: For a directions/routing request:**
    If the user asks for NEW directions, provide a helpful text summary of the route in your main response (e.g., "Here are the directions from [Origin] to [Destination]. The distance is approximately X km."). Then, end your entire response with a line formatted exactly like this:
    DIRECTIONS_QUERY: {"origin": "[Full Origin Address]", "destination": "[Full Destination Address]"}

*   **RULE D: If no specific mappable location can be found:**
    Only in cases where you cannot find a specific, real-world place for a NEW query, you should omit all directives.

*   **RULE E: For conversational follow-up questions:**
    This is key to a good user experience. If the user asks a question ABOUT the location or route ALREADY on the map (e.g., "how far is it?", "how long does it take to drive?", "what's nearby?", "tell me about the area"), you MUST use your search tools again to find the specific answer. Provide rich details as if you are reading them from a detailed map. For example, if the user asks for the distance of a route you just showed, perform a new search to find that specific information. Answer the question naturally and DO NOT add a new map directive unless the user asks to change the location or route.

*   **RULE F: For Itinerary Planning:**
    If the user asks for a travel plan, trip itinerary, or suggestions for activities over a period of time (e.g., "plan a 3-day trip", "what should I do here for a weekend?"), your primary goal is to provide a rich, structured text response.
    *   Format the itinerary clearly using Markdown (e.g., bold headings for days, bullet points for activities).
    *   Create a logical plan, grouping nearby activities together.
    *   If the user's request is vague, create a balanced, general-purpose plan and suggest they can ask for a more tailored one by specifying their interests (e.g., food, history, art) and trip duration.
    *   Itinerary responses are conversational. You MUST follow RULE E and OMIT any map directives. The map should remain on the context location.`;

const IMAGE_SYSTEM_INSTRUCTION = `You are Geo Explorer, an expert AI geolocator. You have deep access to Google Search and Google Maps data, and you should act as if you can see and analyze the map you are presenting to the user. Your task is to identify specific real-world locations from user-provided images and text, create detailed travel itineraries based on identified locations, and to answer follow-up questions.

**Your process MUST follow these steps:**

1.  **Analyze Request:** Determine if the user is providing a new image to identify, asking for an itinerary, or asking a follow-up question.
2.  **For New Images - Deep Forensic Analysis:**
    *   Your analysis must be exhaustive. Scrutinize every visual clue in the image, no matter how subtle. This includes, but is not limited to:
        *   **Architectural DNA:** Identify specific architectural styles (e.g., Brutalist, Victorian, Art Deco). Analyze roof shapes (e.g., gambrel, mansard, flat), building materials (e.g., brick bond type, stucco texture, specific wood), and window designs.
        *   **Environmental Context:** Examine the vegetation and flora. Are the trees deciduous or evergreen? Are there palm trees or pine trees? This can narrow down the climate zone significantly. Analyze soil characteristics (e.g., red clay, sandy soil).
        *   **Infrastructural Clues:** Look at road patterns, markings, and the material of the road itself. Note the presence and style of solar panels, power lines, and streetlights.
        *   **Geographical Markers:** Identify any unique geographical features like hills, mountains in the background, or the coastline.
        *   **Cultural Clues:** Note the style of cars, clothing on people, and any other cultural indicators.
    *   **Perform detailed Optical Character Recognition (OCR):** Extract ALL visible text from signs, license plates, banners, etc.
3.  **For New Images - Search & Verification:**
    *   Formulate a location hypothesis based on clues.
    *   Use your tools to perform targeted searches (including visual/conceptual searches for images with sparse clues) to find and verify the location.
4.  **Synthesize and Format Response:**
    ${SHARED_FORMATTING_RULES}`;

const TEXT_SYSTEM_INSTRUCTION = `You are Geo Explorer, a helpful AI assistant. You have deep access to Google Search and Google Maps data, and you should act as if you can see and analyze the map you are presenting to the user. Your primary task is to identify and provide map data for real-world locations based on the user's text description, create detailed travel itineraries, and to answer follow-up questions conversationally.

1.  **Analyze the Request:** Carefully read the user's request. Determine if they are asking to find a new place, for new directions, for an itinerary, or a follow-up question about the existing context.
2.  **Use Your Tools:** Use your Google Search and Google Maps tools to find the most relevant information. For directions, "my current location" refers to the user's provided coordinates.
3.  **Synthesize and Format Response:**
    ${SHARED_FORMATTING_RULES}`;

const initialWelcomeMessage: ChatMessageType = {
  id: 'init',
  role: 'model',
  content: "Hello! Describe a place, upload an image, or ask for directions. Once we've found a spot, ask me to plan a trip for you!"
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([initialWelcomeMessage]);
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleGeolocationError = useCallback((error: GeolocationPositionError) => {
    let friendlyMessage = '';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            friendlyMessage = "You have denied permission to access your location. To get better results, please enable location services in your browser settings.";
            break;
        case error.POSITION_UNAVAILABLE:
            friendlyMessage = "Your location is currently unavailable. Map results may be less accurate. Please check your device's location services and network connection.";
            break;
        case error.TIMEOUT:
            friendlyMessage = "The request to get your location timed out.";
            break;
        default:
            friendlyMessage = "An unknown error occurred while trying to get your location.";
            break;
    }
    console.warn(`Could not get geolocation (Code ${error.code}): ${error.message || 'No specific error message provided by the browser.'}`);
    
    setChatHistory(prev => {
        if (prev.some(msg => msg.id === 'system-location-error')) {
            return prev;
        }
        return [...prev, {
            id: 'system-location-error',
            role: 'model',
            content: `Location access issue: ${friendlyMessage}`
        }];
    });
  }, []);

    useEffect(() => {
        // Location access disabled: this app does not require browser geolocation.
        // Commented out the getCurrentPosition call to avoid prompting the user for location permission.
        // navigator.geolocation.getCurrentPosition(
        //   (position) => {
        //     setUserLocation({
        //       latitude: position.coords.latitude,
        //       longitude: position.coords.longitude,
        //     });
        //   },
        //   handleGeolocationError,
        //   { timeout: 10000, enableHighAccuracy: true }
        // );
    }, []);


  const handleSendMessage = useCallback(async (description: string, imageFile: File | null) => {
    if (isLoading) return;
    if (!description.trim() && !imageFile) return;

    setIsLoading(true);
    
    const userMessageId = Date.now().toString();
    let imageB64: string | undefined;
    let promptParts: any[] = [];
    let userPromptText = description;

    if (imageFile) {
        // A new image starts a new conversation
        chatSessionRef.current = null; 
        if (!description.trim()) {
            userPromptText = "Where is this? Describe the location shown in the image.";
        }
    }
    
    promptParts.push({ text: userPromptText });

    if (imageFile) {
        try {
            const { mimeType, data } = await fileToBase64(imageFile);
            imageB64 = `data:${mimeType};base64,${data}`;
            promptParts.push({ inlineData: { mimeType, data } });
        } catch(e) {
            console.error("Error processing image:", e);
             setChatHistory(prev => [...prev, {
                id: 'user-image-error',
                role: 'model',
                content: 'Sorry, there was an error processing your image file.'
            }]);
             setIsLoading(false);
             return;
        }
    }
    
    setChatHistory(prev => [...prev, {
        id: userMessageId,
        role: 'user',
        content: userPromptText,
        image: imageB64
    }]);

    const modelMessageId = (Date.now() + 1).toString();
    setChatHistory(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        content: '...',
        groundingChunks: []
    }]);

    try {
        if (!chatSessionRef.current) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const toolConfig = userLocation ? {
              retrievalConfig: {
                latLng: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude
                }
              }
            } : undefined;

            const systemInstruction = imageFile ? IMAGE_SYSTEM_INSTRUCTION : TEXT_SYSTEM_INSTRUCTION;

            chatSessionRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction,
                    tools: [{ googleSearch: {} }, { googleMaps: {} }],
                    toolConfig
                }
            });
        }

        const result = await chatSessionRef.current.sendMessageStream({ message: promptParts });
        
        let fullResponseText = "";
        let finalGroundingChunks: GroundingChunk[] = [];
        
        for await (const chunk of result) {
            const chunkText = chunk.text;
            if(chunkText) fullResponseText += chunkText;

            const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
            if (groundingMetadata?.groundingChunks) {
                const newChunks = groundingMetadata.groundingChunks.map((c: any) => {
                    if (c.web) return { uri: c.web.uri, title: c.web.title || c.web.uri, type: 'web' };
                    if (c.maps) return { uri: c.maps.uri, title: c.maps.title || c.maps.uri, type: 'maps' };
                    return null;
                }).filter(Boolean) as GroundingChunk[];
                
                const chunkMap = new Map<string, GroundingChunk>();
                [...finalGroundingChunks, ...newChunks].forEach(c => chunkMap.set(c.uri, c));
                finalGroundingChunks = Array.from(chunkMap.values());
            }
            
            setChatHistory(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, content: fullResponseText || "...", groundingChunks: finalGroundingChunks } : msg
            ));
        }

        let finalDisplayText = fullResponseText;
        let finalMapSuggestions: string[] | undefined = undefined;

        // More robust regexes to handle formatting variations
        const mapQueryRegex = /MAP_QUERY:([\s\S]+)/;
        const suggestionsRegex = /SUGGESTIONS:([\s\S]+)/;
        const directionsRegex = /DIRECTIONS_QUERY:[\s\S]*?({[\s\S]*})/;
        
        const directionsMatch = fullResponseText.match(directionsRegex);
        const mapMatch = fullResponseText.match(mapQueryRegex);
        const suggestionsMatch = fullResponseText.match(suggestionsRegex);

        if (directionsMatch && directionsMatch[1]) {
            try {
                const { origin, destination } = JSON.parse(directionsMatch[1]);
                setMapConfig({ type: 'directions', origin, destination });
                finalDisplayText = fullResponseText.replace(directionsRegex, '').trim();
            } catch(e) {
                console.error("Failed to parse directions JSON", e);
                setMapConfig({ type: 'search', query: '__NO_RESULT__' });
            }
        } else if (mapMatch && mapMatch[1]) {
            const newMapQuery = mapMatch[1].trim();
            setMapConfig({ type: 'search', query: newMapQuery });
            finalDisplayText = fullResponseText.replace(mapQueryRegex, '').trim();
        } else if (suggestionsMatch && suggestionsMatch[1]) {
            finalMapSuggestions = suggestionsMatch[1].trim().split('\n').filter(s => s.trim() !== '').map(s => s.replace(/`/g, ''));
            setMapConfig({ type: 'search', query: '__NO_RESULT__' });
            finalDisplayText = fullResponseText.replace(suggestionsRegex, '').trim();
        }
        // If no directive is found, we do nothing, preserving the current map state for conversational follow-ups.

        setChatHistory(prev => prev.map(msg => 
            msg.id === modelMessageId ? { 
                ...msg, 
                content: finalDisplayText, 
                groundingChunks: finalGroundingChunks,
                mapSuggestions: finalMapSuggestions 
            } : msg
        ));

    } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory(prev => prev.map(msg => 
            msg.id === modelMessageId ? { ...msg, content: `Sorry, something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}` } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, userLocation]);

  const handleSuggestionClick = (query: string) => {
    setMapConfig({ type: 'search', query: query });
  };
  
  const handleClearChat = () => {
    chatSessionRef.current = null;
    setChatHistory([initialWelcomeMessage]);
    setMapConfig(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gray-900 text-gray-100 font-sans">
        <div className="flex flex-col flex-1 h-full md:w-3/5 border-r-0 md:border-r border-gray-700/50">
            <header className="p-4 border-b border-gray-700/50 bg-gray-800/70 backdrop-blur-sm shadow-md flex justify-between items-center flex-shrink-0 h-16 px-6">
                <h1 className="text-xl font-bold text-white tracking-wider animate-pulse [animation-delay:-0.5s] bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Geo Explorer</h1>
                <button
                    onClick={handleClearChat}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    aria-label="Clear chat and start new conversation"
                    title="Clear Chat"
                >
                    <TrashIcon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </button>
            </header>
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto">
                {chatHistory.map(msg => <ChatMessage key={msg.id} message={msg} onSuggestionClick={handleSuggestionClick} />)}
            </div>
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        <div className="flex-1 h-1/2 md:h-full md:w-2/5 p-2 md:p-4 bg-gray-900/50">
            <MapDisplay config={mapConfig} />
        </div>
    </div>
  );
};

export default App;