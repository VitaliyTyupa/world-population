import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../shared/core-services/users.service';


@Component({
  selector: 'wp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error: { isShow: boolean, message: string } = {isShow: false, message: ''};

  constructor(
    private userService: UsersService,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  public onSubmit() {
    const formData = this.form.value;
    const user = JSON.stringify({"email": formData.email, "password": formData.password}) ;

    this.userService.validateUser(user).subscribe(response => {
        console.log(response);
      },
      error => {
        this.error = {isShow: true, message: error.message};
        this.clearError();
      });
  }

  private clearError() {
    setTimeout(() => {
      this.error = {isShow: false, message: ''};
    }, 3000);
  }
}
