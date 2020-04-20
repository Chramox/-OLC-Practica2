import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AnalisisLexico } from '../../../classes/AnalisisLexico/analisis-lexico';
import { Token } from '../../../classes/Token/token';
import { Sintactico, TabVariables } from '../../../classes/AnalisisSintactico/sintactico';
import { EventEmitter } from 'events';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup;
  constructor() { }
  ngOnInit(): void {
     let index = '0';
     localStorage.setItem("index",index); 
     let subirArchivo = (<HTMLInputElement>document.getElementById("subirArchivo"));
     subirArchivo.addEventListener('change', onFileSelect, false);
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
  guardarArchivo(){
    let index: string =  localStorage.getItem("index");
    let nombre:string =  "entrada" + index;
    let informacion:string = (<HTMLInputElement>document.getElementById(nombre)).value;
    
    let nombreArchivo: string = localStorage.getItem(nombre);
    if(nombreArchivo == undefined){
      nombreArchivo = nombre + ".cs"
    }
    else{ nombreArchivo += ".cs"}
    download(nombreArchivo, informacion);
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent); 
    console.log('index => ', tabChangeEvent.index); 
    localStorage.setItem("index", tabChangeEvent.index.toString()); 
  }
  generarHTML(){
    //let informacion = '<html><head></head><body><h1>HOLA MUNDO</h1></body></html>';
    let informacion:string = (<HTMLInputElement>document.getElementById("textarea_html")).value;
    download('salidaHTML.html', informacion);
  }
  generarJSON(){
    let informacion:string = (<HTMLInputElement>document.getElementById("textarea_json")).value;
    download('salidaJSON.json', informacion);
  }
}
function onFileSelect(event) {
  this.selectedFile = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
      const text = reader.result.toString().trim();
     
      let index: string =  localStorage.getItem("index");
      console.log('index ' + index);
      let nombre:string =  "entrada" + index;
      let entrada = (<HTMLInputElement>document.getElementById(nombre));
      entrada.value = text;
      
      localStorage.setItem( nombre, this.selectedFile.name);
  }
  reader.readAsText(this.selectedFile);
  //METIENDO LA INFORMACION EN LA PESTAÑA ACTIVA
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
//TODO: DESCARGAR TRADUCCION .PY, AGREGAR BOTON A LAS OPCIONES
function analisis_Semantico(listaTokens:Token[]) {
  let tabla = (<HTMLTableElement>document.getElementById('tabla'));
  let sintactico = new Sintactico();
  let salida = (<HTMLInputElement>document.getElementById('textearea_python'));
  //limpiando datos anteriores
  salida.value = "";
  var tableRows = tabla.getElementsByTagName('tr');
  var rowCount = tableRows.length;

  for (var x=rowCount-1; x>0; x--) {
    tabla.removeChild(tableRows[x]);
  }
  sintactico.parsear(listaTokens);
  //salida.value = sintactico.Traduccion;
  console.log(sintactico.Traduccion);
  let tabla_variables:TabVariables[] = sintactico.listaVariables;
  tabla_variables.forEach(variable => {
    let row = tabla.insertRow();
    let cell1 = row.insertCell();    
    let cell2 = row.insertCell();      
    let cell3 = row.insertCell();    
    let nombre = document.createTextNode(variable.nombre);
    let fila = document.createTextNode(variable.linea.toString());
    let tipo  = document.createTextNode(variable.tipo);
    cell1.appendChild(tipo);
    cell2.appendChild(nombre);
    cell3.appendChild(fila);
  });

}

function download(filename:string, text:string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
