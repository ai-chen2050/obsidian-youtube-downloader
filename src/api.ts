import { Notice, requestUrl, request, RequestUrlParam, TFile, App, FileSystemAdapter } from 'obsidian';
import { settingsStore } from './settings';
import { get } from 'svelte/store';

import fs from "fs";
import ytdl from '@distube/ytdl-core';

export default class ApiManager {
	app: App;

	constructor(app: App) {
        this.app = app;
    }

	private getHeaders() {
		return {
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
		};
	}

	async getYoutubeVideo(videoUrl: string, name: string) {
		try {
			if (this.app.vault.adapter instanceof FileSystemAdapter) {
				const fadp = this.app.vault.adapter;
				const setings = get(settingsStore)
				let stream;
				const  videores = setings.VideoResolution
				if (setings.ProxyIP === "") {
					if ( videores=== '' || videores === 'default') {
						stream = ytdl(videoUrl);
					} else {
						stream = ytdl(videoUrl,{ quality: videores });
					}
				} else {
					const agent = ytdl.createProxyAgent({ uri: setings.ProxyIP });
					if ( videores=== '' || videores === 'default') {
						stream = ytdl(videoUrl, { requestOptions: { agent }, });
					} else {
						stream = ytdl(videoUrl,{ quality: videores, requestOptions: { agent } });
					}
				}
	
				new Notice('Starting Download', 10000)
				const filePath = `${fadp.getBasePath()}/${setings.youtubeSaveFolder}/${name}.mp4`
				const writableStream = fs.createWriteStream(filePath);
	
				stream.on('data', (chunk:any) => {
					writableStream.write(chunk); // 将 chunk 写入到文件
				});
	
				stream.on('error', (err:Error) => {
					new Notice(err.message);
					console.error(err);
				});
	
				stream.on('end', () => {
					new Notice('Finished', 30000);
					writableStream.end(); // 关闭可写流
				});
			}
		} catch (e) {
			new Notice('Failed: ' + e, 30000);
			console.error('download youtube video err: ' + e);
		}
	}
}