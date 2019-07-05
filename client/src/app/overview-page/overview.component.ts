import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Observable } from "rxjs";
import { OverviewPage } from "../shared/interfaces";
import { AnalyticService } from "../shared/services/analytics.service";
import {
  MaterialService,
  MaterialInstance
} from "../shared/classes/material.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"]
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("tapTarget") tapTargetRef: ElementRef;
  data$: Observable<OverviewPage>;
  tapTargets: MaterialInstance;
  yesterday = new Date();

  constructor(private service: AnalyticService) {}

  ngOnInit() {
    this.data$ = this.service.getOverview();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }
  ngAfterViewInit() {
    this.tapTargets = MaterialService.initTaptarget(this.tapTargetRef);
  }
  ngOnDestroy() {
    this.tapTargets.destroy();
  }
  openInfo() {
    this.tapTargets.open();
  }
}
