import { ItemView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_EXAMPLE = "bionicreader-view";

export class BionicReaderView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "Example view";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "Example view" });
  }


  formatTextForBionicView(noteContent) {
	// Define an array of stop words or other common words you want to ignore.
	const stopWords = ["the", "and", "is"];
  
	// Split the note content into individual words and loop over them.
	const words = noteContent.split(/\s/);
	for (let i = 0; i < words.length; i++) {
		let word = words[i].toLowerCase().replace(/[.,!?]/g, '');
		if (stopWords.includes(word)) continue;

		/* Highlight first and last character based on length */
		if (word.length %2 ===0){
			let middleIndex=word.length /2 -1;
			const highlightedWord=`${word.substring(0,middleIndex)}<span class="highlight">${word.charAt(middleIndex)}</span>${word.substring(middleIndex+1)}`
			noteContent=noteContent.replace(words[i],highlightedWord );
		} else{
			let middleIndex=(Math.floor(word.length/2 ))-1;
  
			const highlightedWord=`${word.substring(0,middleIndex)}<span class="highlight">${word.charAt(middleIndex)}</span>${word.substring(middleIndex+1,middleIndex+2)}${middleChar}${words[i].substring(word.lastIndexOf(middleChar)+1)}`;

			noteContent=noteContent.replace(words[i],highlightedWord);
		}
	}
  
  return noteContent;
  }


  async onClose() {
    // Nothing to clean up.
  }
}
