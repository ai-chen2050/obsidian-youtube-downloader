import { App, Editor, MarkdownView, Notice, Plugin, Setting, TFile, addIcon, requestUrl, Menu, RequestUrlParam } from 'obsidian';
import { YoutubeDownloaderSettingTab } from "./src/settingTab"
import ApiManager from 'src/api';
import { settingsStore } from 'src/settings';
import { YoutubeDownloadModal } from 'src/showModals';
import { chooseBoundary } from 'utils/cookiesUtil';

export default class YoutubeDownloader extends Plugin {
	apiManager: ApiManager;

	async onload() {
		settingsStore.initialise(this);
		this.apiManager = new ApiManager(this.app);

		this.registerContextMenu();

		this.addCommand({
			id: 'download-youtube-video',
			name: 'download youtube video',
			callback: async () => {
				new YoutubeDownloadModal(this.app,async (videoUrl, name) => {
					if ((videoUrl === "" || !videoUrl.startsWith('http')) || name === "") {
						new Notice('Please input correct youtube video url!');
						return
					}
					await this.apiManager.getYoutubeVideo(videoUrl, name)
                }).open();
				return
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new YoutubeDownloaderSettingTab(this.app, this, this.apiManager));
	}

	onunload() {
		new Notice('unloading YoutubeDownloader plugin at '+ new Date().toLocaleString())
	}

	// 右键菜单
	registerContextMenu() {
        let addMemu = (mu: Menu, selection: string) => {
            mu.addItem((item) => {
                item.setTitle("Download video from youtube")
                    .setIcon("info")
                    .onClick(async () => {
                        this.apiManager.getYoutubeVideo(selection, chooseBoundary());
                    });
            });
        };
        // markdown 编辑模式 右键菜单
        this.registerEvent(
            this.app.workspace.on(
                "editor-menu",
                (menu: Menu, editor: Editor, view: MarkdownView) => {
                    let selection = editor.getSelection();
                    if (selection || selection.trim().length === selection.length) {
                        addMemu(menu, selection);
                    }
                }
            )
        );
        // markdown 预览模式 右键菜单
        this.registerDomEvent(document.body, "contextmenu", (evt) => {
            if ((evt.target as HTMLElement).matchParent(".markdown-preview-view")) {
                const selection = window.getSelection()!.toString().trim();
                if (!selection) return;

                evt.preventDefault();
                let menu = new Menu();
                addMemu(menu, selection);
                menu.showAtMouseEvent(evt);
            }
        });
    }
}
