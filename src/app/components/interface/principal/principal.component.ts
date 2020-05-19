import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AnalisisLexico } from '../../../classes/AnalisisLexico/analisis-lexico';
import { Token } from '../../../classes/Token/token';
import { Sintactico, TabVariables, ErrorSintactico } from '../../../classes/AnalisisSintactico/sintactico';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AnalisisHtml } from "../../../classes/Analisis_HTML/analisis-html";

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
     let json:string = "";
     let html:string = "";
     localStorage.setItem("json",json);
     localStorage.setItem("html",html);

  }
  //TODO: HACER EL DECREMENTO PARA EL FOR
  //VARIABLESa dsfasfdasfdasdfdfsadsffds
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
  meterDatos = (tabChangeEvent: MatTabChangeEvent):void=>{
    if(tabChangeEvent.index == 0){
      let html = (<HTMLInputElement>document.getElementById('html'));
      html.value = localStorage.getItem('html');
    }
    else {
      let json = (<HTMLInputElement>document.getElementById('json'));
      json.value = localStorage.getItem('json');
    }
  }
  generarHTML(){
    //let informacion = '<html><head></head><body><h1>HOLA MUNDO</h1></body></html>';
    let informacion:string = localStorage.getItem("html");
    download('salidaHTML.html', informacion);
  }
  generarJSON(){
    let informacion:string = localStorage.getItem("json");
    download('salidaJSON.json', informacion);
  }
  generarPY(){
    let informacion:string = (<HTMLInputElement>document.getElementById('textearea_python')).value;
    download('traduccion.py', informacion);
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
  analisis_Semantico(listaTokens, lexico.listaHTML, listaErrores);

}
//TODO: DESCARGAR TRADUCCION .PY, AGREGAR BOTON A LAS OPCIONES
function analisis_Semantico(listaTokens:Token[], listaHTML:Token[], listaLexicos:Token[]) {
  let tabla = (<HTMLTableElement>document.getElementById('tabla'));
  let sintactico = new Sintactico();
  let salida = (<HTMLInputElement>document.getElementById('textearea_python'));
  
  let html = (<HTMLInputElement>document.getElementById('html'));
  let json = (<HTMLInputElement>document.getElementById('json'));
  //limpiando datos anteriores
  salida.value = "";
  var tableRows = tabla.getElementsByTagName('tr');
  var rowCount = tableRows.length;
  while(--rowCount) {tabla.deleteRow(rowCount)};
  let genera = new AnalisisHtml();
  genera.analizar(listaHTML);
  if(json != null){
    json.value = genera.json;
  }
  if(html != null){
    html.value = genera.html;
  }
  localStorage.setItem("json",genera.json);
  localStorage.setItem("html", genera.html);

  sintactico.parsear(listaTokens);
  if(sintactico.listaErrores.length > 0 || listaLexicos.length > 0){
    generarReporte(listaLexicos,sintactico.listaErrores);
  }
  else{
    salida.value = sintactico.Traduccion;
  }
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
function generarReporte(listaToken:Token[], listaSintactico: ErrorSintactico[])
  {
    let titulo:string;
    //INICIO 
    let contador:number = 0;
    titulo = "Lista de Errores Encontrados";
    

    let html:string = "<!DOCTYPE html> \n" +
        "<html>\n" +
            "<head> \n" +
                "<title>Tokens Encontrados</title> \n" +
                "<meta charset = 'UTF-8'> \n" +
            "</head> \n" +
            "<body> \n" +
            "<br><br> \n" +
            "<center><h1>" + titulo + "</h1><br> \n" +
            "<style type='text/css'>table{background-color:#c4defb;}</style>\n" +
            "<div style ='over-flow: scroll;heigth:600px;width:80%;'><table>\n" +
                "<thead>\n" +
                    "<tr>\n" +
                        "<th>No</th>\n" +
                        "<th>Tipo error</th>\n" +
                        "<th>Linea</th>\n" +
                        "<th>Columna</th>\n" +
                        "<th>Descripcion</th>" +
                    "</tr> \n" +
                "</thead>\n" +
                "<tbody> \n";
    listaToken.forEach(token => {
      let Lexema:string = token.lexemaToken;
      if (token.lexemaToken.includes('<'))
      {
          Lexema = token.lexemaToken.replace("<", "[");
      }
      else if (token.lexemaToken.includes('>'))
      {
          Lexema = token.lexemaToken.replace(">", "]");
      }
      else
      {
          Lexema = token.lexemaToken;
      }
      html += "" +
        "<tr> \n " +
            "<td>" + contador + "</td> \n"
            + "<td>" + "Lexico" + "</td> \n" +
            "<td>" + token.fila + "</td> \n" +
            "<td>" + token.columna + "</td> \n" +
            "<td>" + "El caracter " + Lexema + " no pertenece al lenguaje"+ "</td> \n" +
        "</tr>\n";
      contador++;
    });
    listaSintactico.forEach(error => {
      html += "" +
        "<tr> \n " +
            "<td>" + contador + "</td> \n"
            + "<td>" + "Sintactico" + "</td> \n" +
            "<td>" + error.tokenActual.fila + "</td> \n" +
            "<td>" + error.tokenActual.columna + "</td> \n" +
            "<td>" + "Valor actual: " + error.tokenActual.tipoToken + " Se esperaba: " + error.tokenEsperado +  "</td> \n" +
        "</tr>\n";
      contador++;
    });
    //CERRAR HTML
    html += "</tbody> \n </table></div> \n </center> \n </body> \n </html> \n";
    download('ReporteErrores.html', html);


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
