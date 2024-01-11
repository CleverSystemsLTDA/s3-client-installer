const { app, shell, ipcMain, dialog, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const ProgressBar = require("electron-progressbar");
const { resolve, join } = require("path");

let mainWindow;
let downloadPercent = 0;

// if (process.env.NODE_ENV === "development") {
// 	autoUpdater.autoDownload = false;
// 	autoUpdater.autoInstallOnAppQuit = false;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, 10000);
// }

async function checkUpdate() {
  // const response = await autoUpdater.checkForUpdatesAndNotify();
  let progressBar = new ProgressBar({
    indeterminate: false,
    text: "Verificando atualizações...",
    detail: "Aguarde",
  });
  progressBar
    .on("completed", function () {
      progressBar.detail = "Atualização finalizada. Finalizando...";
    })
    .on("aborted", function (value) {
      console.info(`aborted... ${value}`);
    })
    .on("progress", function (value) {
      progressBar.detail = `Baixado ${value.toFixed(2)}% de ${
        progressBar.getOptions().maxValue
      }%...`;
    });

  setInterval(function () {
    if (!progressBar.isCompleted()) {
      progressBar.value = downloadPercent;
    }
  }, 20);
}

const path = join(process.resourcesPath, "s3client.exe");

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

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", {
    version: app.getVersion(),
  });
});

app.on("ready", async () => {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
  shell.openPath(resolve(path));
});

autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox(mainWindow, {
      type: "question",
      title: "Atualização Disponível",
      message: "Uma nova atualização está disponível. Deseja instalá-la agora?",
      buttons: ["Sim", "Não"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
        checkUpdate();
      }
    });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "Atualização baixada",
      message:
        "A atualização foi baixada. Reinicie a aplicação para aplicar as mudanças.",
      buttons: ["Reniciar", "Depois"],
    })
    .then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
});

autoUpdater.on("download-progress", (progressObj) => {
  downloadPercent = progressObj.percent;
});
