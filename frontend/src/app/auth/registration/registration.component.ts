import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../shared/core-services/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";


@Component({
  selector: 'wp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  profileForm = this.fb.group({
    logName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  error: { isShow: boolean, message: string } = {isShow: false, message: ''};
  private subscriptions: { [key: string]: Subscription } = {};

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      for (let id in this.subscriptions) {
        this.subscriptions[id].unsubscribe();
      }
    }
  }

  public onSubmit() {
    this.profileForm.disable();
    const user = {
      email: this.profileForm.value.email,
      password: this.profileForm.value.password
    };
    this.subscriptions['register'] = this.auth.register(user).subscribe(
      () => {
        this.router.navigate(['auth/login'], {queryParams: {
          registered: true
          }});
      },
      error => {
        this.error = {isShow: true, message: error.message};
        this.clearError();
        this.profileForm.enable();
      });
  }

  private clearError() {
    setTimeout(() => {
      this.error = {isShow: false, message: ''};
    }, 5000);
  }
}
