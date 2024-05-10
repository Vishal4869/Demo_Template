import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../@api/dummy';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL=environment.API_URL;

const headersData={ Authorization: `Bearer ${localStorage.getItem('access_token')}` }

@Injectable({
    providedIn: 'root'
  })
export class ProductService {

    constructor(private http: HttpClient) { }

    getAllProducts(){
        return this.http.get<any>(`${API_URL}/products`, { headers: headersData });
    }

    getOneProduct(id:string){
        return this.http.get<any>(`${API_URL}/products/${id}`, { headers: headersData });
    }

    deleteOneProduct(id:string){
        return this.http.delete<any>(`${API_URL}/products/${id}`, { headers: headersData });
    }
    createProduct(Data:Product):Observable<Product>{
        return this.http.post<any>(`${API_URL}/products/add`, Data,{ headers: headersData });
    }

    
}
