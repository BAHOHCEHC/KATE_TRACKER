import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent implements OnInit {
  show: boolean;
  constructor(private userService: UserService, ) { }

  ngOnInit() {
    this.show = localStorage.getItem('userId') == null || this.check() ? false : true;
  }
  check() {
    return this.userService
      .getUserData(localStorage.getItem('userId'))
      .subscribe((user: User) => {
        if (user.role === 'admin') {
          return false;
        }
      });
  }
}
