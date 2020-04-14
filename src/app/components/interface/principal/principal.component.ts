import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AnalisisLexico } from '../../../classes/AnalisisLexico/analisis-lexico';
import { Token } from '../../../classes/Token/token';
import { Sintactico } from '../../../classes/AnalisisSintactico/sintactico';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup;

  constructor() { }

  ngOnInit(): void {
    
  }
  
  //VARIABLES
  // private _listaTokens: Token[] = [];
  // public get listaTokens(): Token[] {
  //   return this._listaTokens;
  // }
  // public set listaTokens(value: Token[]) {
  //   this._listaTokens = value;
  // }
  // listaErrores: Token[] = [];


  contador: number = 1; //contador de pestañas
  
  tabs = ['Pestaña 1'];
  selected = new FormControl(0);

  addTab() {
    this.contador++;
    this.tabs.push('Pestaña ' + (this.contador));
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    if((index + 1 ) == this.contador)
    {
      this.contador--;
    }
  }
  getInfoTab()
  {
    let informacion: string;
    let index: number =  this.tabGroup.selectedIndex;
    informacion  = (<HTMLInputElement>document.getElementById("entrada" + index)).value;
    console.log(informacion);    
    analisis_Lexico(informacion);
  }
}

function analisis_Lexico(entrada:string) {
  let lexico = new AnalisisLexico();
  lexico.separaLineas(entrada);
  let listaTokens:Token[] = lexico.listaTokens;

  let listaErrores:Token[] = lexico.listaErrores;

  if (listaErrores.length == 0) {
    analisis_Semantico(listaTokens);
  }
  else{
    console.log('HAY ERRORES LEXICOS, NO SE PUEDE HACER LA TRADUCCION');
    listaErrores.forEach(error => {
      error = <Token>error;
      console.log('Error '+ error.lexemaToken + ' Linea: ' + error.fila);
    });
  }
  
}

function analisis_Semantico(listaTokens:Token[]) {
  let sintactico = new Sintactico();
  sintactico.parsear(listaTokens);
}