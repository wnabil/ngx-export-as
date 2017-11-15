import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection, User, LoginCredentials, CreatedUser, PasswordReset, PasswordResetResponse } from '../models';

/**
 * user service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class UserService extends MainService {
  entityType = 'user';

  /**
   * implement retrive resource
   * @param uid user id to retrive
   * @return user object
   */
  getUserById(uid: number): Observable<User> {
    return this.get(uid);
  }

  /**
   * implement index resource
   * @return array of users
   * Please notice that the user must have the required permission to do this action
   */
  getUsersList(): Observable<User[]> {
    return this.get();
  }

  /**
   * implement create resource
   * @param user user to create
   * @return created user details
   */
  createUser(user: User): Observable<CreatedUser> {
    return this.post(user);
  }

  /**
   * implement update resource
   * @param user user object to update
   * @return updated user object
   */
  updateUser(user: User): Observable<User> {
    return this.put(user, user.uid);
  }

  /**
   * implement delete
   * @param uid user id to delete
   * @return array of boolean, if user deleted will be true, otherwise will be false
   */
  deleteUser(uid: number): Observable<boolean[]> {
    return this.delete(uid);
  }

  /**
   * implement login resource
   * @param user credentials to login "username and password"
   * @return system connection that contains the session details and the user object
   * notice that the user login version must be of version 1.0 at the resources settions at the back-end
   */
  login(user: LoginCredentials): Observable<SystemConnection> {
    const observer = this.post(user, 'login');
    return observer.map((connection: SystemConnection) => {
      this.saveSession(connection.sessid, connection.session_name, connection.user.login, connection.token);
      return connection;
    });
  }

  /**
   * implement logout resource
   * @return new token after logging out
   */
  logout(): Observable<string> {
    const observer = this.post({}, 'logout');
    return observer.flatMap((loggedOut: boolean[]) => {
      if (loggedOut[0]) {
        this.removeSession();
        return this.getToken();
      }
    });
  }

  /**
   * implement request_new_password resource
   * @param useranme the username of the user to request a new password
   * @return array of boolean, if the mail sent successfully will be true, otherwhise will be false.
   * if the server is not a mail server or if there is not mail server configuration this will always return false
   */
  requestNewPassword(useranme: string): Observable<boolean[]> {
    const user = {
      name: useranme
    };
    return this.post(user, 'request_new_password');
  }

  /**
   * implement user_pass_reset resource
   * @param passwordReset Object of the sent details to the email that contains the timestamp and the hashed password
   * @return response of the password reset request
   * this request will automatically logging the user in for only one time and will be expired after the first use.
   * the hashed password can be found at the drupal reset password email and you can customize it if you have token module installed
   */
  userPasswordReset(passwordReset: PasswordReset): Observable<PasswordResetResponse> {
    return this.post(passwordReset, 'user_pass_reset');
  }

  /**
   * implement register resource
   * @param user object to register new account
   * some properties is required if it is set at the account settings inside the drupal admin config
   * @see http://BACKEND/admin/config/people/accounts
   * @return created user details
   */
  registerAccount(user: User): Observable<CreatedUser> {
    return this.post(user, 'register');
  }

  /**
   * implement cancel resource
   * @param uid the user id to cancel
   * @return array of boolean, true if canceled, false otherwhise
   * Please notice the cancelation settings is managed at the backend
   * @see http://BACKEND/admin/config/people/accounts
   */
  cancelUser(uid: number): Observable<boolean[]> {
    return this.post(`${uid}/cancel`);
  }

  /**
   * implement password_reset resource
   * @param uid user id to reset his password
   * @return array of boolean, true if user password has been resetted, false otherwhise
   */
  passwordReset(uid: number): Observable<boolean[]> {
    return this.post(`${uid}/password_reset`);
  }

  /**
   * implement resend_welcome_email
   * @param uid user id to send the email for his account
   * @return array of boolean, if the mail sent successfully will be true, otherwhise will be false.
   * if the server is not a mail server or if there is not mail server configuration this will always return false
   */
  resendWelcomeEmail(uid: number): Observable<boolean[]> {
    return this.post(`${uid}/resend_welcome_email`);
  }

  /**
   * implement token
   */
  token(): Observable<string> {
    return this.getToken();
  }

  /**
   * Both the user and system services may set the session but we do not need to display this method on other services
   * creating a parent method to call the protected method is a good solution.
   * @param sessid
   * @param session_name
   * @param timestamp
   * @param token
   */
  saveSession(sessid: string, session_name: string, timestamp: number, token?: string): void {
    this.saveSessionToken(sessid, session_name, timestamp, token);
  }

}
