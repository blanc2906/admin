export class ConfigurationRule<T> {
    name: string;
    keys: { [key: string]: string };
    configClass: new () => T;

    constructor(name:string,keys: { [key: string]: string },configClass: new () => T) {
        this.name = name;
        this.keys = keys;
        this.configClass = configClass;
    }
}