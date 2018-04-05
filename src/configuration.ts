import { WorkspaceConfiguration, workspace } from "vscode";

export default class Configuration {
  static readonly shared = new Configuration();

  private configuration: WorkspaceConfiguration;
  private constructor() {
    this.configuration = workspace.getConfiguration('railsRspecFileToggle');
  }

  getConvertDefinition() {
    return this.configuration.get<{ [key: string]: string }[]>('convertDefinition') || new Array<{ [key: string]: string }>(0);
  }

  getRspecDirectory() {
    return this.configuration.get<string>('rspecDirectory') || 'spec';
  }
}
