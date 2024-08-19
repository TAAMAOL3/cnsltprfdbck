import React, { useState } from 'react';
import LinkGenerator from './linkGenerator'; // Import the LinkGenerator

function TextMining() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [generatedLink, setGeneratedLink] = useState(''); // State for the generated link

  const handleAnalyze = async () => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    setResult(data);
  };

  // Function to generate a link using LinkGenerator
  const handleGenerateLink = () => {
    const randomString = LinkGenerator.randomString(10);
    const host = process.env.REACT_APP_URL_HOST; // Access the environment variable
    const link = `${host}/analyze?code=${randomString}`;
    setGeneratedLink(link);
  };
  

  return (
    <div>
      <h2>Textmining Analyse</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text eingeben..."
      />
      <button onClick={handleAnalyze}>Analysieren</button>
      
      <button onClick={handleGenerateLink}>Link Generieren</button> {/* Button to generate link */}
      {generatedLink && (
        <div>
          <h3>Generierter Link:</h3>
          <p>{generatedLink}</p>
        </div>
      )}

      {result && (
        <div>
          <h3>Ergebnis:</h3>
          <p>Score: {result.score}</p>
          <p>Sentiment: {result.sentiment}</p>
        </div>
      )}
    </div>
  );
}

export default TextMining;
