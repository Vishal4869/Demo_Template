import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/@service/auth.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]

})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    username: this.fb.control(''),
    password: this.fb.control('')
  });

  constructor(
    private fb: FormBuilder,
    private loginService: AuthService,
    private router: Router,
    private messageService: MessageService,

  ) { }

  ngOnInit() {
  }

  onLogin(loginForm: FormGroup) {
    this.loginService.login(loginForm.value.username, loginForm.value.password).subscribe((res: any) => {
      console.log(res);
      if(res.token) {
        localStorage.setItem('access_token', res.token);
        this.loginService.me().subscribe((res: any) => {
          localStorage.setItem('loggedInUser', JSON.stringify(res));
          this.router.navigate(['/']);
        });
      }
    },error => {
      console.error('login error',error.error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 3000 });
    });
  }

}
