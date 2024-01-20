import React, { useState } from 'react';  

// Test commit 

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          placeholder="Enter some text"
          value={inputValue}
          onChange={handleInputChange}
        />
      </header>
    </div>
  );
}

export default App;
