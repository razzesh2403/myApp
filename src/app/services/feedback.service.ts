import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs';

import { Feedback } from '../shared/feedback';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  feedback : Feedback;

  constructor(private restangular: Restangular) { }

  getFeedbacks(): Observable<Feedback[]> {
    return this.restangular.all('feedback').getList();
  }
  
  submitFeedback(inputFeedback : Feedback): Observable<Feedback> {
    return this.restangular.all('feedback/').post(inputFeedback);
  }

}
