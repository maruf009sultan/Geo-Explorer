import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { BotIcon, UserIcon, MapPinIcon } from './Icons';

interface ChatMessageProps {
  message: ChatMessageType;
  onSuggestionClick: (query: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestionClick }) => {
  const { role, content, image, groundingChunks, mapSuggestions } = message;
  const isUser = role === 'user';
  const isPending = content === '...';

  return (
    <div className={`flex items-start gap-3 my-4 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isUser ? 'bg-gray-600' : 'bg-indigo-600'}`}>
        {isUser ? <UserIcon className="w-6 h-6 text-white" /> : <BotIcon className="w-6 h-6 text-white" />}
      </div>
      
      <div className={`max-w-xl p-4 rounded-2xl shadow-md ${isUser ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-lg' : 'bg-gray-700 rounded-bl-lg'}`}>
        <div className={`prose prose-invert prose-sm whitespace-pre-wrap break-words ${isPending ? 'animate-pulse' : ''}`}>{isPending ? "Thinking..." : content}</div>
        {image && <img src={image} alt="User upload" className="mt-4 rounded-lg max-w-xs shadow-xl" />}
        
        {mapSuggestions && mapSuggestions.length > 0 && (
          <div className="mt-4 border-t border-white/20 pt-3">
            <h4 className="text-xs font-semibold text-gray-300 mb-2">Did you mean:</h4>
            <div className="flex flex-col items-start gap-2">
              {mapSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-left text-sm text-indigo-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-md px-3 py-1.5 transition-all w-full flex items-center gap-3 group"
                >
                  <MapPinIcon className="w-4 h-4 flex-shrink-0 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
                  <span className="flex-1">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {groundingChunks && groundingChunks.length > 0 && (
          <div className="mt-4 border-t border-white/20 pt-3">
            <h4 className="text-xs font-semibold text-gray-300 mb-2">Sources:</h4>
            <ul className="list-none text-xs space-y-1 pl-0">
              {groundingChunks.map((chunk, index) => (
                <li key={index} className="truncate">
                  <a
                    href={chunk.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline inline-block"
                    title={chunk.uri}
                  >
                    {chunk.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;