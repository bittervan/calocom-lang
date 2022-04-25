// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // this method is called when your extension is activated
// // your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {
// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "helloworld-sample" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed

// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World!');
// 	});

// 	context.subscriptions.push(disposable);
// }

import * as vscode from 'vscode';
// import admonitions from 'remark-admonitions';
const admonitions = require('remark-admonitions')
const html = require('remark-html');
const remark = require('remark');
// import * as remark from 'remark';
import * as path from 'path';


export function activate(context: vscode.ExtensionContext) {


    // commandId
    const command = 'remark.sidePreview';

    const disposableSidePreview = vscode.commands.registerCommand(command, async () => {
        initMarkdownPreview(context);
    });

    context.subscriptions.push(disposableSidePreview);
}

async function initMarkdownPreview(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        // Webview id
        'liveHTMLPreviewer',
        // Webview title
        'Syntax Tree',
        // This will open the second column for preview inside editor
        2,
        {
            // Enable scripts in the webview
            enableScripts: true,
            retainContextWhenHidden: true,
            // And restrict the webview to only loading content from our extension's `assets` directory.
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
        }
    );
    panel.webview.html = await markdownCompiler().process(vscode.window.activeTextEditor?.document.getText());
}

function markdownCompiler(): any {
    const admonitionsOptions = {};
    return remark()
        .use(html)
        .use(admonitions, admonitionsOptions);
}



// this method is called when your extension is deactivated
export function deactivate() { }