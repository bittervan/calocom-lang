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
// const admonitions = require('remark-admonitions')
// const html = require('remark-html');
// const remark = require('remark');
// import * as remark from 'remark';
import * as path from 'path';
import { exec } from 'child_process';

const CALOCOM_EXECUTABLE = "/home/bittervan/Courses/compiler/calocom/target/debug/calocom-compiler";


export function activate(context: vscode.ExtensionContext) {



    // commandId
    const command = 'remark.sidePreview';

    const disposableSidePreview = vscode.commands.registerCommand(command, () => {
		// vscode.commands.executeCommand("mar")
        initMarkdownPreview(context);
    });

    context.subscriptions.push(disposableSidePreview);
}

async function initMarkdownPreview(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        // Webview id
    //     'liveHTMLPreviewer',
    //     // Webview title
    //     'Syntax Tree',
    //     // This will open the second column for preview inside editor
    //     2,
		'mermaidPreview',
		'Mermaid Preview',
		vscode.ViewColumn.Two,
		{
			enableScripts: true,
		}
	);

	// const fileName = vscode.workspace.textDocuments;
	// let fileName = vscode.Uri.name;
	const fileName = vscode.workspace.textDocuments[0].fileName;
	console.log(fileName);
	if (fileName) {
		exec(CALOCOM_EXECUTABLE + " -v "+ fileName, async (_, out, err) => {
			// console.log('in here');
			// console.log(out);
			// console.log('***');
			// console.log(err);
			panel.webview.html = out;
		})	
	}

	vscode.window.onDidChangeTextEditorSelection(async (change) => {
		// console.log(change.textEditor.document.fileName);
		let fileName = (change.textEditor.document.fileName);
		if (fileName.endsWith(".mag")) {
			exec(CALOCOM_EXECUTABLE + " -v "+ fileName, async (_, out, err) => {
				// console.log('***');
				// console.log(out);
				// console.log('***');
				// console.log(err);
				panel.webview.html = out;
			})
		}
	})

	vscode.workspace.onDidOpenTextDocument(async (document) => {
		console.log(document.fileName);
		if (document.fileName.endsWith(".mag")) {
			exec(CALOCOM_EXECUTABLE + " -v "+ document.fileName, async (_, out, err) => {
				// console.log('***');
				// console.log(out);
				// console.log('***');
				// console.log(err);
				panel.webview.html = out;
			})
		}
	});

	// vscode.workspace.onDidChangeTextDocument((change) => {
	// 	// let a = change.document.fileName;
	// 	// console.log(a);
	// 	// console.log("changing file");
	// });

	vscode.workspace.onDidSaveTextDocument(async (document) => {
		if (document.fileName.endsWith(".mag")) {
			exec(CALOCOM_EXECUTABLE + " -v "+ document.fileName, async (_, out, err) => {
				// console.log(out);
				// console.log('***');
				// console.log(err);
				panel.webview.html = out;
			})
		}
	});

}

function markdownCompiler(): any {
    // const admonitionsOptions = {};
    // return remark()
    //     .use(html)
    //     .use(admonitions, admonitionsOptions);
}



// this method is called when your extension is deactivated
export function deactivate() { }