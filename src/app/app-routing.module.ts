import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { MasterComponent } from '../app/page/master/master.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ReliabilityComponent } from './components/reliability/reliability.component';
import { ReliabilityDetailsComponent } from './components/reliability-details/reliability-details.component';
import { CostComponent } from './components/cost/cost.component';
import { CostDetailsComponent } from './components/cost-details/cost-details.component';
import { ScoreComponent } from './components/score/score.component';
import { ScoreDetailsComponent } from './components/score-details/score-details.component';
import { ReliabilitySummaryComponent } from './components/reliability-summary/reliability-summary.component';
import { AssignmentComponent } from './components/assignment/assignment.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MasterComponent,
    canActivate: [],
    children: [
       { path: '', redirectTo: '/home', pathMatch: 'full'},
       { path: 'home', component: HomePageComponent, data: {reuse: 'home'} },
       { path: 'reliability', component: ReliabilityComponent, data: {reuse: 'home'} },
       { path: 'reliabilityDetails', component: ReliabilityDetailsComponent, data: {reuse: 'home'} },
       { path: 'cost', component: CostComponent, data: {reuse: 'home'} },
       { path: 'costDetails', component: CostDetailsComponent, data: {reuse: 'home'} },
       { path: 'score', component: ScoreComponent, data: {reuse: 'home'} },
       { path: 'scoreDetails', component: ScoreDetailsComponent, data: {reuse: 'home'} },
       { path: 'reliabilitySummary', component: ReliabilitySummaryComponent, data: {reuse: 'home'} },
       { path: 'assignment', component: AssignmentComponent, data: {reuse: 'home'} },
    ],
    resolve: {
      //resolvedData: MasterResolveService
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false, // <-- debugging purposes only
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule {}
