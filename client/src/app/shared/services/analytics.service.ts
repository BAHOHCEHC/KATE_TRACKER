import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { OverviewPage
// , AnalyticsPage
 } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AnalyticService {
  constructor(private http: HttpClient) {}

  getOverview(): Observable<OverviewPage> {
    return this.http.get<OverviewPage>("api/analytics/overview");
  }
  // getAnalytics(): Observable<AnalyticsPage> {
  //   return this.http.get<AnalyticsPage>("api/analytics/analytics");
  // }
}
