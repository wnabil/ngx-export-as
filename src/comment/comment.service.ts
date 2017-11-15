import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { CommentEntity, CreatedComment } from '../models/comment';

/**
 * comment service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class CommentService extends MainService {

  /**
   * entity type is comment
   */
  entityType = 'comment';

  /**
   * implement comment index resource
   * @return list of comments
   */
  getAllComments(): Observable<CommentEntity[]> {
    return this.get();
  }

  /**
   * implement comment retrive method
   * @param cid comment id
   * @return drupal comment entity
   */
  getCommentById(cid: number): Observable<CommentEntity> {
    return this.get(cid);
  }

  /**
   * implement create resource
   * @param comment the comment to create
   * @return created comment details
   */
  createComment(comment: CommentEntity): Observable<CreatedComment> {
    return this.post(comment);
  }

  /**
   * implement update resource
   * @param comment comment to update
   * @return array of comment id
   */
  updateComment(comment: CommentEntity): Observable<number[]> {
    return this.put(comment, comment.cid);
  }

  /**
   * implement delete resource
   * @param cid comment id to delete
   * @return array of boolean, if comment deleted the array will will contains true
   */
  deleteComment(cid: number): Observable<boolean[]> {
    return this.delete(cid);
  }

  /**
   * implement countAll resource
   * @param nid host node id of the comments
   * @return number of comments on the node
   */
  countAllCommentsByNodeId(nid: number): Observable<number> {
    return this.post({nid: nid}, 'countAll');
  }

  /**
   * implement countNew resource.
   * @param nid host node id of the new comments
   * @return number of the new comments for the giving node id
   */
  countNewCommentsByNodeId(nid: number): Observable<number> {
    return this.post({nid: nid}, 'countNew');
  }

}
