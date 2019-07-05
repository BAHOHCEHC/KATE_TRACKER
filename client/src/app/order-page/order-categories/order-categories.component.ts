import { Component, OnInit } from "@angular/core";
import { Category } from "src/app/shared/interfaces";
import { HttpClient } from "@angular/common/http";
import { CategoriesService } from "src/app/shared/services/categories.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-order-categories",
  templateUrl: "./order-categories.component.html",
  styleUrls: ["./order-categories.component.css"]
})
export class OrderCategoriesComponent implements OnInit {
  categories$: Observable<Category[]>;

  constructor(
    private http: HttpClient,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.categories$ = this.categoriesService.fetchAll();
  }
}
