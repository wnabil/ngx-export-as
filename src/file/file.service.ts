import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { FileEntity, CreatedFile } from '../models/file';

/**
 * file service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class FileService extends MainService {
  entityType = 'file';

  /**
   * impelement index resource
   * @return array of files
   */
  getAllFiles(): Observable<FileEntity[]> {
    return this.get();
  }

  /**
   * implement retrive resource
   * @param fid file id to retrive
   * @return object of the file entity
   */
  getFileById(fid: number): Observable<FileEntity> {
    return this.get(fid);
  }

  /**
   * implement create resource
   * @param file file entity to create
   * @return created file details
   */
  createFile(file: FileEntity): Observable<CreatedFile> {
    return this.post(file);
  }

  /**
   * implement delete resource
   * @param fid file id to delete
   * @return boolean array if file deleted, otherwise return false
   * keep in mined that you can not delete a file if it is already referenced by a node
   */
  deleteFile(fid: number): Observable<boolean[]> {
    return this.delete(fid);
  }

  /**
   * creating raw file
   * this require rest support for form multi data
   */
  createRaw(): Observable<boolean[]> {
    return this.post('create_raw');
  }

}
