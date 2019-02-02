const electron = require('electron');
const path = require('path');
const url = require('url');
const { webContents } = require('electron');

// SET ENV
process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//working global variable! defines a var then gives its value!
global.sharedObj = {responseGrabbed: "Initialized global variable"};

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 600,
    fullscreen: false,
    'node-integration': false});
  //change user agent for streaming videos so its enabled by server side hehe
  var ses = mainWindow.webContents.session;
  var filter = {
    urls: ["http://*"]
  };
  //when we do finally get the response link we will still be identifying as SMP
  ses.webRequest.onBeforeSendHeaders(filter, function(details, callback) {
    details.requestHeaders['User-Agent'] = "Electron getType";
    callback({cancel: false, requestHeaders: details.requestHeaders});
  });
  //define the download path for downloaded videos
  ses.setDownloadPath(".\\Downloads")
  // Load html in window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes:true
  }));

  mainWindow.setMenu(null);
  if(process.env.NODE_ENV == 'development'){
    //enable dev tools
    mainWindow.webContents.openDevTools();
  }

  //this handles the redirect information from the server we request data from
  mainWindow.webContents.on('will-navigate', function (event, newUrl) {
      console.log(newUrl);
  });

  //getType from renderer.js! This is the research documentation key that I was working with
  mainWindow.webContents.on('dom-ready', () => {
    console.log("DOM: Ready");
    //verify that if getType is window true, then execute code
     if (mainWindow.webContents.getType() == "window") {
       var test = "string lol";
       console.log(mainWindow.webContents)
       //execute javascript
       mainWindow.webContents.executeJavaScript("var element = document.getElementById('changeMe'); element.innerHTML = 'Injected from main.js!';");
     }
  });

  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });
});
