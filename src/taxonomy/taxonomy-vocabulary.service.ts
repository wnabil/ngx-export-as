import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { TaxonomyVocabulary, TaxonomyVocabularyTree } from '../models/taxonomy-vocabulary';

/**
 * taxonomy vocabulary service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class TaxonomyVocabularyService extends MainService {
  entityType = 'taxonomy_vocabulary';

  /**
   * implement index resource
   * @return array of the available vocabularies
   */
  getAllVocabularies(): Observable<TaxonomyVocabulary[]> {
    return this.get();
  }

  /**
   * implement retrive resource
   * @param vid vocabulary id
   * @return vocabulary object
   */
  getTaxonomyVocabularyById(vid: number): Observable<TaxonomyVocabulary> {
    return this.get(vid);
  }

  /**
   * implement create resource
   * @param taxonomyVocabulary the vocabulary to create
   * @return array of vocabulary id
   */
  createTaxonomyVocabulary(taxonomyVocabulary: TaxonomyVocabulary): Observable<number[]> {
    return this.post(taxonomyVocabulary);
  }

  /**
   * implement update resource
   * @param taxonomyVocabulary the vocabulary to update
   * @return array of the current vocabulary whight
   */
  updateTaxonomyVocabulary(taxonomyVocabulary: TaxonomyVocabulary): Observable<number[]> {
    return this.put(taxonomyVocabulary, taxonomyVocabulary.vid);
  }

  /**
   * implement delete resource
   * @param vid vocabulary id to delete
   * @return array of deleted vocabulary id
   */
  deleteTaxonomyVocabulary(vid: number): Observable<number[]> {
    return this.delete(vid);
  }

  /**
   * implement retrieveByMachineName resource
   * @param vocabularyMachineName vocabulary machine name
   * @return vocabulary object
   */
  getTaxonomyVocabularyByMachineName(vocabularyMachineName: string): Observable<TaxonomyVocabulary> {
    return this.post({machine_name: vocabularyMachineName}, 'retrieveByMachineName');
  }

  /**
   * implement getTree resource
   * @param vid vocabulary id
   * @return a full list of taxonomy terms inside this vocabulary as a tree structure.
   */
  getTaxonomyVocabularyTree(vid: number): Observable<TaxonomyVocabularyTree[]> {
    return this.post({vid: vid}, 'getTree');
  }

}
