import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) { 
      this.router.navigate(['/']);
  }
   }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
  });

  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(){
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        console.warn('login');
        this.authenticationService.login(this.f.userName.value, this.f.password.value)
            .subscribe(isValid => {
              console.log('isValid:' + isValid);
              if (isValid) {
                  sessionStorage.setItem('token', btoa(this.f.userName.value + ':' + this.f.password.value));
                  this.router.navigate(['/home']);
              } else {
                  alert("Authentication failed.")
              }
          });
    }
  }
