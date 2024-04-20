import { App, Notice, PluginSettingTab, Setting, TFolder } from 'obsidian';
import YoutubeDownloader from '../main'
import { settingsStore } from './settings'
import ApiManager from './api'
import { get } from 'svelte/store';
import pickBy from 'lodash.pickby';
import { buyMeACoffee, commutity, motivation } from './consts/global';

export class YoutubeDownloaderSettingTab extends PluginSettingTab {
	plugin: YoutubeDownloader;
	private apiManager: ApiManager;
	readonly expireDuration : number = 7200;  

	constructor(app: App, plugin: YoutubeDownloader, apiManeger: ApiManager) {
		super(app, plugin);
		this.plugin = plugin;
		this.apiManager = apiManeger;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl).setName('👉 📺 Youtube downloader zone').setHeading();
		this.setYoutubeSaveFolder();
		this.setProxyIP();
		this.setVideoResolution();

		this.donation(containerEl);
	}

	private setYoutubeSaveFolder(): void {
		new Setting(this.containerEl)
			.setName('Youtube save folder')
			.setDesc('Download folder from youtube')
			.addDropdown((dropdown) => {
				const files = this.app.vault.getAllLoadedFiles();				
				const folders = pickBy(files, (val: any) => {
					return val instanceof TFolder;
				});

				Object.values(folders).forEach((val: TFolder) => {
					dropdown.addOption(val.path, val.path);
				});
				return dropdown
					.setValue(get(settingsStore).youtubeSaveFolder)
					.onChange(async (value) => {
						settingsStore.actions.setYoutubeSaveFolder(value);
					});
			});
	}

	private setProxyIP(): void {
		new Setting(this.containerEl)
			.setName('ProxyIP')
			.setDesc('Proxy IP, proxy ip for download youtube video,empty is directly to download.')
			.addText((input) => {
				input.setPlaceholder('http://user:pass@111.111.111.111:8080')
					 .setValue(get(settingsStore).ProxyIP)
					 .onChange((value: string) => {
						settingsStore.actions.setProxyIP(value);
				});
			});
	}

	private setVideoResolution(): void {
		new Setting(this.containerEl)
			.setName('视频分辨率')
			.setDesc('默认最高分辨率,video resolution from youtube,default is heightest')
			.addDropdown((dropdown) => {
				const values = {
					'hd360': 'hd360',
					'hd720': 'hd720',
					'default': 'default'
				};

				Object.keys(values).forEach((val) => {
					dropdown.addOption(val, val);
				});
				return dropdown
					.setValue(get(settingsStore).VideoResolution)
					.onChange(async (value) => {
						settingsStore.actions.setVideoResolution(value);
					});
			});
	}

	private donation(containerEl: HTMLElement): void {
		new Setting(containerEl).setName('💰 Support 支持 & Funding 赞助 💰').setHeading();
		containerEl.createEl('br');
		let div = containerEl.createEl('div');
	  
		const donateTextZH = document.createElement('p');
		donateTextZH.appendText(
		'如果您觉得这个插件帮助到您了，为您提供了价值，欢迎赞助我以持续开发迭代本插件。' +
			'您可以使用如下微信/ WeChat 二维码以赞助开发者: 🧡🧡 👏🏻👏🏻',
		);
		donateTextZH.style.textAlign = 'center';
		donateTextZH.style.width = '70%';
		donateTextZH.style.margin = '0 auto';
		div.appendChild(donateTextZH);
		
		div = this.createDonateQRC(div);

		div.appendChild(containerEl.createEl('br'));
		const donateText = document.createElement('p');
		donateText.appendText(
		'If this plugin adds value for you and you would like to help support ' +
			'continued development, please use the buttons below:',
		);
		donateText.style.textAlign = 'center';
		donateText.style.width = '70%';
		donateText.style.margin = '0 auto';
		div.appendChild(donateText);
		
		div.appendChild(containerEl.createEl('br'));
		const parser = new DOMParser();
	
		//   div.appendChild(
		// 	this.createDonateButton(
		// 	  'https://paypal.me/blakechan',
		// 	  parser.parseFromString(paypal, 'text/xml').documentElement,
		// 	),
		//   );
	
		div.appendChild(
		this.createDonateButton(
			'https://www.buymeacoffee.com/blakechan',
			parser.parseFromString(buyMeACoffee, 'text/xml').documentElement,
		),
		);
	}

	private createDonateButton(link: string, img: HTMLElement): HTMLElement {
		const a = document.createElement('a');
		a.setAttribute('href', link);
		a.style.margin = "40%"
		a.appendChild(img);
		return a;
	};

	private createDonateQRC(div: HTMLDivElement): HTMLDivElement {
		const table = document.createElement('table');
		// 创建第一行
		const row1 = document.createElement('tr');

		// 创建第一个单元格
		const cell1 = document.createElement('td');
		const text1 = document.createElement('p');
		cell1.appendChild(text1);
		row1.appendChild(cell1);

		// 创建第二个单元格
		const cell2 = document.createElement('td');
		const text2 = document.createElement('p');
		cell2.appendChild(text2);
		row1.appendChild(cell2);

		// 创建第二行
		const row2 = document.createElement('tr');

		// 创建第三个单元格并添加第三张图片
		const cell3 = document.createElement('td');
		const img3 = document.createElement('img');
		img3.src = motivation;
		img3.style.width = '200px';
		img3.style.height = 'auto'
		img3.style.margin = '0 10px'
		cell3.appendChild(img3);
		row2.appendChild(cell3);

		// 创建第四个单元格并添加第四张图片
		const cell4 = document.createElement('td');
		const img4 = document.createElement('img');
		img4.src = commutity;
		img4.style.width = '200px';
		img4.style.height = 'auto'
		img4.style.margin = '0 10px'
		cell4.appendChild(img4);
		row2.appendChild(cell4);

		table.appendChild(row1);
		table.appendChild(row2);

		table.style.margin = "0 auto";
		div.appendChild(table);
		return div;
	};
}
