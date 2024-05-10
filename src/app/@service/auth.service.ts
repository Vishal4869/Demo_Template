import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {catchError, map} from 'rxjs/operators';

const API_URL=environment.API_URL;

const headersData={ Authorization: `Bearer ${localStorage.getItem('access_token')}` }

@Injectable({
    providedIn: 'root'
  })
export class AuthService {

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post(`${API_URL}/auth/login`, { username, password });
    }
    
    me(){
        return this.http.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });
    }
}