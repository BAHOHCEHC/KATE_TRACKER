import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Client, User } from '../../interfaces';
import { ClientsService } from '../../services/clients-service.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { MaterialInstance } from '../../classes/material.service';
import { MaterialService } from './../../classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styles: [
    `
      :host {
        display: flex;
      }
      .sidenav {
        background-color: #1f2b39;
      }
    `
  ]
})
export class SiteLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef;
  @ViewChild('select') selectRef: ElementRef;
  @ViewChild('confirm') confirmRef: ElementRef;

  loading = false;
  deletedClient: Client = null;
  user: User;
  destroy$ = new Subject<undefined>();
  aSub: Subscription;

  show: boolean;
  form: FormGroup;
  modal: MaterialInstance;
  select: MaterialInstance;
  confirm: MaterialInstance;
  clientsName = [];
  message = '';
  clients$: Observable<Client[]>;

  constructor(
    private clientsService: ClientsService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      currency: new FormControl(null, [Validators.required]),
      tarif: new FormControl(10, [Validators.required, Validators.min(10)])
    });

    this.loading = true;

    this.fethClients();

    this.aSub = this.userService
      .getUserData(localStorage.getItem('userId'))
      .subscribe((e: User) => {
        this.user = e;
        if (this.user.role === 'admin') {
          this.show = true;
        }
        console.log(this.user);
      });
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
    this.select = MaterialService.initSelect(this.selectRef);
    this.confirm = MaterialService.initModal(this.confirmRef);
  }
  fethClients() {
    this.clients$ = this.clientsService.fetchAll().pipe(
      tap(clients => {
        clients.forEach(e => {
          this.clientsName.push(e.name.toLowerCase().replace(/\s/g, ''));
        });
        console.log('****CLIENTS********', this.clientsName);
      })
    );
  }
  addNewProject() {
    this.form.reset({
      name: '',
      currency: 'dollar',
      tarif: 10
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }
  chekClientExist(name) {
    const mutch = this.clientsName.some(item => {
      return name.toLowerCase().replace(/\s/g, '') === item;
    });
    if (mutch) {
      this.message = 'Такой клиент существует';
      return true;
    } else {
      this.form.enable();
      this.message = '';
      return false;
    }
  }
  resetForm() {
    this.form.reset({
      name: '',
      currency: 'dollar',
      tarif: 10
    });
  }
  closeModal() {
    this.modal.close();
    this.resetForm();
  }
  onSubmit() {
    if (!this.form.value.name) {
      return;
    }
    if (this.form.value.name) {
      if (this.chekClientExist(this.form.value.name)) {
        return;
      } else {
        this.form.enable();
      }
    }

    this.form.value.currency = this.selectRef.nativeElement.value;
    this.clientsService.create(this.form.value).subscribe(client => {
      this.router.navigate([`/clients/${client.name}`]);
      this.fethClients();
    });
    this.closeModal();
    MaterialService.updateTextInputs();
  }
  deleteClient(client) {
    this.deletedClient = client;
    this.confirm.open();
  }
  confirmDelete() {
    this.clientsService
      .delete(this.deletedClient._id)
      .subscribe(({ message }) => {
        MaterialService.toast(message);
      });
    this.fethClients();

    const deletedClient = this.router.url.substring('/clients/'.length);
    if (this.deletedClient.name === deletedClient) {
      this.router.navigate(['/clients']);
    }
    this.deletedClient = null;
    this.confirm.close();
  }
  cancelDelete() {
    this.confirm.close();
    this.deletedClient = null;
  }
  ngOnDestroy() {
    this.modal.destroy();
    this.destroy$.next();
    this.destroy$.complete();
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
