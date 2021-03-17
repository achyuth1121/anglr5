import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api-services.service';
import { SessionService } from '../../service/session/session.service';
import { Router } from '@angular/router';
import { ApexNonAxisChartSeries, ApexPlotOptions, ApexChart, ApexAxisChartSeries, ChartComponent, ApexDataLabels, ApexXAxis } from "ng-apexcharts";


@Component({
  selector: 'app-cost-details',
  templateUrl: './cost-details.component.html',
  styleUrls: ['./cost-details.component.scss']
})
export class CostDetailsComponent implements OnInit {

  subscriptionlist: any = [];
  selectedSubscription: any = [];
  subscriptionDetails: any = [];
  subscriptionScore: any = [];
  istargetApp: boolean = false;

  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  lables: string[];

  series1: ApexNonAxisChartSeries;
  chart1: ApexChart;
  plotOptions1: ApexPlotOptions;
  lables1: string[];

  series2: ApexNonAxisChartSeries;
  chart2: ApexChart;
  plotOptions2: ApexPlotOptions;
  lables2: string[];

  barGraphSeries: ApexAxisChartSeries;
  barGraphChart: ApexChart;
  barGraphPlotOptions: ApexPlotOptions;
  //barGraphLables: ApexDataLabels;
  barGraphXaxis: ApexXAxis;
  isLoading: boolean;  

  
  constructor(private api: ApiService, private router: Router, private session: SessionService) { }

  ngOnInit() {
    const self = this;
    self.selectedSubscription = self.session.subscriptionID;
    self.getCostDetails();  
  }

  getCostDetails() {
    const self = this;
    self.isLoading = true;
    let value: number = 0;
    if (self.selectedSubscription.length != 0) {
      self.session.subscriptionID = self.selectedSubscription;
    }
    
    let interval = setInterval(() => {
        value = value + Math.floor(Math.random() * 10) + 1;
        if (value >= 100) {
            value = 100;            
            clearInterval(interval);
        }
    }, 500);

    self.api.getSubscriptions().then((data: any) => {
      self.subscriptionlist = data;          
      self.isLoading = false;  
    }, (err) =>  {});

    self.api.getCostSubscriptionDetails(self.session.subscriptionID).then((data: any) => {      
      self.subscriptionDetails = data.Recommendations;
      
      self.series = [data.Scores.Score.Overall];
      self.chart = {type: "radialBar"};      
      self.lables = ["Overall"];

      self.series1 = [data.Scores.Score.Reliability];
      self.chart1 = {type: "radialBar"};      
      self.lables1 = ["Reliability"];

      self.series2 = [data.Scores.Score.Cost];
      self.chart2 = {type: "radialBar"};      
      self.lables2 = ["Cost"];      
      self.istargetApp = true;

      self.barGraphSeries = [{name: "basic", data: [data.Scores.Score.Overall, data.Scores.Score.Reliability, data.Scores.Score.Cost]}];
      self.barGraphChart = {type: "bar"};      
      self.barGraphPlotOptions = {bar: {horizontal: false}};
      //self.barGraphLables = {enabled: false};
      self.barGraphXaxis = {categories: ["Overall", "Reliability", "Cost"]};    

      self.istargetApp = true;
      //self.selectedSubscription = self.session.subscriptionID;
      
    }, (err) =>  {});
  }

}
