/**
 * Generates an SVG animation that displays a sequence of words,
 * with the letters 'm', 's', 't', 'r' (in that order) highlighted in bold.
 * 
 * @param {string[]} wordList - Array of words to animate (must contain 'm','s','t','r' in order)
 * @param {Object} options - Optional configuration parameters
 * @param {number} options.width - SVG width (default: 500)
 * @param {number} options.height - SVG height (default: 150)
 * @param {number} options.fontSize - Font size in pixels (default: 40)
 * @param {number} options.duration - Duration per word in seconds (default: 2)
 * @param {string} options.fontFamily - Font family (default: "Times New Roman, serif")
 * @returns {string} - SVG markup as a string
 */
function generateMstrAnimation(wordList, options = {}) {
  // Default options
  const config = {
    width: options.width || 500,
    height: options.height || 150,
    fontSize: options.fontSize || 50,
    duration: options.duration || 2,
    fontFamily: options.fontFamily || "Times New Roman, serif"
  };
  
  // Validate words contain 'm', 's', 't', 'r' in that order
  const validWords = wordList.filter(word => containsMSTR(word));

  // Randomize order of words
  shuffle(validWords);

  // add 'mstr' as first word
  const finaleWordList = ["mstr"].concat(validWords);

  // Calculate animation timing
  const totalDuration = config.duration * finaleWordList.length;
  const singleWordPercentage = 100 / finaleWordList.length;
  const fadePercentage = singleWordPercentage * 0.2; // 20% of the word's time for fading
  
  // Generate SVG with styles and animations
  let svg = `<svg viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face {
      font-family: 'Times New Roman';
      font-style: normal;
      font-weight: normal;
    }
    
    text {
      font-family: ${config.fontFamily};
      font-size: ${config.fontSize}px;
      dominant-baseline: middle;
      text-anchor: middle;
    }
    
    .bold {
      font-weight: bold;
    }
    
    .grey {
      font-weight: normal;
      fill: grey;
    }
    
    @keyframes wordAnimation {
      0%, ${singleWordPercentage - fadePercentage}% {
        opacity: 1;
      }
      ${singleWordPercentage}%, 100% {
        opacity: 0;
      }
    }
    
    ${finaleWordList.map((_, i) => `
    #word${i+1} {
      opacity: 0;
      animation: wordAnimation ${totalDuration}s infinite;
      animation-delay: ${i * config.duration}s;
    }`).join('\n')}
  </style>
  
  <g id="animated-text">`;
  
  // Add each word with properly highlighted letters
  finaleWordList.forEach((word, index) => {
    const lowerWord = word.toLowerCase();
    
    // Find indices of m, s, t, r
    let mIndex = lowerWord.indexOf('m');
    let sIndex = lowerWord.indexOf('s', mIndex + 1);
    let tIndex = lowerWord.indexOf('t', sIndex + 1);
    let rIndex = lowerWord.indexOf('r', tIndex + 1);
    
    // Split the word into segments
    const segments = [
      { text: word.substring(0, mIndex), bold: false },
      { text: word.charAt(mIndex), bold: true },
      { text: word.substring(mIndex + 1, sIndex), bold: false },
      { text: word.charAt(sIndex), bold: true },
      { text: word.substring(sIndex + 1, tIndex), bold: false },
      { text: word.charAt(tIndex), bold: true },
      { text: word.substring(tIndex + 1, rIndex), bold: false },
      { text: word.charAt(rIndex), bold: true },
      { text: word.substring(rIndex + 1), bold: false }
    ];
    
    // Filter out empty segments
    const filteredSegments = segments.filter(segment => segment.text.length > 0);
    
    // Generate text element with spans
    svg += `
    <text id="word${index+1}" x="${config.width/2}" y="${config.height/2}">
      ${filteredSegments.map(segment => 
        `<tspan class="${segment.bold ? 'bold' : 'grey'}">${segment.text}</tspan>`
      ).join('')}
    </text>`;
  });
  
  // Close SVG
  svg += `
  </g>
</svg>`;
  
  return svg;
}

// Function to check if a word contains m,s,t,r in order
function containsMSTR(word) {
  const lowerWord = word.toLowerCase();
  let mIndex = lowerWord.indexOf('m');
  if (mIndex === -1) return false;
  
  let sIndex = lowerWord.indexOf('s', mIndex + 1);
  if (sIndex === -1) return false;
  
  let tIndex = lowerWord.indexOf('t', sIndex + 1);
  if (tIndex === -1) return false;
  
  let rIndex = lowerWord.indexOf('r', tIndex + 1);
  if (rIndex === -1) return false;
  
  return true;
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
