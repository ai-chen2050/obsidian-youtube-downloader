import { writable } from 'svelte/store';
import YoutubeDownloader from '../main';

interface YoutubeDownloaderPluginSettings {
	youtubeSaveFolder: string;	// youtube video save folder
	ProxyIP: string;	// proxy IP for download youtube
	VideoResolution: string;	// video resolution
}

const DEFAULT_SETTINGS: YoutubeDownloaderPluginSettings = {
	youtubeSaveFolder: '',
	ProxyIP: '',
	VideoResolution: '',
};

const createSettingsStore = () => {
	const store = writable(DEFAULT_SETTINGS as YoutubeDownloaderPluginSettings);

	let _plugin!: YoutubeDownloader;

	const initialise = async (plugin: YoutubeDownloader): Promise<void> => {
		const data = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
		const settings: YoutubeDownloaderPluginSettings = { ...data };

		store.set(settings);
		_plugin = plugin;
	};

	store.subscribe(async (settings) => {
		if (_plugin) {
			const data = {
				...settings
			};
			await _plugin.saveData(data);
		}
	});

	const setYoutubeSaveFolder = (value: string) => {
		store.update((state) => {
			state.youtubeSaveFolder = value;
			return state;
		});
	};

	const setProxyIP = (ProxyIP: string) => {
		store.update((state) => {
			state.ProxyIP = ProxyIP;
			return state;
		});
	};

	const setVideoResolution = (Resolution: string) => {
		store.update((state) => {
			state.VideoResolution = Resolution;
			return state;
		});
	};


	return {
		subscribe: store.subscribe,
		initialise,
		actions: {
			setYoutubeSaveFolder,
			setProxyIP,
			setVideoResolution,
		}
	};
};

export const settingsStore = createSettingsStore();