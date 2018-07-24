import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';


import { Dish } from '../shared/dish';
import { baseURL } from '../shared/baseurl';




@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private restangular: Restangular) { }

  getDishes(): Observable<Dish[]> {
    return this.restangular.all('dishes').getList();
  }

  getDish(id: number): Observable<Dish> {
    return  this.restangular.one('dishes', id).get();
  }

  getFeaturedDish(): Observable<Dish> {
    return this.restangular.all('dishes').getList({featured: true})
      .pipe(map(dishes => dishes[0]));
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes()
      .pipe(map(dishes => dishes.map(dish => dish.id)),
        catchError(error => error ));
  }
}
