import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `
  ]
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  @ViewChild('input') inputRef: ElementRef | undefined;
  readonly form: FormGroup;

  aSub$: Subscription | undefined;
  image: File | undefined;
  imagePreview: any = '';

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnInit() { }

  private buildForm(): FormGroup {
    return this.fb.group({
      imageSrc: [null, [Validators.required]],
      nickName: ['', [Validators.required]],
      role: ['spectator', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy() {
    if (this.aSub$) {
      this.aSub$.unsubscribe();
    }
  }

  // onFileUpload(event: any) {
  //   const file = event.target.files[0];
  //   this.image = file;

  //   this.form.controls.imageSrc.setValue(file);

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result;
  //   };
  //   reader.readAsDataURL(file);
  // }

  onSubmit() {
    this.form.disable();
    console.log(this.form);
    this.aSub$ = this.auth
      .register(this.form.value, this.form.value.imageSrc)
      .subscribe(
        () => {
          this.router.navigate(['/login'], {
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

  // togleVisibility() {
  //   this.inputRef.nativeElement.click();
  // }
}
