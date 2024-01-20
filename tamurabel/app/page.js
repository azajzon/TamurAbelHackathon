'use client'

import Image from "next/image";
import axios from 'axios';
import React, { useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, type: 'user' }]);
      setInputValue('');
  
      try {
        const response = await axios.post('/api/assistant', {
          userInput: inputValue});
  
        // simulate serverResponse, or a fake one
        setTimeout(() => {
          try {
            const serverResponse = response.data.message || "This is a simulated gray response message.";
            console.log("SERVER RESPONSE: ", response.data);
            console.log("RESPONSE: ", serverResponse);
            setMessages(currentMessages => [...currentMessages, { text: serverResponse, type: 'response' }]);
          } catch (error) {
            console.error('Error in set timeout:', error);
            // Handle any errors that might occur inside the setTimeout
          }
        }, 1000);
        
      } catch (error) {
        console.error('There was an error sending the message:', error);
        // could handle error here and maybe display message
        setMessages(messages => [...messages, { text: 'Error: Message could not be sent.', type: 'error' }]);
      }
    }
  };
  

  const handleKeyDown = (event) => {
    // Check if the pressed key is 'Enter'
    if (event.key === 'Enter') {
      handleSendClick();
    }
  };

  
  return (
    <div className="App">
      <div className="chat-container">
        <header className="chat-header">
          Student Counselor Chatbot
        </header>
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter some text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSendClick}>Send</button>
        </div>
      </div>
    </div>
  );
}
