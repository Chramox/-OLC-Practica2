import { Token } from '../Token/token';

export class html_token {
    private _esDoble: boolean;
    public get esDoble(): boolean {
        return this._esDoble;
    }
    public set esDoble(value: boolean) {
        this._esDoble = value;
    }

    private _valor: string;
    public get valor(): string {
        return this._valor;
    }
    public set valor(value: string) {
        this._valor = value;
    }
    private _etiqueta: Etiqueta;
    public get etiqueta(): Etiqueta {
        return this._etiqueta;
    }
    public set etiqueta(value: Etiqueta) {
        this._etiqueta = value;
    }

    constructor(tip?: Etiqueta, val?: string, bol?:boolean) {
        this.etiqueta = tip;
        this.valor = val;
        this.esDoble = bol;
    }
}
export enum Etiqueta{
    BR = 'BR',
    HTML = 'HTML',
    HEAD = 'HEAD',
    BODY = 'BODY',
    TITLE = 'TITLE',
    DIV = 'DIV',
    P = 'P',
    H1 = 'H1',
    BUTTON = 'BUTTON',
    LABEL = 'LABEL',
    INPUT = 'INPUT',
    CADENA = 'CADENA',
    //CIERRE
    HTML_CIERRE = 'HTML_CIERRE',
    HEAD_CIERRE = 'HEAD_CIERRE',
    BODY_CIERRE = 'BODY_CIERRE',
    TITLE_CIERRE = 'TITLE_CIERRE',
    DIV_CIERRE = 'DIV_CIERRE',
    P_CIERRE = 'P_CIERRE',
    H1_CIERRE = 'H1_CIERRE',
    BUTTON_CIERRE = 'BUTTON_CIERRE',
    LABEL_CIERRE = 'LABEL_CIERRE',
    INPUT_CIERRE = 'INPUT_CIERRE',
    CADENA_CIERRE = 'CADENA_CIERRE'
}
export class AnalisisHtml{
    //ATRIBUTOS
    listaTokens:Token[] = [];
    listaEtiquetas:html_token[] = [];
    estado:number = 0;
    auxiliarLexema:string = "";
    //PARA JSON Y HTML
    private _json: string = "";
    public get json(): string {
        return this._json;
    }
    public set json(value: string) {
        this._json = value;
    }
    private _html: string = "";
    public get html(): string {
        return this._html;
    }
    public set html(value: string) {
        this._html = value;
    }
    tabulacion:string = "";
    constructor() {}
    public analizar(lista:Token[]){
        this.listaTokens = lista;
        this.listaTokens.forEach(cadena => {
            this.leer(cadena.lexemaToken);
        });
        this.generarArchivos();
        console.log('HACIENDO HTML');
        console.log(this._html);
        console.log(this._json);
    }
    private leer(entrada:string):void{
        let c:string;
        for (let i = 0; i < entrada.length; i++) {
            c = entrada[i];
            switch (this.estado) {
                case 0:
                    {
                        if(c == '<'){
                            this.estado = 1;
                            this.auxiliarLexema += c;
                        }
                        else{
                            this.estado = 2;
                            this.auxiliarLexema += c;
                        }
                    }
                    break;
                case 1:{//concatena hasta encontrar el cierre de la etiqueta >
                    if(c != '>'){
                        this.auxiliarLexema += c;
                        this.estado = 1;
                    }
                    else{
                        this.auxiliarLexema += c;
                        this.ReconocerEtiquetas();
                    }   
                }
                break;
                case 2:{
                    if(c != '<'){
                        this.auxiliarLexema += c;
                        this.estado = 2;
                    }
                    else{
                        this.agregarEtiqueta(Etiqueta.CADENA, false);
                        i--;
                    }   
                }
                break;
            }
        }
    }
    private ReconocerEtiquetas():void {
        if(this.auxiliarLexema.toUpperCase() == "<BR>"){this.agregarEtiqueta(Etiqueta.BR, false);}
        else if(this.auxiliarLexema.toUpperCase() == "<HTML>"){this.agregarEtiqueta(Etiqueta.HTML, true);}
        else if(this.auxiliarLexema.toUpperCase() == "<HEAD>"){this.agregarEtiqueta(Etiqueta.HEAD, true);}
        else if(this.auxiliarLexema.toUpperCase().includes("<BODY")){this.agregarEtiqueta(Etiqueta.BODY, true);}
        else if(this.auxiliarLexema.toUpperCase() == "<TITLE>"){this.agregarEtiqueta(Etiqueta.TITLE, true);}
        else if(this.auxiliarLexema.toUpperCase().includes("<DIV")){this.agregarEtiqueta(Etiqueta.DIV, true);}
        else if(this.auxiliarLexema.toUpperCase() == "<P>"){this.agregarEtiqueta(Etiqueta.P, true);}
        else if(this.auxiliarLexema.toUpperCase().includes("<H")){this.agregarEtiqueta(Etiqueta.H1, true);}
        else if(this.auxiliarLexema.toUpperCase() == "<BUTTON>"){this.agregarEtiqueta(Etiqueta.BUTTON, true);}
        else if(this.auxiliarLexema.toUpperCase() == "<LABEL>"){this.agregarEtiqueta(Etiqueta.LABEL, true);}
        else if(this.auxiliarLexema.toUpperCase() == "<INPUT>"){this.agregarEtiqueta(Etiqueta.INPUT, true);}
        else if(this.auxiliarLexema.toUpperCase() == "<CADENA>"){this.agregarEtiqueta(Etiqueta.CADENA, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</HTML>"){this.agregarEtiqueta(Etiqueta.HTML_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</HEAD>"){this.agregarEtiqueta(Etiqueta.HEAD_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</BODY>"){this.agregarEtiqueta(Etiqueta.BODY_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</TITLE>"){this.agregarEtiqueta(Etiqueta.TITLE_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</DIV>"){this.agregarEtiqueta(Etiqueta.DIV_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</P>"){this.agregarEtiqueta(Etiqueta.P_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase().includes("</H")){this.agregarEtiqueta(Etiqueta.H1_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</BUTTON>"){this.agregarEtiqueta(Etiqueta.BUTTON_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</LABEL>"){this.agregarEtiqueta(Etiqueta.LABEL_CIERRE, true);}
        else if(this.auxiliarLexema.toUpperCase() == "</INPUT>"){this.agregarEtiqueta(Etiqueta.INPUT_CIERRE, true);}
    }
    public agregarEtiqueta(Tipo: Etiqueta, esdoble:boolean):void{
        this.listaEtiquetas.push(new html_token(Tipo, this.auxiliarLexema, esdoble));
        this.auxiliarLexema = "";
        this.estado = 0;
    }
    private generarArchivos(){
        this.listaEtiquetas.forEach(etiqueta => {
            console.log(etiqueta.etiqueta + '<---->' + etiqueta.valor);//
            if (etiqueta.esDoble) {
                if(etiqueta.valor.includes("/")){
                    this.disminuirTab();
                    this._html += this.tabulacion + etiqueta.valor + '\n';
                    if(this._json.endsWith(',\n')){
                        this._json = this._json.substring(0, (this._json.lastIndexOf(',')));
                        this._json += '\n';
                    }
                    this._json += this.tabulacion + "},\n";
                }
                else{
                    this._json += this.tabulacion + '"' + etiqueta.etiqueta + '":{\n'  
                    if(etiqueta.etiqueta == Etiqueta.BODY || etiqueta.etiqueta == Etiqueta.DIV){
                          if(etiqueta.valor.toUpperCase().includes('STYLE')){
                            let inicio:number = etiqueta.valor.indexOf('"');
                            let final:number = etiqueta.valor.lastIndexOf('"');
                            this._json += this.tabulacion + '\t"STYLE":' + etiqueta.valor.substring(inicio,final)+ '",\n';
                          }
                    }
                    this._html += this.tabulacion + etiqueta.valor + '\n';
                    this.AumentarTab();
                }
            }else{
                if(etiqueta.etiqueta == Etiqueta.BR){
                    this._json += this.tabulacion + '"BR":" ",\n';  
                }
                else{
                    this._json += this.tabulacion + '"TEXTO":"' + etiqueta.valor + '",\n'
                }
                this._html += this.tabulacion + etiqueta.valor + '\n';
            }
        });
        if(this._json.endsWith(',\n')){
            this._json = this._json.substring(0, (this._json.lastIndexOf(',')));
            this._json += '\n';
        }
    }
    /*------------------------------------------------------------------
        MANEJO DE TABS PARA LA TRADUCCION
    ------------------------------------------------------------------- */
    private AumentarTab():void{
        this.tabulacion += "\t";
    }
    private disminuirTab():void{
        let longuitud = this.tabulacion.length;
        this.tabulacion = "";
        for (let i = 0;i < (longuitud-1) ; i++)
        {
            this.tabulacion += "\t";
        }
    }

}