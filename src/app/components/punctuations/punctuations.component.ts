import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Puntuacion } from 'src/app/models/puntuacion';
import { PuntuacionService } from 'src/app/services/puntuacion.service';

@Component({
  selector: 'app-punctuations',
  templateUrl: './punctuations.component.html',
  styleUrls: ['./punctuations.component.scss']
})
export class PunctuationsComponent implements OnInit {

  subscribes: Subscription[] = [];
  puntuaciones: Puntuacion[] = [];

  constructor(private puntuacionData: PuntuacionService) { }

  ngOnInit(): void {
    this.traerPuntuaciones();
  }

  ngOnDestroy() {
    this.subscribes.forEach(s => s.unsubscribe());
  }

  traerPuntuaciones(){
    this.subscribes.push(this.puntuacionData.traerPuntuacion().subscribe(
      _puntuaciones => {
        this.puntuaciones = _puntuaciones.entidad;
      }));
  }

  calcularTiempo(segundos: number){
    let hour = Math.floor(segundos / 3600);
    let hora = (hour < 10) ? '0' + hour : hour;
    let minute = Math.floor((segundos / 60) % 60);
    let minutos = (minute < 10)? '0' + minute : minute;
    let second = segundos % 60;
    let seconds = (second < 10)? '0' + second : second;
    return hora + ':' + minutos + ':' + seconds;
  }

}
