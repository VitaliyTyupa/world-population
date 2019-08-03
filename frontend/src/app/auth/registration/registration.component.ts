import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UsersService} from "../../shared/core-services/users.service";
import {logger} from "codelyzer/util/logger";

@Component({
  selector: 'wp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  profileForm = this.fb.group({
    logName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UsersService
    ) { }

  ngOnInit() {

  }

  public onSubmit() {
    console.log(this.profileForm.value);
    const user = {
      "email": this.profileForm.value.email,
      "password": this.profileForm.value.password
    };
    console.log(user);
    this.userService.registrationUser(user).subscribe(item => {
      console.log(item);
    })
  }
}
