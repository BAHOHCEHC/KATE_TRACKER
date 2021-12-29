import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogIn } from 'src/app/store/actions/auth.action';
import { GetAllClientOfUser, RemoveClient } from 'src/app/store/actions/client.action';
import { AppState } from 'src/app/store/app-store.module';

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { MaterialInstance, MaterialService } from '../../classes/material.service';
import { Client, User } from '../../interfaces';
import { ClientsService } from '../../services/clients-service.service';
import { UserService } from '../../services/user.service';

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
  @ViewChild('modal', { static: false })
  modalRef!: ElementRef;
  @ViewChild('select', { static: false })
  selectRef!: ElementRef;
  @ViewChild('confirm', { static: false })
  confirmRef!: ElementRef;

  form!: FormGroup;

  loading = false;
  deletedClient!: Client;
  user: User | undefined;
  destroy$ = new Subject<undefined>();

  show = false;
  modal!: MaterialInstance;
  select!: MaterialInstance;
  confirm!: MaterialInstance;
  clientsName: string[] = [];
  message = '';
  clients$: Observable<Client[]> | undefined;

  constructor(
    private clientsService: ClientsService,
    private userService: UserService,
    private router: Router,
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.loading = true;

    this.fethClients();

    this.userService
      .getUserData(localStorage.getItem('userId'))
      .subscribe((user: User) => {
        this.user = user;
        if (user.role === 'admin') {
          this.show = true;
        }
        console.log(this.user);

        this.store.dispatch(new LogIn(user));
      });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
    this.select = MaterialService.initSelect(this.selectRef);
    this.confirm = MaterialService.initModal(this.confirmRef);
  }

  addNewProject(): void {
    this.form.reset();
    if (this.modal?.open) {
      this.modal.open();
    }
    MaterialService.updateTextInputs();
  }

  chekClientExist(name: string): boolean {
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


  private fethClients(): void {
    this.clients$ = this.clientsService.fetchAll().pipe(
      tap(clients => {

        this.store.dispatch(new GetAllClientOfUser(clients));

        clients.forEach(client => {
          return this.clientsName.push(client.name.toLowerCase().replace(/\s/g, ''));
        });

        console.log('****CLIENTS********', this.clientsName);
      })
    );
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      tarif: [10, [Validators.required, Validators.min(10)]],
    });
  }


  resetForm(): void {
    this.form.reset({
      name: '',
      currency: 'dollar',
      tarif: 10
    });
  }

  closeModal(): void {
    if (this.modal?.close) {
      this.modal.close();
    }
    this.resetForm();
  }

  onSubmit(): void {
    console.log(this.form);
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

  deleteClient(client: Client): void {
    this.deletedClient = client;
    if (this.confirm?.open) {
      this.confirm.open();
    }
  }

  confirmDelete(): void {
    const deletedClientId = this.deletedClient ? this.deletedClient._id : '';

    if (deletedClientId) {
      this.clientsService
        .delete(deletedClientId)
        .subscribe(({ message }) => {
          MaterialService.toast(message);
        });

      // this.store.dispatch(new RemoveClient(this.deletedClient));

      this.fethClients();

      const deletedClient = this.router.url.substring('/clients/'.length);

      if (this.deletedClient.name === deletedClient) {
        this.router.navigate(['/clients']);
      }

      // this.deletedClient = null;
      if (this.confirm?.close) {
        this.confirm.close();
      }
    }

  }

  cancelDelete(): void {
    if (this.confirm?.close) {
      this.confirm.close();
    }
    // this.deletedClient = undefined;
  }

  ngOnDestroy(): void {
    if (this.modal?.destroy) {
      this.modal.destroy();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}
