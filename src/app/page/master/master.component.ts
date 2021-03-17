import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  selectedvalue:string;
  constructor(private router: Router) { }

  fullViewList: any;

   ngOnInit() {
    
   } 

   openReliability() {
    const self = this;
    self.router.navigate(['reliability']);
  
   }

   homePage() {
    const self = this;
    self.router.navigate(['home']);
   

   }

   openCost() {
    const self = this;
    self.router.navigate(['cost']);
  
   }

   openScore() {
    const self = this;
    self.router.navigate(['score']);
  
   }

   openReliabilitySummary() {
    const self = this;
    self.router.navigate(['reliabilitySummary']);
   
   }

   OpenAssignment() {
    const self = this;
    self.router.navigate(['assignment']);
    
   }
  
}
