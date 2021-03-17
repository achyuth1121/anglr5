import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api-services.service';
import { Router } from '@angular/router';
import { SessionService } from '../../service/session/session.service';


@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  //subcription = new FormControl();

  subscriptionlist: any = [];
  istargetApp: boolean = false;
  selectedSubscription: any = [];
  isLoading: boolean;
  value: number = 0;

  constructor(private api: ApiService, private router: Router, private session: SessionService) { }

  ngOnInit() {
    const self = this;
    self.isLoading = true;

    let interval = setInterval(() => {
        this.value = this.value + Math.floor(Math.random() * 10) + 1;
        if (this.value >= 100) {
            this.value = 100;            
            clearInterval(interval);
        }
    }, 500);

    self.api.getSubscriptions().then((data: any) => {
      self.subscriptionlist = data;
      self.istargetApp = true;
      self.isLoading = false;
    }, (err) =>  {});
  }

  getCostDetails() {
    const self = this;
    self.session.subscriptionID = self.selectedSubscription;
    self.router.navigate(['scoreDetails']);
  }

}
