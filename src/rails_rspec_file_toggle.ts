import { window, workspace } from 'vscode';
import { mkdirpSync, existsSync, writeFileSync } from 'fs-extra';
import { dirname } from 'path';
import ConvertDefinition from './convert_definition';
import Configuration from './configuration';

export default class RailsRspecFileToggle {
  toggle() {
    const filePath = this.retrieveFilePath();
    const rootPath = workspace.rootPath;
    if (filePath !== undefined && rootPath !== undefined) {
      const didOpenSpec = this.openSpecFromApp(filePath, rootPath);
      if (!didOpenSpec) { this.openAppFromSpec(filePath, rootPath); }
    }
  }

  private openSpecFromApp(filePath: string, rootPath: string) {
    const regex = new RegExp(`^${rootPath}/app/(.*)\.rb$`);
    const match = filePath.match(regex);
    if (match) {
      const file = ConvertDefinition.convertAppToSpec(match[1]);
      this.createIfNeededAndOpenFile(`${rootPath}/${Configuration.shared.getRspecDirectory()}/${file}_spec.rb`);
      return true;
    }
    return false;
  }

  private openAppFromSpec(filePath: string, rootPath: string) {
    const regex = new RegExp(`^${rootPath}/${Configuration.shared.getRspecDirectory()}/(.*)_spec\.rb$`);
    const match = filePath.match(regex);
    if (match) {
      const file = ConvertDefinition.convertSpecToApp(match[1]);
      this.createIfNeededAndOpenFile(`${rootPath}/app/${file}.rb`);
      return true;
    }
    return false;
  }

  private createIfNeededAndOpenFile(filePath: string) {
    if (!existsSync(filePath)) {
      const dirPath = dirname(filePath);
      if (!existsSync(filePath)) { mkdirpSync(dirPath); }
      writeFileSync(filePath, '');
    }
    workspace.openTextDocument(filePath).then(doc => window.showTextDocument(doc));
  }

  private retrieveFilePath() {
    if (!window.activeTextEditor) { return; }
    return window.activeTextEditor.document.fileName;
  }
}
