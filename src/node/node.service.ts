import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { FileEntity, CommentEntity, NodeEntity, CreatedNode, FileAttach } from '../models';

/**
 * node service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class NodeService extends MainService {
  entityType = 'node';

  /**
   * impelement index resource
   * @return array of nodes
   */
  getAllNodes(): Observable<NodeEntity[]> {
    return this.get();
  }

  /**
   * implement retrive resource
   * @param nid node id to retrive
   * @return object of the node entity
   */
  getNodeById(nid: number): Observable<NodeEntity> {
    return this.get(nid);
  }

  /**
   * implement create resource
   * @param node node entity to create
   * @return created node details
   */
  createNode(node: NodeEntity): Observable<CreatedNode> {
    return this.post(node);
  }

  /**
   * implement create resource
   * @param node node to create
   * @return created node details
   */
  updateNode(node: {nid: number}): Observable<CreatedNode> {
    return this.put(node, node.nid);
  }

  /**
   * implement delete resource
   * @param nid node id to delete
   * @return array true if node deleted, otherwise return false array
   */
  deleteNode(nid: number): Observable<boolean[]> {
    return this.delete(nid);
  }

  /**
   * implement files resource
   * @param nid node id
   * @return array of files that attached to that node
   */
  files(nid: number): Observable<FileEntity[]> {
    return this.get(`${nid}/files`);
  }

   /**
   * implement comments resource
   * @param nid node id
   * @return array of comments that attached to that node
   */
  comments(nid: number): Observable<CommentEntity[]> {
    return this.get(`${nid}/comments`);
  }

   /**
   * implement attach_files resource
   * @param nid node id
   * @file object contains the field details and the file to upload
   * @return attached file
   */
  attachFilesToNode(nid: number, file: FileAttach): Observable<FileEntity> {
    return this.post(file, `${nid}/attach_file`);
  }

}
