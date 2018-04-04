'use strict';

import { window, workspace, WorkspaceConfiguration } from 'vscode';
import { isString } from 'util';
import { exists, writeFileSync } from 'fs';
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
      this.createIfNeededAndOpenFile(`${rootPath}/${this.rspecDirectory()}/${file}_spec.rb`);
      return true;
    }
    return false;
  }

  openAppFromSpec(filePath: string, rootPath: string): boolean {
    const regex = new RegExp(`^${rootPath}/${this.rspecDirectory()}/(.*)_spec\.rb$`);
    const match = filePath.match(regex);
    if (match) {
      const file = ConvertDefinition.convertSpecToApp(match[1]);
      this.createIfNeededAndOpenFile(`${rootPath}/app/${file}.rb`);
      return true;
    }
    return false;
  }

  createIfNeededAndOpenFile(filePath: string) {
    exists(filePath, (exists) => {
      if (!exists) { writeFileSync(filePath, ''); }
      workspace.openTextDocument(filePath).then(doc => window.showTextDocument(doc));
    });
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
