'use strict';

import { window, workspace, WorkspaceConfiguration } from 'vscode';
import { isString } from 'util';
import ConvertDefinition from './convert_definition';

export default class RailsRspecFileToggle {
  configuration: WorkspaceConfiguration;
  constructor() {
    this.configuration = workspace.getConfiguration('railsRspecFileToggle');
  }

  toggle() {
    const filePath = this.retrieveFilePath();
    const rootPath = workspace.rootPath;
    if (isString(filePath) && isString(rootPath)) {
      const didOpenSpec = this.openSpecFromApp(filePath, rootPath);
      if (!didOpenSpec) { this.openAppFromSpec(filePath, rootPath); }
    }
  }

  openSpecFromApp(filePath: string, rootPath: string): boolean {
    const regex = new RegExp(`^${rootPath}/app/(.*)\.rb$`);
    const match = filePath.match(regex);
    if (match) {
      const file = ConvertDefinition.convertAppToSpec(match[1]);
      const appPath = `${rootPath}/${this.rspecDirectory()}/${file}_spec.rb`;
      workspace.openTextDocument(appPath).then(doc => window.showTextDocument(doc));
      return true;
    }
    return false;
  }

  openAppFromSpec(filePath: string, rootPath: string): boolean {
    const regex = new RegExp(`^${rootPath}/${this.rspecDirectory()}/(.*)_spec\.rb$`);
    const match = filePath.match(regex);
    if (match) {
      const file = ConvertDefinition.convertSpecToApp(match[1]);
      const specPath = `${rootPath}/app/${file}.rb`;
      workspace.openTextDocument(specPath).then(doc => window.showTextDocument(doc));
      return true;
    }
    return false;
  }

  rspecDirectory(): string {
    return this.configuration.get<string>('rspecCommand') || 'spec';
  }

  retrieveFilePath(): string | undefined {
    if (!window.activeTextEditor) {
      return;
    }
    return window.activeTextEditor.document.fileName;
  }
}
