/**
 * angular imports
 */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
/**
 * my imports
 */
import { Subscription } from 'rxjs/Rx';
import { CookieModule } from 'ngx-cookie';
import { DrupalConstants } from './application/drupal-constants';
import { MainService } from './main/main.service';
import { SystemService } from './system/system.service';
import { UserService } from './user/user.service';
import { NodeService } from './node/node.service';
import { FileService } from './file/file.service';
import { CommentService } from './comment/comment.service';
import { TaxonomyTermService } from './taxonomy/taxonomy-term.service';
import { TaxonomyVocabularyService } from './taxonomy/taxonomy-vocabulary.service';
import { ViewService } from './view/view.service';
import { EntityService } from './entity/entity.service';
import { MenuService } from './menu/menu.service';
import { SystemConnection } from './models/system';

/**
 * implement APP_INITIALIZER
 * @param systemService system service to connect
 * @see https://gillespie59.github.io/2016/12/04/angular2-code-before-rendering.html
 */
export function init(systemService: SystemService): () => Promise<SystemConnection> {
  return () => {
    const connectionObservable = systemService.connect().toPromise();
    connectionObservable.then(connection => {
      systemService.saveSession(connection.sessid, connection.session_name, connection.user.timestamp);
      DrupalConstants.Connection = connection;
    });
    return connectionObservable;
  };
}

/**
 * main services module with providers
 * if you do not need to import all the services you need to make your own module and import the required providers only
 * ngx-cookie package is required
 * @see https://www.npmjs.com/package/ngx-cookie
 */
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    CookieModule.forRoot(),
  ],
  declarations: [],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [SystemService],
      'multi': true
    },
    MainService,
    SystemService,
    UserService,
    NodeService,
    FileService,
    CommentService,
    TaxonomyTermService,
    TaxonomyVocabularyService,
    ViewService,
    EntityService,
    MenuService
  ],
})
export class Drupal7ServicesModule {}

/**
 * export intrfaces and singleton
 */
export * from './models';
export { DrupalConstants };

/**
 * export services
 */
export {
  MainService,
  SystemService,
  UserService,
  NodeService,
  FileService,
  CommentService,
  TaxonomyTermService,
  TaxonomyVocabularyService,
  ViewService,
  EntityService,
  MenuService
};

/**
 * My English is bad and i know that
 * any comment enhancements are wellcome
 */
