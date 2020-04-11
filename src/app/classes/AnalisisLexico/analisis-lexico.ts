export class AnalisisLexico {

    constructor(){}

    fila:number = 0;
    columna: number = 0;
    estado:number = 0;
    public idToken: number;
    auxiliarLexema: string = "";

    esCadena: boolean = false;
    esComentarioSimple: boolean = false;
    esComentarioMultiple: boolean = false;
    esNumeroFlotante: boolean = false;

    separaLineas(Lineas:string):void {
        Lineas += "#";
        let lines: string[] = Lineas.split('\n');
        lines.forEach(line => {
            this.Leer(line);    
        });
    }
    private Leer(entrada:string):void{
        this.fila++;
        this.columna = 0;
        let c:string;

        for (let index = 0; index < entrada.length; index++) {
            const c = entrada[index];
            this.columna++;
// TODO: TERMINAR ANALISIS LEXICO -- VER TRADUCCION QUE HICE EN JAVA
            switch (this.estado) {
                case 0: //ESTADO INICIAL
                    {}
                    break;
                case 1: //NUMEROS
                    {
                        if (c >= '0' && c <= '9') {
                            this.estado = 1;
                            this.auxiliarLexema += c;
                        }
                        else if (c == '.') {
                            this.esNumeroFlotante = true;
                            this.estado = 1;
                            this.auxiliarLexema += c;
                        }
                    }
                    break;
                case 2://RESERVADAS Y LETRAS
                    {}   
                    break;
                case 3://CADENAS
                    {}
                    break;
                case 4://ERRORES
                    {}
                    break;
                case 5: //OPERADORES DOBLES
                    {}
                    break;
                case 6://COMENTARIOS
                    {}
                    break;
            }
        }

    }

}
