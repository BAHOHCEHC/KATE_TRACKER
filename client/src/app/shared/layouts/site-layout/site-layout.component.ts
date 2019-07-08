import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy
} from "@angular/core";
// import { AuthService } from "./../../services/auth.service";
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
  @ViewChild("select") selectRef: ElementRef;

  clients: Clients[];
  loading = false;
  user: User;
  aSub: Subscription;
  show: boolean;
  form: FormGroup;
  clientsNone = true;
  modal: MaterialInstance;
  select: MaterialInstance;
  clientsId = [];
  clientExist = false;

  constructor(
    private clientsService: ClientsService,
    // private auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("Project Name", [Validators.required]),
      currency: new FormControl(null, [Validators.required]),
      cost: new FormControl(10, [Validators.required, Validators.min(10)])
    });

    this.loading = true;

    this.clientsService.fetchAll().subscribe(clients => {
      this.clients = clients;
      this.clientsNone = false;
      this.clients.forEach(e => {
        this.clientsId.push(e.name.toLowerCase().replace(/\s/g, ""));
      });
      console.log("****CLIENTS********", this.clients);
    });

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
  addNewProject() {
    // this.positionId = null;
    this.form.reset({
      name: "Project Name",
      currency: null,
      cost: 10
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }
  chekClientExist(name) {
    let mutch = this.clientsId.some(item => {
      return name.toLowerCase().replace(/\s/g, "") == item;
    });
    if (mutch) {
      this.clientExist = true;
      return true;
    } else {
      this.clientExist = false;
      return false;
    }
  }
  closeModal() {
    this.modal.close();
    this.form.reset({
      name: "Project Name",
      currency: "U.S. Dollar",
      cost: 10
    });
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
    this.select = MaterialService.initSelect(this.selectRef);
  }
  ngOnDestroy() {
    this.modal.destroy();
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    // this.form.disable();
    if (this.chekClientExist(this.form.value.name)) {
      this.form.enable();
      return;
    }
    this.form.value.currency = this.selectRef.nativeElement.value,

    console.log(this.form.value);

    this.closeModal();
    // this.router.navigate(["/reports"]);

    MaterialService.updateTextInputs();
  }

  // logOut(event) {
  // event.preventDefault();
  // this.auth.logout();
  // this.router.navigate(["/login"]);
  // }
}
