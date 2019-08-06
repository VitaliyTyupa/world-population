import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/core-services/auth.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';


@Component({
  selector: 'wp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  error: { isShow: boolean, message: string } = {isShow: false, message: ''};

  private subscriptions: { [key: string]: Subscription } = {};

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.subscriptions['route'] = this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {

      } else if (params['accessDenied']) {

      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      for (let id in this.subscriptions) {
        this.subscriptions[id].unsubscribe();
      }
    }
  }

  public onSubmit() {
    this.form.disable();
    const user = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.subscriptions['auth'] = this.auth.login(user).subscribe(
      () => this.router.navigate(['/']),
      error => {
        this.form.enable();
        this.error = {isShow: true, message: error.message};
        this.clearError();
      });
  }

  private clearError() {
    setTimeout(() => {
      this.error = {isShow: false, message: ''};
    }, 5000);
  }
}
