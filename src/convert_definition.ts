import Configuration from "./configuration";

export default class ConvertDefinition {
  private constructor(private appDirectory: string, private specDirectory: string, private appSuffix?: string, private specSuffix?: string) {}

  private convertAppToSpec(file: string) {
    return this.convert(file, this.appDirectory, this.specDirectory, this.appSuffix, this.specSuffix);
  }

  private convertSpecToApp(file: string) {
    return this.convert(file, this.specDirectory, this.appDirectory, this.specSuffix, this.appSuffix);
  }

  private convert(file: string, fromDirectory: string, toDirectory: string, fromSuffix?: string, toSuffix?: string) {
    const directoryRegex = new RegExp(`^${fromDirectory}/`);
    if (!file.match(directoryRegex)) { return file; }
    file = file.replace(directoryRegex, `${toDirectory}/`);
    if (fromSuffix !== undefined && toSuffix !== undefined) {
      if (fromSuffix === '') {
        file += toSuffix;
      } else {
        const suffixRegex = new RegExp(`${fromSuffix}$`);
        file = file.replace(suffixRegex, toSuffix);
      }
    }
    return file;
  }

  static convertAppToSpec(file: string) {
    this.all.forEach((definition) => {
      file = definition.convertAppToSpec(file);
    });
    return file;
  }

  static convertSpecToApp(file: string) {
    this.all.forEach((definition) => {
      file = definition.convertSpecToApp(file);
    });
    return file;
  }

  private static get all() {
    if (this._all) { return this._all; }

    this._all = Configuration.shared.getConvertDefinition().map(
      (object) => new ConvertDefinition(object['app_directory'] || '', object['spec_directory'] || '', object['app_suffix'], object['spec_suffix'])
    );
    return this._all;
  }

  private static _all: ConvertDefinition[];
}
