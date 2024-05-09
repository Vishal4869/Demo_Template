import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Machinery } from '../@api/machinary';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL=environment.API_URL;

const headersData={ Authorization: `Bearer ${localStorage.getItem('access_token')}` }

@Injectable({
    providedIn: 'root'
  })
export class MachineryService {

    constructor(private http: HttpClient) { }

    getMachinery(){
        return this.http.get<any>(`${API_URL}/machinery`, { headers: headersData });
    }

    getOneMachinery(id:string){
        return this.http.get<any>(`${API_URL}/machinery/${id}`, { headers: headersData });
    }

    deleteOneMachinery(id:string){
        return this.http.delete<any>(`${API_URL}/machinery/${id}`, { headers: headersData });
    }

    deleteSelectedMachineries(ids:any){
        return this.http.post<any>(`${API_URL}/machinery/bulk-delete`,ids,{ headers: headersData });
    }

    createMachinery(machineData:Machinery):Observable<Machinery>{
        return this.http.post<any>(`${API_URL}/machinery`, machineData,{ headers: headersData });
    }

    updateStatus(id:string,statusData:any):Observable<any>{
        return this.http.patch<any>(`${API_URL}/machinery/update-history/${id}`, statusData, {headers: headersData });
    }
    
}
