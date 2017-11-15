import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Rx';
import { DrupalConstants } from '../application/drupal-constants';

/**
 * the main service is the basic http service of all other services "parent" that implements all the required request.
 * this service will add the headers automatically for each request it self
 */
@Injectable()
export class MainService {
  /**
   * entity type of the current service, the main service dont have anything but the other services must use it
   * for example "node, comment, user, system"
   */
  protected readonly entityType: string;

  /**
   * the main constractor of this service will inject the required services dynamically.
   * @param http basic http service
   * @param cookieService ngx-cookie service provider to save the cookies
   * @see https://angular.io/guide/dependency-injection
   * @see https://www.npmjs.com/package/ngx-cookie
   */
  constructor(protected http: Http, public cookieService: CookieService) { }

  /**
   * a getter to return the required headers for drupal
   * X-CSRF-Token - application token from services/session/connect
   * Content-Type - the type of the request content.
   * Accept - forcing drupal to return the response as a json object
   * @return object of the headers
   */
  get options(): RequestOptionsArgs {
    const headers = new Headers();
    headers.set('X-CSRF-Token', this.cookieService.get('token'));
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    const options: RequestOptionsArgs = new RequestOptions();
    options.headers = headers;
    options.withCredentials = true;
    return options;
  }

  /**
   * getting token from drupal services module
   * @return http text token response
   */
  protected getToken(): Observable<string> {
    return this.httpRequestWithConfig(
      this.http.get(`${DrupalConstants.backEndUrl}services/session/token`, this.options), false
    ).map(res => res.text());
  }

  /**
   * Saving drupal session and token in cookies using ngx-cookie service
   * @param sessid drupal sessionid
   * @param session_name drupal session name
   * @param timestamp the time of the last connection to check the expiration date
   * @param token X-CSRF-Token from drupal services/session/token
   */
  protected saveSessionToken(sessid: string, session_name: string, timestamp: number, token?: string): void {
    if (token) {
      this.cookieService.put("token", token);
    }
    this.cookieService.put("sessid", sessid);
    this.cookieService.put("session_name", session_name);
    this.cookieService.put("timestamp", timestamp.toString());
  }

  /**
   * building up the full url path for each resource and / or params
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return full request path after adding the entity type and resource param
   */
  protected fullRequestURL(resource?: string | number): string {
    var request_url = DrupalConstants.restUrl;

    if (this.entityType) {
      request_url += this.entityType + '/';
    }

    if (resource) {
      request_url += resource;
    }

    return request_url;
  }

  /**
   * adding http request configs: request timeout, error handler, json convert
   * its a recursion method that will recall itself if the json convert is true
   * @param httpObservableRequest the http Observable to request
   * @param toJson to convert the response to json object
   * @return Observable of the request after adding required configs
   */
  protected httpRequestWithConfig(httpObservableRequest: Observable<any>, toJson: boolean = true): Observable<any> {
    if (toJson) {
      return this.httpRequestWithConfig(httpObservableRequest, false).map(res => res.json());
    }
    return httpObservableRequest.timeout(DrupalConstants.Settings.requestTimeout).catch(err => Observable.throw(err));
  }

  /**
   * basic http get request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  protected get(resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.get(this.fullRequestURL(resource), this.options)
    );
  }

  /**
   * basic http post request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  protected post(body: any = {}, resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.post(this.fullRequestURL(resource), body, this.options),
    );
  }

  /**
   * basic http put request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  protected put(body: any = {}, resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.put(this.fullRequestURL(resource), body, this.options),
    );
  }

  /**
   * basic http delete request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  protected delete(resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.delete(this.fullRequestURL(resource), this.options),
    );
  }

  /**
   * Clearing drupal session after logging out
   */
  protected removeSession(): void {
    this.cookieService.remove("token");
    this.cookieService.remove("sessid");
    this.cookieService.remove("session_name");
    this.cookieService.remove("timestamp");
  }

  /**
   * Checking the current connection if the connection is init and valid
   * @return if connection is valid
   */
  protected isConnected(): boolean {
    return this.cookieService.get("token") &&
    this.cookieService.get("sessid") &&
    this.cookieService.get("session_name") &&
    !this.isConnectionExpired() ?
    true : false;
  }

  /**
   * Check if the drupal session is timedout.
   * @return true if the current date is less than the login date by 24 day "drupal default session timeout is 24 day".
   */
  protected isConnectionExpired(): boolean {
    const nowTS = Math.floor(Date.now());
    const expirationTS = 1987200000; // 24 days
    return nowTS - +this.cookieService.get("timestamp") < expirationTS;
  }

  /**
   * Serializin arguments as a string
   * @param options object of drupal parametars to serialize
   * @return string of parameters
   */
  protected getArgs(options: any): string {
    if (!options) {
      return '';
    }
    var args = '?';
    Object.keys(options).forEach((key, index) => {
      args += this.optionToString(key, options[key]);
    });
    return args;
  }

  /**
   * serializing eatch option
   * @param key option key
   * @param value option value
   * @return single option serilization
   */
  protected optionToString(key: string, value: any): string {
    if (!value) {
      return '';
    }
    var str = '';
    if (value instanceof Array) {
      value.forEach((element, index) => {
        str += `${key}[${index}]=${element}&`;
      });
    } else if (value instanceof Object) {
      Object.keys(value).forEach((element, index) => {
        if (value instanceof Object) {
          str += `${key}[${element}]${this.serializeObject(value[element])}`;
        } else {
          str += `${key}[${element}]=${value[element]}&`;
        }
      });
    } else {
      str += `${key}=${value}&`;
    }
    return str;
  }

  /**
   * serializing the object keys
   * @param obj object to serialize
   */
  private serializeObject(obj: any): string {
    var str = '';
    Object.keys(obj).forEach((key, index) => {
      const value = obj[key];
      if (value instanceof Object) {
        str += `[${key}]${this.serializeObject(value)}`;
      } else {
        str += `[${key}]=${value}&`;
      }
    });
    return str;
  }
}
