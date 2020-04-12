import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AnalisisLexico } from '../../../classes/AnalisisLexico/analisis-lexico';
import { Token } from '../../../classes/Token/token';

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
  listaTokens: Token[] = [];
  listaErrores: Token[] = [];


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
}

function analisis_Semantico() {
  
}