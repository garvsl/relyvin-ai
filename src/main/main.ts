/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { ensureDir, readdir, readFile, writeFile } from 'fs-extra';
import { isEmpty } from 'lodash';
import fs from 'fs';
import { exec } from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('getTranscripts', async () => {
  const route = path.resolve(__dirname, 'store');
  // /${arg}.txt
  await ensureDir(route);

  const fileNames = await readdir(route, {
    encoding: 'utf8',
    withFileTypes: false,
  });

  const files = fileNames.filter((file) => file.endsWith('.txt'));

  if (isEmpty(files)) {
    console.info('No notes found, creating a welcome note');

    await writeFile(`${route}/${'test'}.txt`, 'hello', {
      encoding: 'utf8',
    });

    files.push('test.txt');
  }
  // console.log(files);
  return files;
});

ipcMain.handle('readTranscript', async (_, args) => {
  const route = path.resolve(__dirname, 'store');

  await ensureDir(route);

  const transcriptLocation = `${route}/${args}`;

  const transcript = await readFile(transcriptLocation, {
    encoding: 'utf8',
  });

  return transcript;
});

ipcMain.handle('save-audio', async (_, buffer) => {
  try {
    const route = path.resolve(__dirname, 'store', 'audio');
    fs.mkdirSync(route, { recursive: true });
    const fileName = `audio_${Date.now()}.webm`;
    const filePath = path.join(route, fileName);

    const newBuffer = Buffer.from(buffer);
    fs.writeFileSync(filePath, newBuffer);
    return { success: true, path: filePath };
  } catch (error: any) {
    console.error('Error saving audio:', error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle('transcription', async (_, webmPath) => {
  console.log(`Starting transcription for: ${webmPath}`);
  try {
    const scriptPath = path.join(__dirname, 'package', 'run_transcribe.sh');
    console.log(`Running script: ${scriptPath}`);

    const result = await new Promise((resolve, reject) => {
      exec(`"${scriptPath}" "${webmPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
        }
        console.log(`Script stdout: ${stdout}`);
        resolve(stdout);
      });
    });

    console.log(`Transcription completed successfully`);
    return { success: true, result };
  } catch (error: any) {
    console.error(`Transcription failed: ${error.message}`);
    return { success: false, error: error.message };
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
