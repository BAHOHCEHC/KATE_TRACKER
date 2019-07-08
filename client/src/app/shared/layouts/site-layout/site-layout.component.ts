import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy
} from "@angular/core";
import { AuthService } from "./../../services/auth.service";
import { Router } from "@angular/router";
import { Clients, User } from "../../interfaces";
import { ClientsService } from "../../services/clients-service.service";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user.service";
import { MaterialInstance } from "../../classes/material.service";
import { MaterialService } from "./../../classes/material.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-site-layout",
  templateUrl: "./site-layout.component.html",
  styleUrls: ["./site-layout.component.css"]
})
export class SiteLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("modal") modalRef: ElementRef;

  clients: Clients[];
  loading = false;
  user: User;
  aSub: Subscription;
  show: boolean;
  form: FormGroup;
  clientsNone = true;
  modal: MaterialInstance;

  // private sidenav = [
  //   { url: "/overview", name: "Обзор" },
  //   { url: "/analitic", name: "Аналитика" },
  //   { url: "/history", name: "История" },
  //   { url: "/order", name: "Добавить заказ" },
  //   { url: "/categories", name: "Ассортимент" }
  // ];
  constructor(
    private clientsService: ClientsService,
    private auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      cost: new FormControl(10, [Validators.required, Validators.min(10)])
    });

    this.loading = true;
    this.clientsService.fetchAll().subscribe(clients => {
      this.clients = clients;
      this.clientsNone = false;
      console.log(this.clients);
    });

    // const userId = localStorage.getItem("userId");
    this.aSub = this.userService
      .getUserData(localStorage.getItem("userId"))
      .subscribe((e: User) => {
        this.user = e;
        if (this.user.role === "admin") {
          this.show = true;
        }
        console.log(this.user);
      });
  }
  addNewProject(e) {
    // this.positionId = null;
    this.form.reset({
      name: null,
      cost: 10
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }
  closeModal(){
    this.modal.close();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  ngOnDestroy() {
    this.modal.destroy();
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
  onSubmit() {
    console.log("asdasdas");
  }
  // logOut(event) {
  // event.preventDefault();
  // this.auth.logout();
  // this.router.navigate(["/login"]);
  // }
}
