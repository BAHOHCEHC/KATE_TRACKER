import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-clients-page",
  templateUrl: "./clients-page.component.html",
  styleUrls: ["./clients-page.component.css"]
})
export class ClientsPageComponent implements OnInit, OnDestroy {
  id: any;
  sub: Subscription;

  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    // this.id = this.route.snapshot.params["id"];
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params.id;
    // });
    this.sub = this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      console.log(this.id);

    });
    console.log(this.route.params);
  }

  ngOnDestroy() {
    console.log(this);

    this.sub.unsubscribe();
  }
  copyLink() {
    console.log(this.id);
  }
}
