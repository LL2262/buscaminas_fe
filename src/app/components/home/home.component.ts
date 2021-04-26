import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Nivel } from 'src/app/models/Nivel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public nivel: Nivel;
  public niveles: Nivel[];

  constructor(private router: Router) { 
    this.nivel = {columnas: 0, dificultad: '', filas: 0, minas: 0};
    this.niveles = [
      {dificultad: 'Facil', filas: 8, columnas:8, minas: 10},
      {dificultad: 'Medio', filas: 10, columnas:10, minas: 15},
      {dificultad: 'Dificil', filas: 12, columnas:12, minas: 20},
    ]
  }

  ngOnInit(): void {
  }

  onSubmit(){
    localStorage.setItem('gameConfig', JSON.stringify(this.nivel));
    this.router.navigate(['/game']);

  }

}
