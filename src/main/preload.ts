// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    getTranscripts: () => {
      return ipcRenderer.invoke('getTranscripts');
    },
    readTranscript: (name: string) => {
      return ipcRenderer.invoke('readTranscript', name);
    },
    listScreens: () => {
      return ipcRenderer.invoke('list-screens');
    },
    startRecording: (options: any) => {
      return ipcRenderer.invoke('start-recording', options);
    },
    stopRecording: () => {
      return ipcRenderer.invoke('stop-recording');
    },
    getSources: () => {
      return ipcRenderer.invoke('get-sources');
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
