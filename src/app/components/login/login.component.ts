import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  subscribes: Subscription[] = [];
  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder,
    private authData: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.formInit();
  }

  ngOnDestroy() {
    this.subscribes.forEach(s => s.unsubscribe());
  }

  formInit(){
    this.loginForm = this.fb.group({
      email: ['lucho_bio@hotmail.com', [Validators.required, Validators.email]],
      password: ['pancho2262', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    });
  }

  get f() { return this.loginForm.controls; }

  login(){
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }

    let user: User = {};
    user.email = this.loginForm.get('email').value;
    user.password = this.loginForm.get('password').value;

    this.subscribes.push(this.authData.login(user).subscribe(
      _resp => {
        if(_resp.isOk){
          this.router.navigate(['/home']);
        }
      }));
  }
}
