import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api-services.service';
import { Router } from '@angular/router';
import { SessionService } from '../../service/session/session.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent  implements OnInit {

  subscriptionlist: any = [];
  selectedSubscription: any = [];
  
  requirementList: any = [];
  selectedRequirement: any ;

  istargetApp: boolean = false;
  
  isLoading: boolean;
  value: number = 0;

  haveActionItem: boolean = false;
  impactedResources: any = []
 

  constructor(private api: ApiService, private router: Router, private session: SessionService) { }


  ngOnInit() {
    const self = this;

    self.api.getSubscriptions().then((data: any) => {
      self.subscriptionlist = data;
      self.istargetApp = true;
      self.isLoading = false;
    }, (err) =>  {});
  }


  getReliabilityRequirements() {
    const self = this;
    self.isLoading = true;
    let value: number = 0;
    if (self.selectedSubscription.length != 0) {
      self.session.subscriptionID = self.selectedSubscription;
    }
    

    self.api.getReliabilitySubscriptionRequirements(self.session.subscriptionID).then((data: any) => {      
      if (data.Requirements.length != 0) {
        self.requirementList = data.Requirements;
      }
           
      self.istargetApp = true;      
      
    }, (err) =>  {});
    self.haveActionItem=false;
  }

  getImpactedResources(v) {
    const self = this;
    this.selectedRequirement=v
    for(var i =0; i< self.requirementList.length; i++)
    {
      if(self.requirementList[i].RequirementID == self.selectedRequirement)
      {
        self.haveActionItem=true;
        self.impactedResources=self.requirementList[i].ImpactedAzureResources
        break;
      }
    }

  }

  log(x) {console.log(x);}

  submit(f) {
    console.log(f);
  }

}
