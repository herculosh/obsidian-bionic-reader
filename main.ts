import { Editor, MarkdownView, Modal, Plugin } from 'obsidian';
import { BionicReadingView } from './bionicReadingPreview';
import { BionicReadingSettingTab } from './BionicReadingSettingTab';

// Remember to rename these classes and interfaces!

interface BionicReaderSettings {
	fontWeight: string;
}

const DEFAULT_SETTINGS: BionicReaderSettings = {
	fontWeight: '700'
}

  
export default class BionicReader extends Plugin {
	settings: BionicReaderSettings;
	styleElement: HTMLStyleElement;
	styleLoaded = false;

	async onload() {
		await this.loadSettings();
		const defaultSettings = this.settings;

		this.registerMarkdownPostProcessor((element, context) => {

			if (this.styleLoaded == false) {
				//const paragraphs = element.querySelectorAll("code");
				this.styleElement = document.createElement('style');
				const bionicStyleID = "bionic-reading-style";

				console.log(defaultSettings.fontWeight)

				console.log("DOCUMENT ENTRY!!! ")
				console.log(document)
				

				//if (!styleElement) {
					this.styleElement.id = bionicStyleID;
					this.updateStyle();
					console.log("Style: " + this.styleElement.outerHTML)


					document.head.appendChild(this.styleElement);
					console.log("DOCUMEN STYLE Added!!! ")
					console.log(document)
					this.styleLoaded = true;
				//}
			}


			const paragraphs = element.querySelectorAll("p");
			console.log("QuerySelectorAll(p) passed")
			console.log(paragraphs)
			for (let index = 0; index < paragraphs.length; index++) {
				const paragraph = paragraphs.item(index);
				console.log("Paragraph contains: " + paragraph.innerText.trim())
				const text = paragraph.innerText.trim();

				//if (isEmoji) {
				console.log("Codeblock is en Emoji")
				context.addChild(new BionicReadingView(paragraph, text));
				//}
			}

			const listitems = element.querySelectorAll("ul.has-list-bullet li[data-line]");
			console.log("QuerySelectorAll(li) passed")
			for (let index = 0; index < listitems.length; index++) {
				const listitem = listitems.item(index);
				console.log("Listitem contains innertext: " + listitem.innerText)
				console.log("Listitem contains outertext: " + listitem.outerText)
				const text = listitem.innerText;

				//if (isEmoji) {
				console.log("Codeblock is en Emoji")
				context.addChild(new BionicReadingView(listitem, text));
				//}
			}

			const unorderedlistitems = element.querySelectorAll("ol > li[data-line]");
			console.log("QuerySelectorAll(ol) passed")
			for (let index = 0; index < unorderedlistitems.length; index++) {
				const unorderedlistitem = unorderedlistitems.item(index);
				console.log("Listitem contains innertext: " + unorderedlistitem.innerText)
				console.log("Listitem contains outertext: " + unorderedlistitem.outerText)
				const text = unorderedlistitem.innerText;

				//if (isEmoji) {
				console.log("Codeblock is en Emoji")
				context.addChild(new BionicReadingView(unorderedlistitem, text));
				//}
			}

		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BionicReadingSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	updateStyle() {
		// Set desired Bionic Reading styles targeting elements within the `.markdown-preview-view` class.
		this.styleElement.innerHTML = `
		.markdown-preview-view span {
		   font-weight: ${this.settings.fontWeight};
	   }
	   `;
	}
		


	onunload() {
		this.styleElement.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.updateStyle();
	}
}


