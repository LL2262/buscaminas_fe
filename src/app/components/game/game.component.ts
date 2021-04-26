import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Celda } from 'src/app/models/celda';
import { Nivel } from 'src/app/models/Nivel';
import { Puntuacion } from 'src/app/models/puntuacion';
import { PuntuacionService } from 'src/app/services/puntuacion.service';
import { CronometroComponent } from '../cronometro/cronometro.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  subscribes: Subscription[] = [];
  tablero: Celda[][]; // Tablero de celdas
  tam: number; // Tamaño del tablero
  estadoDeJuego: number; // 0 Jugando; 1 Game Over; 2 Victoria
  minas: number; // Cantidad de minas
  celdasVistas: number; // Celdas descubiertas
  celdasTotales: number; // Celdas totales
  minasRestantes: number; // Minas restantes
  fechaInicio: string; // Fecha hora inicio
  @ViewChild(CronometroComponent) cronometro: CronometroComponent; // Instancia del componente Cronometro
  public nivel: Nivel = JSON.parse(localStorage.getItem('gameConfig'));

  constructor(private puntuacionData: PuntuacionService,
    private toastData: ToastrService) {
    this.tablero = [];
    this.tam = this.nivel.filas;
    this.estadoDeJuego = 0;
    this.minas = this.nivel.minas;
    this.minasRestantes = this.minas;
    this.celdasVistas = 0
    this.celdasTotales = this.nivel.filas * this.nivel.columnas - this.nivel.minas; // A las celdas totales se les resta las minas ya que si completa las celdas sin tocar minas gana
    this.fechaInicio = new Date().toLocaleString();
  }

  ngOnInit() {
    this.crearTablero();
    this.colocarMinas();
  }

  ngOnDestroy() {
    this.subscribes.forEach(s => s.unsubscribe());
  }

  // Metodo que inicializa las celdas del tablero
  crearTablero() {
    for (var fila: number = 0; fila < this.tam; fila++) {
      this.tablero[fila] = [];
      for (var columna: number = 0; columna < this.tam; columna++) {
        this.tablero[fila][columna] = {bandera: false, descubierta: false, esMina: false, probabilidad: 0};
      }
    }
  }

  // Metodo utilizado para colocar las minas en el tablero
  colocarMinas() {
    for (var mina = 0; mina < this.minas; mina++) {
      var fila, columna;
      do {
        fila = Math.floor((Math.random() * this.nivel.filas)); // Numero aleatorio para las filas
        columna = Math.floor((Math.random() * this.nivel.columnas)); // Numero aleatorio para las columnas
      } while (this.tablero[fila][columna].esMina == true); // Permite que solo se coloque una mina en la celda
      this.tablero[fila][columna].esMina = true; // Coloco mina
      // Agregamos a las celdas la cantidad de minas que hay a su alrrededor
      for (var fila2 = this.max(0, fila - 1); fila2 < this.min(this.tam, fila + 2); fila2++) {
        for (var columna2 = this.max(0, columna - 1); columna2 < this.min(this.tam, columna + 2); columna2++) {
          if (this.tablero[fila2][columna2].esMina == false) { // Si la celda no es una mina...
            this.tablero[fila2][columna2].probabilidad++; // Incrementa el contador de minas
          }
        }
      }
    }
  }


  // Metodos utilizados para no pasarse de los bordes del tablero
  max(a, b) {
    return Math.max(a, b);
  }
  min(a, b) {
    return Math.min(a, b);
  }


  // Metodo para agregar bandera
  onRightClick(fila, columna) {
    if (this.estadoDeJuego == 0) { // Verifico que se esta jugando
      if (!this.tablero[fila][columna].descubierta) { // Verifico que la celda NO este descubierta
        this.tablero[fila][columna].bandera = true; // Agrego bandera
        this.minasRestantes--; //Descuento contador de minas
      }
    }
    return false; // Evita desplegar el menu de opciones de pagina
  }


  // Metodo para mostrar minas o probabilidades
  onLeftClick(fila, columna) {
    if (this.estadoDeJuego == 0) { // Verifico que se esta jugando
      if(this.tablero[fila][columna].bandera){
        this.tablero[fila][columna].bandera = false; // Si hago click donde hay bandera, debo sacarla
        this.minasRestantes++; //Aumento contador de minas
      }
      if (!this.tablero[fila][columna].descubierta) { // Verifico que la celda NO este descubierta
        if (this.tablero[fila][columna].esMina) { // Si es una mina..
          this.tablero[fila][columna].descubierta = true; // Descubro la celda
          this.estadoDeJuego = 1; // Pongo al juego en Game Over
          this.cronometro.stop(); // Paro el cronometro
          this.guardarJuego();
          // PIERDE JUEGO!!
        } else {
          this.clickCelda(fila, columna); // Si no es una mina debo mostrar probabilidades
        }
      }
    }
  }


  // Metodo para mostrar probabilidades y celdas adyacentes
  clickCelda(fila, columna) {
    if (!this.tablero[fila][columna].descubierta) { // Verifico que la celda NO este descubierta
      this.tablero[fila][columna].descubierta = true; // Descubro la celda
      this.celdasVistas++; // Incremento las celdas vistas sin minas
      if (this.celdasVistas == this.celdasTotales) { // Verifica si se visualizaron todas las celdas sin minas
        this.estadoDeJuego = 2; // Pongo al juego en Victoria
        this.cronometro.stop(); // Paro el cronometro
        this.guardarJuego();
        // GANA JUEGO!!
      } else {
        if (this.tablero[fila][columna].probabilidad == 0) { // Verifica si no hay minas adyacentes
          for (var fila2 = this.max(0, fila - 1); fila2 < this.min(this.tam, fila + 2); fila2++) { // Recorre las celdas cercanas y tambien las ejecuta
            for (var columna2 = this.max(0, columna - 1); columna2 < this.min(this.tam, columna + 2); columna2++) {
              this.clickCelda(fila2, columna2);
            }
          }
        }
      }
    }
  }

  guardarJuego() {
    let puntuacion: Puntuacion = {};
    puntuacion.startGame = this.fechaInicio;
    puntuacion.finishGame = new Date().toLocaleString();
    puntuacion.totalTime = this.cronometro.cronometro.horas * 3600 + this.cronometro.cronometro.minutos * 60 + this.cronometro.cronometro.segundos;
    this.estadoDeJuego == 2 ? puntuacion.stateGame = true : puntuacion.stateGame = false;
    puntuacion.difficulty = this.nivel.dificultad;

    this.subscribes.push(this.puntuacionData.guardarPuntuacion(puntuacion).subscribe(
      _resp => {
        if(_resp.isOk){
          this.toastData.success(_resp.message);
        }
      }));
  }

  // Metodo que reinicia el juego
  restart() {
    this.estadoDeJuego = 0
    this.tablero = [];
    this.crearTablero();
    this.colocarMinas();
    this.celdasVistas = 0;
    this.cronometro.stop(); // Paro el cronometro
    this.cronometro.start(); // Vuelvo a iniciarlo
    this.minasRestantes = this.minas;
    this.fechaInicio = new Date().toLocaleString();
  }


}
