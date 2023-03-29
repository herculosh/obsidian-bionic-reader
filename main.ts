import { App, Editor, MarkdownView, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { BionicReadingView } from './bionicReadingPreview';

// Remember to rename these classes and interfaces!

interface BionicReaderSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: BionicReaderSettings = {
	mySetting: 'default'
}


  
export default class BionicReader extends Plugin {
	settings: BionicReaderSettings;

	styleLoaded = false;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownPostProcessor((element, context) => {

			if (this.styleLoaded == false) {
				//const paragraphs = element.querySelectorAll("code");
				const bionicStyleID = "bionic-reading-style";

				console.log("DOCUMENT ENTRY!!! ")
				console.log(document)
				let styleElement = document.getElementById("markdown-preview-pusher");

				if (!styleElement) {
					styleElement = document.createElement("style");
					styleElement.id = bionicStyleID;

					// Add your desired Bionic Reading styles targeting elements within the `.markdown-preview-view` class.

					styleElement.innerHTML = `
						 .markdown-preview-view span {
							font-weight: bold;
						}
						`;
					document.head.appendChild(styleElement);
					console.log("DOCUMEN STYLE Added!!! ")
					console.log(document)
					this.styleLoaded = true;
				}
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



			

		// this.app.workspace.on('file-menu', (menu) => {
		// 	menu.addItem((menuItem) => {
		// 		menuItem.setTitle("Toggle Bionic Reading Preview")
		// 			.setIcon('fas fa-eye')
		// 			.onClick(() => {
		// 				this.registerMarkdownPostProcessor((element, context) => {
		// 					const codeblocks = element.querySelectorAll("code");

		// 					for (let index = 0; index < codeblocks.length; index++) {
		// 						const codeblock = codeblocks.item(index);
		// 						const text = codeblock.innerText.trim();
		// 						const isEmoji = text[0] === ":" && text[text.length - 1] === ":";
		// 						console.log("Test")
		// 						if (isEmoji) {
		// 							context.addChild(new Emoji(codeblock, text));
		// 						}
		// 					}
		// 				});
		// 			});
		// 	});
		// });


		function toggleBionicReading(): void {
			const bionicStyleID = "bionic-reading-style";

			console.log("DOCUMENT ENTRY!!! ")
			console.log(document)
			let styleElement = document.getElementById("markdown-preview-pusher");
			//let styleElement = document.getElementById(bionicStyleID);

			if (!styleElement) {
				styleElement = document.createElement("style");
				styleElement.id = bionicStyleID;

				// Add your desired Bionic Reading styles targeting elements within the `.markdown-preview-view` class.

				styleElement.innerHTML = `
			  .bionic-reading-style p {
				font-weight: normal;
				color: red;
			  }
			  
			  .markdown-preview-view p::nth-word(2n) {
				font-weight: bold;
			  }

			  .bionic-reading-style div{
				font-weight: bolder;
				color: blue;
				}
				
			`;

				document.head.appendChild(styleElement);

				console.log("DOCUMENT!!! ")
				console.log(document)

			} else {
				// If the style element already exists, remove it to toggle off Bionic Reading.
				styleElement.remove();
			}
		}



		function applyBionicReading(editor) {
			// Hier können Sie Ihren Code hinzufügen, um den Bionic Reading-Stil auf den Editor-Inhalt anzuwenden.
			// Zum Beispiel könnten Sie wichtige Wörter oder Sätze farblich hervorheben.

			const content = editor.getValue();

			// Eine einfache Möglichkeit wäre, jedes fünfte Wort fett zu formatieren:
			const words = content.split(' ');

			for (let i = 0; i < words.length; i++) {
				if ((i + 1) % 5 === 0) {
					words[i] = `**${words[i]}**`;
				}
			}

			const updatedContent = words.join(' ');

			editor.setValue(updatedContent);
		}

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleBionicReader(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleBionicReader(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		//this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleBionicReader extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: BionicReader;

	constructor(app: App, plugin: BionicReader) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for BionicReader.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secreta')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}

