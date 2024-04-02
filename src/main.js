const { app, dialog, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const { resolve, join } = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const ProgressBar = require("electron-progressbar");

let mainWindow;
let child = null;
let downloadPercent = 0;

const extraPath = join(process.resourcesPath, "..");

const path = join(extraPath, "application.exe");

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

async function checkUpdate() {
  // const response = await autoUpdater.checkForUpdatesAndNotify();
  let progressBar = new ProgressBar({
    indeterminate: false,
    text: "Baixando atualizações...",
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
      progressBar.detail = `Baixado ${value.toFixed(2)}% de ${progressBar.getOptions().maxValue
        }%...`;
    });

  setInterval(function () {
    if (!progressBar.isCompleted()) {
      progressBar.value = downloadPercent;
    }
  }, 20);
}

function updaterListeners() {
  autoUpdater.on("update-available", (info) => {
    /* log.info('update-available: ');
    log.info(info); */
    const arrVersion = info.version.split('-');
    const updateChannel = arrVersion[1];

    if (updateChannel === autoUpdater.channel) {
      dialog.showMessageBox(mainWindow, {
        type: "question",
        title: `Atualização Disponível (${info.version})`,
        message:
          "Uma nova atualização está disponível. Deseja instalá-la agora?",
        buttons: ["Sim", "Não"],
      })
        .then((result) => {
          if (result.response === 0) {
            autoUpdater.downloadUpdate();
            checkUpdate();
          }
          if (result.response === 1) {
            openApplication();
          }
        });

    } else {
      openApplication();
    }
  });

  autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Atualização baixada",
      message:
        "A atualização foi baixada. Reinicie a aplicação para aplicar as mudanças.",
      buttons: ["Reniciar", "Depois"],
    })
      .then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall(true, true);
      });
  });

  autoUpdater.on("download-progress", (progressObj) => {
    downloadPercent = progressObj.percent;
  });

  autoUpdater.on("error", (message) => {
    dialog.showMessageBox(mainWindow, {
      type: "error",
      title: "Erro em att",
      message: `${message}`,
      buttons: ["OK"],
    });
  });
}

function openApplication() {
  child = execFile(require.resolve(path));

  child.on("close", (code) => {
    app.exit(0);
  });
}

app.whenReady().then(async () => {
  log.info('App starting...');
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.allowPrerelease = true;
  autoUpdater.allowDowngrade = true;
  autoUpdater.channel = 'beta';

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info(`Version App: ${app.getVersion()}`);
  log.info(`Channel: ${autoUpdater.channel}`);


  createWindow();
  updaterListeners();
  const resultUpdater = await autoUpdater.checkForUpdatesAndNotify();

  /* log.info('ResultUpdater: ');
  log.info(resultUpdater); */

  if (resultUpdater !== null) {
    if (resultUpdater.versionInfo.version !== app.getVersion()) {
      return;
    }
  }

  openApplication();
});