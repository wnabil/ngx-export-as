import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { NodeEntity, TaxonomyTerm } from '../models';

/**
 * taxonomy term service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class TaxonomyTermService extends MainService {
  entityType = 'taxonomy_term';

  /**
   * implement index resource
   * @return array of terms
   */
  getAllTaxonomyTerms(): Observable<TaxonomyTerm[]> {
    return this.get();
  }

  /**
   * implement retrive resource
   * @param tid term id
   * @return term object
   */
  getTaxonomyTermById(tid: number): Observable<TaxonomyTerm> {
    return this.get(tid);
  }

  /**
   * implement create resource
   * @param taxonomyTerm the term to create
   * @return array number for the wight of the term
   */
  createTaxonomyTerm(taxonomyTerm: TaxonomyTerm): Observable<number[]> {
    return this.post(taxonomyTerm);
  }

  /**
   * implement update resource
   * @param taxonomyTerm term to update
   * @return array number for the wight of the term
   */
  updateTaxonomyTerm(taxonomyTerm: TaxonomyTerm): Observable<number[]> {
    return this.put(taxonomyTerm, taxonomyTerm.tid);
  }

  /**
   * implement delete resource
   * @param tid term id to delete
   * @return array of deleted term id
   */
  deleteTaxonomyTerm(tid: number): Observable<number[]> {
    return this.delete(tid);
  }

  /**
   * implement selectNodes
   * @param tid term id
   * @return array of nodes that referenced this term in one of the fields
   */
  getAllNodesForTerm(tid: number): Observable <NodeEntity[]> {
    return this.post({tid: tid}, 'selectNodes');
  }
}
