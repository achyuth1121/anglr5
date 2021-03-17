import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() inline: boolean;
  @Input() show: boolean;
  @Input() background: string;

  constructor() { }

  ngOnInit() {
    if (!this.background) {
      this.background = 'transparent';
    }
  }

}
