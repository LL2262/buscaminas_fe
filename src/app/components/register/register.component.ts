import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  subscribes: Subscription[] = [];
  registerForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder,
    private authData: AuthService,
    private router: Router,
    private toastData: ToastrService) { }

  ngOnInit(): void {
    this.formInit();
  }

  ngOnDestroy() {
    this.subscribes.forEach(s => s.unsubscribe());
  }

  formInit(){
    this.registerForm = this.fb.group({
      name: ['Prueba', [Validators.required]],
      lastName: ['Prueba', [Validators.required]],
      email: ['prueba@prueba', [Validators.required, Validators.email]],
      password: ['pancho2262', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  get f() { return this.registerForm.controls; }

  register(){
    this.submitted = true;
    if(this.registerForm.invalid){
      return;
    }

    let user: User = {};
    user.name = this.registerForm.get('name').value;
    user.lastName = this.registerForm.get('lastName').value;
    user.email = this.registerForm.get('email').value;
    user.password = this.registerForm.get('password').value;

    this.subscribes.push(this.authData.register(user).subscribe(
      _resp => {
        if(_resp.isOk){
          this.toastData.success(_resp.message);
          this.router.navigate(['/login']);
        }else{
          this.toastData.warning(_resp.message);
        }
      }));
  }

}
