import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Cronometro } from 'src/app/models/cronometro';


@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.css']
})
export class CronometroComponent implements OnInit {

  public cronometro: Cronometro;
  public intervalo;

  constructor() {
    this.cronometro = {horas: 0, minutos: 0, segundos: 0};
    this.intervalo;

   }

  ngOnInit() {
    this.start();
  }

  // Metodo que inicializa el cronometro
  start(){
    this.cronometro = {horas: 0, minutos: 0, segundos: 0};
    this.intervalo = setInterval(()=>{
      this.cronometro.segundos +=1;
      if(this.cronometro.segundos == 60){
        this.cronometro.segundos = 0;
        this.cronometro.minutos +=1;
        if(this.cronometro.minutos == 60){
          this.cronometro.minutos = 0;
          this.cronometro.horas +=1;
          if(this.cronometro.horas == 24){
            this.cronometro.horas = 0;
          }
        }
      }
    }, 1000);
  }

  // Metodo que para el cronometro al ganar o perder el juego
  stop(){
    clearInterval(this.intervalo); 
    this.intervalo = null;
  }

}
