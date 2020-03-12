import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styles: [
    `
      .statusBar {
        padding: 0 40px;
      }
    `
  ]
})
export class ClientsPageComponent implements OnInit, OnDestroy {
  constructor() {}
  ngOnInit() {}

  ngOnDestroy() {
    console.log(this);
  }

  copyLink() {
    // console.log(this.id);
  }
}
