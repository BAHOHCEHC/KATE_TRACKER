import { Component,  AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { AuthService } from './../../services/auth.service';
import { Router } from "@angular/router";
import { MaterialService } from './../../classes/material.service';

@Component({
  selector: "app-site-layout",
  templateUrl: "./site-layout.component.html",
  styleUrls: ["./site-layout.component.scss"]
})


export class SiteLayoutComponent implements AfterViewInit {

@ViewChild('floating') floatingRef: ElementRef

  private links = [
    { url: "/overview", name: "Обзор" },
    { url: "/analitic", name: "Аналитика" },
    { url: "/history", name: "История" },
    { url: "/order", name: "Добавить заказ" },
    { url: "/categories", name: "Ассортимент" }
  ];
  constructor(private auth: AuthService, private router: Router) {}

  logOut(event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }
}
