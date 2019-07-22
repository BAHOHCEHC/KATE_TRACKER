import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-clients-page",
  templateUrl: "./clients-page.component.html",
  styleUrls: ["./clients-page.component.css"]
})
export class ClientsPageComponent implements OnInit, OnDestroy {

  constructor() {}
  ngOnInit() {
  }

  ngOnDestroy() {
    console.log(this);

  }

  copyLink() {
    // console.log(this.id);
  }
}
