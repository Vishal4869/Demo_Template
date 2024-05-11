import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(
    public router: Router,
  ) { }
  ngOnInit(): void {
    this.logout();
  }

  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/']);
  }

}
