import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { Menu } from '../models/menu';

/**
 * menu service for drupal
 * @see https://www.drupal.org/project/services_menu for more details
 */
@Injectable()
export class MenuService extends MainService {
  entityType = 'menu';

  /**
   * implement menu retrive
   * @param menuMachineName menu machine name
   * @return menu witl all children links
   */
  getMenu(menuMachineName: string): Observable<Menu> {
    return this.get(menuMachineName);
  }
}
