/* eslint-disable no-mixed-spaces-and-tabs */
import { MarkdownRenderChild } from 'obsidian';


export class BionicReadingView extends MarkdownRenderChild {
  static ALL_EMOJIS: Record<string, string> = {
    ":+1:": "👍",
    ":sunglasses:": "😎",
    ":smile:": "😄",
  };

  text: string;

  constructor(containerEl: HTMLElement, text: string) {
    super(containerEl);
    this.text = containerEl.innerText;
  }

  async onload() {
    // const emojiEl = this.containerEl.createSpan({
    //   text: BionicReadingView.ALL_EMOJIS[this.text] ?? this.text,
    // });
    //this.containerEl.replaceWith(emojiEl);
	//this.containerEl.innerHTML = bionicReading(this.text);
	console.log("Outer HTML: " + this.containerEl.outerHTML);
	console.log("Inner HTML: " + this.containerEl.innerHTML);
	console.log("Text:" + this.text)
	console.log("BionicReading HTML: " + bionicReading(this.text));
	console.log("BionicReading HTML (escape): " + escape(bionicReading(this.text)));
	//this.containerEl.innerHTML = this.containerEl.outerHTML.replace(this.text, bionicReading(this.text));
	
	
	this.containerEl.innerHTML = bionicReading(this.text);


	// const book = this.containerEl.createEl("div", { cls: "book" });
	// book.createEl("div", { text: "How to Take Smart Notes", cls: "book__title" });
	// book.createEl("small", { text: "Sönke Ahrens", cls: "book__author" });


  }

}



function bionicReading(text) {


    // Erstellen Sie eine Liste von Stoppwörtern
    const stopWords = ['und', 'oder', 'aber', 'am', 'an', 'Tags'];

    // Analyse des Textes und Identifizierung von Schlüsselwörtern oder -silben
    const keywords = analyzeText(text);

    console.log("KEYWORDS:")
    console.log(keywords)

    // Hervorhebung der Schlüsselwörter oder -silben im Text

    let highlightedText = text;

  
    for (const word of keywords) {

        // Überspringen des aktuellen Worts, wenn es ein Stoppwort ist
        // if (stopWords.includes(word.toLowerCase())) {
		// 	console.log("Stop Word found: " + word)
        //     continue;
        // }

        // Erweitere isValidKeyword um Sonderzeichen
        const isValidKeyword = /^[a-zA-Z0-9-_.,;:!?äöüÄÖÜ"]+$/i.test(word) && !/^[\d-.]+$/i.test(word);

        if (isValidKeyword) {
            let regexWord = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');  // Escape special characters for regex
            const regex = new RegExp(`\\b${regexWord}\\b`, 'gi');

            highlightedText = highlightedText.replace(regex, function(matchedWord){
				regexWord = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');  // Escape special characters for regex
                if (regexWord.length % 2 === 0) {
                    const middleIndex = matchedWord.length / 2;
                    return `<span class="bionic-reading-style">${matchedWord.substring(0, middleIndex)}</span>${matchedWord.substring(middleIndex)}`
                } else {
                    const middleIndex = Math.floor((matchedWord.length) / 2);
					if(matchedWord == "Notiere")
					{
						console.log("Found Notiere")
					}
                    return `<span class="bionic-reading-style">${matchedWord.substring(0, middleIndex+1)}</span>${matchedWord.replace(matchedWord.substring(0, middleIndex+1), "")}`;

                }
            });
            
        } else {
            console.log(`Invalid keyword: ${word}`);
			//highlightedText = this.word
        }
        
    }
  
   return highlightedText;

}
  
  function analyzeText(text: string) {
	// Tokenisierung des Textes in Wörter oder Silben (je nach gewünschter Granularität)
	const tokens = tokenizeText(text);
	console.log("Tokens:" + tokens)
	// Berechnung der Häufigkeit jedes Tokens im Text
	const tokenFrequencies = calculateTokenFrequencies(tokens);
  
	// Auswahl der wichtigsten Schlüsselwörter oder -silben basierend auf ihrer Häufigkeit und Bedeutung
	const keywords = selectKeywords(tokenFrequencies);
  
	return keywords;
  }
  
  function tokenizeText(text) {
    // Beispiel: Einfache Tokenisierung in Wörter, kann durch eine Silbentrennungsfunktion erweitert werden.
    // Die angepasste Regex berücksichtigt nun auch Wörter mit Umlauten (ä, ö, ü).

    return text.split(/[^a-zA-Z0-9-äöüÄÖÜß]+/);
	//return text.split(/\w/);
  }
  
  function calculateTokenFrequencies(tokens) {
	const frequencies: TokenFrequency = {};
  
	  for (const token of tokens) {
		  if (!frequencies[token]) {
			  frequencies[token] = { count:1 };
		  } else {
			  frequencies[token].count++;
		  }
	  }
  
	  return frequencies;
  }
  
  interface TokenFrequency {
	[key: string]: { count: number };
  }
  

function selectKeywords(tokenFrequencies: TokenFrequency): string[] {
	// Beispiel: Auswahl der Top-N häufigsten Tokens als Schlüsselwörter. Dies kann durch Kontextanalyse und andere Kriterien verfeinert werden.
	const percentSingleKeywords = 1; // The function starts by calculating the number of top keywords. 20% of all unique keywords are selected as the top N value will be percentSingleKeywords = ".2". 
	const topN = Math.ceil(Object.keys(tokenFrequencies).length * percentSingleKeywords);

	return Object.entries(tokenFrequencies)
		.sort((a, b) => b[1].count - a[1].count)
		.slice(0, topN)
		.map(([token]) => token);
}
