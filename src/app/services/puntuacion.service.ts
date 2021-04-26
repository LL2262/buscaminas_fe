import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Puntuacion } from '../models/puntuacion';
import { GLOBALURL } from './globalUrl';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {

  constructor(private http: HttpClient) { }

  guardarPuntuacion(puntuacion: Puntuacion){
    return this.http.post<any>(`${GLOBALURL}/punctuations/create`, puntuacion);
  }

  traerPuntuacion(){
    return this.http.get<any>(`${GLOBALURL}/punctuations/getAll`);
  }
}
