import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { CustomEntityOptions } from '../models/custom-entity';

/**
 * custom entity service for drupal using services_entity module
 * @see https://www.drupal.org/project/services_entity
 */
@Injectable()
export class EntityService extends MainService {
  /**
   * the entity prefix for all the entities
   */
  entityType = 'entity_';

  /**
   * getting the full entity url for the entity
   * @override the parent method
   * @param entityMachineName entity machine name, ex: node, user
   * @return string of full path to resource
   */
  protected fullRequestURL(entityMachineName: string): string {
    var request_url = DrupalConstants.restUrl;
    request_url += this.entityType + entityMachineName;

    return request_url;
  }

  /**
   * implement index resource
   * @param entityMachineName entity machine name, ex: node, user
   * @param options parameter options
   * @return array of the required entity type.
   * personally suggest to create an interface for each type you want to retrive, you can use the models in this module as a perent interfaces.
   */
  indexEntity(entityMachineName: string, options?: CustomEntityOptions): Observable<any[]> {
    const args = this.getArgs(options);
    return this.get(entityMachineName + args);
  }

  /**
   * implement retrive resource
   * @param entityMachineName entity machine name, ex: node, user
   * @param selector the id of the entity
   * @param options parameter options
   * @return entity object
   */
  retrieveEntity(entityMachineName: string, selector: number, options?: CustomEntityOptions): Observable<any> {
    const args = this.getArgs(options);
    return this.get(`${entityMachineName}/${selector}${args}`);
  }

  /**
   * implement delete resource
   * @param entityMachineName entity machine name, ex: node, user
   * @param selector the id of the entity
   * @return null if the entity is deleted,otherwise throws an error.
   */
  deleteEntity(entityMachineName: string, selector: number): Observable<null> {
    return this.delete(`${entityMachineName}/${selector}`);
  }

  /**
   * implement create resource
   * @param entityMachineName entity machine name, ex: node, user
   * @param entity entity object to create
   * @return created entity
   */
  createEntity(entityMachineName: string, entity: Object): Observable<any> {
    return this.post(entity, entityMachineName);
  }

  /**
   * implement update resource
   * @param entityMachineName entity machine name, ex: node, user
   * @param entity entity to update
   * @param selector entity id to update and must match the id inside the entity object
   * @return updated entity
   */
  updateEntity(entityMachineName: string, entity: any, selector: number): Observable<any> {
    return this.put(entity, `${entityMachineName}/${selector}`);
  }

}
