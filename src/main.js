const {
	app,
	dialog,
	BrowserWindow,
} = require("electron");
const {
	autoUpdater,
} = require("electron-updater");
const { resolve, join } = require("path");
const fs = require('fs');
const { execFile } = require('child_process');

let mainWindow;
let child = null;

/* if (process.env.NODE_ENV === "development") {
	autoUpdater.autoDownload = false;
	autoUpdater.autoInstallOnAppQuit = false;
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 10000);
} */

const extraPath = join(
	process.resourcesPath,
	".."
);

const path = join(
	extraPath,
	"application.exe"
);

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
}

function updaterListeners() {
	autoUpdater.on("update-available", () => {
		dialog
			.showMessageBox(mainWindow, {
				type: "question",
				title: "Atualização Disponível",
				message:
					"Uma nova atualização está disponível. Deseja instalá-la agora?",
				buttons: ["Sim", "Não"],
			})
			.then((result) => {
				if (result.response === 0) {
					autoUpdater.downloadUpdate();
				}
				if (result.response === 1) {
					openApplication();
				}
			});
	});

	autoUpdater.on("update-downloaded", () => {
		dialog.showMessageBox(mainWindow, {
			type: "info",
			title: "Atualização baixada",
			message:
				"A atualização foi baixada. Reinicie a aplicação para aplicar as mudanças.",
			buttons: ["OK"],
		}).then(() => {
			autoUpdater.quitAndInstall(true, true);
		});
	});

	autoUpdater.on("error", (message) => {
		dialog.showMessageBox(mainWindow, {
			type: "error",
			title: "Erro em att",
			message:
				`${message}`,
			buttons: ["OK"],
		})
	});

}

function openApplication() {
	child = execFile(require.resolve(path));

	child.on('close', (code) => {
		app.exit(0);
	});
}

app.whenReady().then(async () => {
	autoUpdater.autoDownload = false;
	autoUpdater.autoInstallOnAppQuit = false;
	createWindow();
	updaterListeners();
	const resultUpdater = await autoUpdater.checkForUpdatesAndNotify();
	if (resultUpdater !== null) {
		if (resultUpdater.versionInfo.version !== app.getVersion()) {
			return dialog.showMessageBox(mainWindow, {
				type: "info",
				title: "Há uma versão disponível",
				message:
					`Clique em ok para fazer o dowload da nova versão!`,
				buttons: ["OK"],
			});
		}
	}

	openApplication();

});

