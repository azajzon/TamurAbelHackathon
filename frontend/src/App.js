import React, { useState } from 'react';  
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue('');
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
          My awesome chat
        </header>
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
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

export default App;
