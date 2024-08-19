const fs = require('fs');
const path = require('path');

// Funktion zum Bereinigen des Textes
const cleanText = (text) => {
  return text.replace(/[^\w\s]/gi, '').toLowerCase();
};

// Funktion zum Laden der Wörter aus den Textdateien
const loadWords = (filePath) => {
  const fullPath = path.join(__dirname, '..', 'resources', filePath);
  const words = fs.readFileSync(fullPath, 'utf8').split('\n').map(word => word.trim());
  return words;
};

const analyzeText = (text) => {
  const positiveWords = loadWords('positiveWords.txt');
  const negativeWords = loadWords('negativeWords.txt');

  let score = 0;
  let foundWords = 0;

  // Text bereinigen und analysieren
  const cleanedText = cleanText(text);
  const words = cleanedText.split(/\s+/);

  words.forEach(word => {
    if (positiveWords.includes(word)) {
      score += 1;
      foundWords += 1; // Ein Wort aus der positiven Liste wurde gefunden
    } else if (negativeWords.includes(word)) {
      score -= 1;
      foundWords += 1; // Ein Wort aus der negativen Liste wurde gefunden
    }
  });

  return { score, foundWords };
};

const classifySentiment = (score, foundWords) => {
  // Wenn keine Wörter gefunden wurden, die mit den Listen übereinstimmen
  if (foundWords === 0) {
    return 'Unbekannt';
  }

  // Klassifizierung des Sentiments basierend auf dem Score
  if (score >= 3) {
    return 'Sehr positiv';
  } else if (score >= 1 && score <= 2) {
    return 'Positiv';
  } else if (score === 0) {
    return 'Neutral';
  } else if (score <= -1 && score >= -2) {
    return 'Negativ';
  } else if (score <= -3) {
    return 'Sehr negativ';
  }

  return 'Unbekannt';
};

const textMining = (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.json({ score: 0, sentiment: 'Unbekannt' });
  }

  const { score, foundWords } = analyzeText(text);
  const sentiment = classifySentiment(score, foundWords);

  return res.json({ score, sentiment });
};

module.exports = {
  textMining
};
