import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess : string;
  promoErrMess : string;
  leaderErrMess : string;

  constructor(private dishservice: DishService,
    @Inject('BaseURL') private BaseURL,
    private leaderService : LeaderService,
    private promotionservice: PromotionService) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish,
      errmess => this.dishErrMess  = <any>errmess.message);
    this.promotionservice.getFeaturedPromotion().subscribe( promotion => this.promotion = promotion,
      errmess => this.promoErrMess  = <any>errmess.message);
    this.leaderService.getFeaturedLeader().subscribe( leader => this.leader = leader,
      errmess => this.leaderErrMess  = <any>errmess.message);
  }

}
