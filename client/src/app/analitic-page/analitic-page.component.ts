import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { AnalyticService } from "../shared/services/analytics.service";
import { Subscription } from "rxjs";
// import { Chart } from "chart.js";
// import { AnalyticsPage } from "../shared/interfaces";

@Component({
  selector: "app-analitic-page",
  templateUrl: "./analitic-page.component.html",
  styleUrls: ["./analitic-page.component.css"]
})
export class AnaliticPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild("gain") gainRef: ElementRef;
  @ViewChild("order") orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  panding = true;

  constructor(private service: AnalyticService) {}

  ngAfterViewInit() {
    let GAIN_CONFIG: any = {
      label: "выручка",
      color: "rgba(255, 99, 132, 1)"
    };

    // this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
    //   this.average = data.average;
    //   GAIN_CONFIG.labels = data.chart.map(item => {
    //     return item.label;
    //   });
    //   GAIN_CONFIG.data = data.chart.map(item => {
    //     return item.gain;
    //   });

    //   const gainCTX = this.gainRef.nativeElement.getContext("2d");
    //   gainCTX.canvas.height = "300px";
    //   new Chart(gainCTX, createChartCFG(GAIN_CONFIG));
    //   this.panding = true;
    // });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
// function createChartCFG({ labels, data, label, color }) {
//   return {
//     type: "line",
//     options: {
//       responsive: true
//     },
//     data: {
//       labels,
//       datasets: [
//         { label, data, borderColor: color, steppedLine: false, fill: false }
//       ]
//     }
//   };
// }
