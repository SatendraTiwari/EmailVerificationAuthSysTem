import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const ChetbotApp = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const API_KEY = 'AIzaSyAvJrBH9GFqouVAaY8ih27-Zk_vktR7tQ4'; // Replace with your actual Gemini API key

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Load saved messages from localStorage when component mounts
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        // Save messages to localStorage whenever messages change
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        const newMessage = { text: inputMessage, sender: '' };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: inputMessage
                        }]
                    }]
                })
            });

            const data = await response.json();
            const botReply = data.candidates[0].content.parts[0].text;
            
            setMessages(prevMessages => [...prevMessages, { text: botReply, sender: 'bot' }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I encountered an error.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            <button>
                <Link to={"/signup"}>Signup</Link>
            </button>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Gemini Chatbot
                </h2>
                <div 
                    ref={chatContainerRef}
                    className="h-96 overflow-y-auto mb-4 p-4 bg-gray-700 rounded-lg"
                >
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`mb-2 p-2 rounded-lg ${
                                message.sender === 'user' ? 'bg-green-600 text-white ml-auto' : 'bg-gray-600 text-white'
                            } max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                        >
                            {message.text}
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block w-6 h-6 border-t-2 border-green-500 rounded-full"
                            />
                        </div>
                    )}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendMessage}
                        className="bg-green-500 text-white p-2 rounded-r-lg"
                    >
                        Send
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ChetbotApp;

