import { commands, window, ExtensionContext } from 'vscode';
import RailsRspecFileToggle from './rails_rspec_file_toggle';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand('extension.railsRspecFileToggle', () => {
    const toggle = new RailsRspecFileToggle();
    toggle.toggle();
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
