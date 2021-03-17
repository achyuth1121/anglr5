import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './root/root.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpInterceptorService } from './service/http-interceptor/http-interceptor.service';
import { CVUISelectComponent } from './directive/ui-templates/cvui-select.component';
import { DiacriticsService } from './directive/ui-templates/cvui-select-diacritics.service';
import { CVUISelectDropdownComponent } from './directive/ui-templates/cvui-select-dropdown.component';
import { CVUISelectOptionComponent } from './directive/ui-templates/cvui-select-option.component';
import { CVUISelectHighlightPipe } from './directive/ui-templates/cvui-select-highlight.pipe';
import { SessionService } from './service/session/session.service';

import { AppRoutingModule } from './app-routing.module';
import { MasterComponent } from './page/master/master.component';
import { LoaderComponent } from './components/loader/loader.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ReliabilityComponent } from './components/reliability/reliability.component';
import { ApiService } from './service/api/api-services.service';
import { TableModule } from 'primeng/table';

import 'hammerjs';

import { ReliabilityDetailsComponent } from './components/reliability-details/reliability-details.component';
import { NgApexchartsModule } from "ng-apexcharts"
import { ProgressBarModule } from 'primeng/progressbar';
import { CostComponent } from './components/cost/cost.component';
import { CostDetailsComponent } from './components/cost-details/cost-details.component';
import { ScoreComponent } from './components/score/score.component';
import { ScoreDetailsComponent } from './components/score-details/score-details.component';
import { ReliabilitySummaryComponent } from './components/reliability-summary/reliability-summary.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { SeMasterContetHeightDirective } from './directives/se-master-contet-height.directive';

@NgModule({
  declarations: [
    RootComponent,
    MasterComponent,
    LoaderComponent,
    HomePageComponent,
    ReliabilityComponent,
    CVUISelectComponent,
    CVUISelectDropdownComponent,
    CVUISelectOptionComponent,
    CVUISelectHighlightPipe,
    ReliabilityDetailsComponent,
    CostComponent,
    CostDetailsComponent,
    ScoreComponent,
    ScoreDetailsComponent,
    ReliabilitySummaryComponent,
    AssignmentComponent,
    SeMasterContetHeightDirective,    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    TableModule,
    NgApexchartsModule,
    ProgressBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    ApiService,
    DiacriticsService,
    SessionService,
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
