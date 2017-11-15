import { Settings, SystemConnection } from '../models';

/**
 * DrupalConstants singleton design pattern of the required settings and user connection.
 */
export class DrupalConstants {
  /**
   * Singleton instance.
   * didn't understand it ? Oh come on!.
   */
  private static instance: DrupalConstants;

  /**
   * private variables for set and get.
   */
  private settings: Settings;
  private connection: SystemConnection;

  constructor() { }

  static get Instance() {
    if (!this.instance) {
      this.instance = new DrupalConstants();
    }
    return this.instance;
  }

  /**
   * Handeling the case when user didn't implement the back-end settings and return the settings instance
   */
  static get Settings(): Settings {
    if (!this.Instance.settings) {
      throw "Application settings are not set, Please read README.MD file";
    }
    return this.Instance.settings;
  }

  /**
   * Set the settings instanse on application init.
   * you can also do that at the runtime, Thanks to Singleton design pattern <3 !
   */
  static set Settings (newSettings: Settings) {
    this.Instance.settings = newSettings;
  }

  /**
   * the full backend url for current user settings
   */
  static get backEndUrl(): string {
    const settings = this.Settings;
    const url = settings.apiProtocol + '://' + settings.apiHost;
    return settings.apiPort ? url + ':' + settings.apiPort + '/' : url + '/';
  }

  /**
   * Application back-end rest api url.
   */
  static get restUrl(): string {
    const settings = this.Settings;
    return this.backEndUrl + settings.apiEndPoint + '/';
  }

  /**
   * Updating connection instanse after login or rightaway after openning the connection
   */
  static set Connection (newConnection: SystemConnection) {
    this.Instance.connection = newConnection;
  }

  /**
   * get the connection instance
   */
  static get Connection (): SystemConnection {
    return this.Instance.connection;
  }
}
