import { App, PluginSettingTab, Setting } from 'obsidian';
import BionicReader from './main';


export class BionicReadingSettingTab extends PluginSettingTab {
	plugin: BionicReader;

	constructor(app: App, plugin: BionicReader) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for BionicReader.' });

		new Setting(containerEl)
			.setName('Font Weight')
			.setDesc('Defines the font weight for the text in the preview. Valid values are "normal" or a number between 100 and 900, where higher values indicate a stronger weight. The default value is `700`, which corresponds to a bold font. Other possible values include "bold" for an even stronger weight or "500" for a medium weight.')
			.addText(text => text
				.setPlaceholder('Enter your secreta')
				.setValue(this.plugin.settings.fontWeight)
				.onChange(async (value) => {
					console.log('Strength: ' + value);
					this.plugin.settings.fontWeight = value;
					await this.plugin.saveSettings();
				}));
	}
}
