import React, { useState, useRef } from 'react';
import { SendIcon, PaperclipIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (description: string, image: File | null) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!description.trim() && !image) || isLoading) return;
    onSendMessage(description, image);
    setDescription('');
    clearImage();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50 flex-shrink-0">
      {imagePreview && (
        <div className="mb-3 relative w-24 group">
          <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow-lg" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 leading-none w-6 h-6 flex items-center justify-center text-sm ring-2 ring-gray-800 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
            aria-label="Remove image"
          >
            &#x2715;
          </button>
        </div>
      )}
      <div className="hidden">
          {/* This input is visually hidden but used for the label to trigger the file picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="image-upload"
          />
      </div>
      <div className="flex items-end gap-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe a place, ask for directions, or plan a trip..."
          className="flex-1 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          rows={2}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent new line on submit
                handleSubmit(e);
            }
          }}
        />
        <label htmlFor="image-upload" className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors h-full flex items-center">
          <PaperclipIcon className="w-6 h-6 text-gray-400" />
        </label>
        <button
          type="submit"
          disabled={isLoading || (!description.trim() && !image)}
          className="p-3 bg-indigo-600 rounded-lg disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transform hover:scale-105 active:scale-95 h-full"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6 text-white" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
