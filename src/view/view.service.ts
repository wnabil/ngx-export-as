import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { ViewOptions } from '../models/view';

/**
 * view service for drupal using services_views module
 * @see https://www.drupal.org/project/services_views
 */
@Injectable()
export class ViewService extends MainService {
  entityType = 'views';

  /**
   * impelemnt retrive resource
   * @param viewMachineName view machine name
   * @param options parameters of filteration for this view
   * @return array of view rows OR view html code if the options format_output is 1
   */
  getView(viewMachineName: string, options?: ViewOptions): Observable<any[]> {
    const args = this.getArgs(options);
    return this.get(viewMachineName + args);
  }

}
