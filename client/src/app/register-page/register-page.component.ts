import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MaterialService } from "../shared/classes/material.service";

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.css"]
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  @ViewChild("input") inputRef: ElementRef;
  form: FormGroup;
  aSub: Subscription;
  image: File;
  imagePreview: any = "";

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      imageSrc: new FormControl(null),
      nickName: new FormControl(null, [Validators.required]),
      role: new FormControl("spectator", [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    this.form.controls.imageSrc.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    this.form.disable();
     console.log(this.form);
    this.aSub = this.auth
      .register(this.form.value, this.form.value.imageSrc)
      .subscribe(
        () => {
          this.router.navigate(["/login"], {
            queryParams: {
              registered: true
            }
          });
        },
        error => {
          MaterialService.toast(error.error.message);
          this.form.enable();
        }
      );
  }

  togleVisibility() {
    this.inputRef.nativeElement.click();
  }
}
