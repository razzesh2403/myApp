import { Component, OnInit, Inject } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  leaders : Leader[];
  leaderErrMess : string;

  constructor(private leaderService : LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
     this.leaderService.getLeaders().subscribe(leaders => this.leaders = leaders,
      errmess => this.leaderErrMess  = <any>errmess.message);
  }

}
