const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        title: "StudyHub Platform",
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'public/brain.ico') // We'll need an icon ideally
    });

    // In production, load the built index.html
    // In development, load localhost
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;

    // If dev, wait for localhost
    if (process.env.ELECTRON_START_URL) {
        mainWindow.loadURL(startUrl);
    } else {
        // Production: Load file
        mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    }

    // Open external links in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

function startBackend() {
    // In production, we might want to bundle the python backend or assume it's running.
    // For a standalone .exe, bundling python is complex. 
    // For now, we will assume the API is available or this is a client-only build connecting to a remote server.
    // If you want to bundle Python, we'd need PyInstaller. 
    // Let's print a message for now.
    console.log("Backend should be running on port 5000");
}

app.whenReady().then(() => {
    startBackend();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
