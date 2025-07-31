import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { EMOJIS } from '../../constants';

interface MessageInputProps {
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const context = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || imagePreview) {
      context?.sendMessage({ text: text.trim(), imageUrl: imagePreview || undefined }, chatId);
      setText('');
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      setShowEmojis(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        }
        reader.readAsDataURL(file);
    }
  };

  const addEmoji = (emoji: string) => {
      setText(prev => prev + emoji);
  };

  return (
    <div className="p-4 border-t border-[#764ABC]/50 bg-[#2D1654]">
      {imagePreview && (
        <div className="relative w-24 h-24 mb-2 p-1 border border-[#764ABC] rounded-lg">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded"/>
            <button onClick={() => { setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg"><i className="fas fa-times"></i></button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 relative">
        <div className="relative">
            <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="p-2 text-2xl text-gray-400 hover:text-[#FFDE59]">
              😊
            </button>
            {showEmojis && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#3E1B6B] border border-[#764ABC] rounded-lg p-2 grid grid-cols-6 gap-2 z-10">
                    {EMOJIS.map(emoji => (
                        <button key={emoji} type="button" onClick={() => addEmoji(emoji)} className="text-2xl hover:scale-125 transition-transform">
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="file-upload"/>
        <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-xl text-gray-400 hover:text-[#FFDE59]"
            aria-label="Attach image"
        >
            <i className="fas fa-paperclip"></i>
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#3E1B6B] border border-[#764ABC]/50 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFDE59]"
        />
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center bg-[#FFDE59] rounded-full text-[#3E1B6B] text-xl hover:bg-[#ffcf2d] transition-colors flex-shrink-0"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
