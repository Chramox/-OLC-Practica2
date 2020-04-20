import { Token, TipoToken } from '../Token/token';

export class AnalisisLexico {

    constructor(){}

    fila:number = 0;
    columna: number = 0;
    estado:number = 0;
    public idToken: number;
    auxiliarLexema: string = "";


    private esCadena: boolean = false;
    private esComentarioSimple: boolean = false;
    private esComentarioMultiple: boolean = false;
    private esNumeroFlotante: boolean = false;
    //private esComillaSimple:boolean = false;


    private _listaTokens: Token[] = [];
    public get listaTokens(): Token[] {
        return this._listaTokens;
    }
    public set listaTokens(value: Token[]) {
        this._listaTokens = value;
    }
    listaErrores:Token[] = [];

    public separaLineas(Lineas:string):void {
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
        console.log("ESTAMOS ANALIZANDO LEXIMANETE");
        
        for (let i = 0; i < entrada.length; i++) {
            c = entrada[i];
            this.columna++;
            
            switch (this.estado) {
                case 0: //ESTADO INICIAL
                    {
                        if (c >= '0' && c <= '9') //NUMEROS
                            {
                                this.estado = 1;
                                this.auxiliarLexema = "" + c;
                            }
                            else if (isLetter(c)) //LETRAS (VA A RECONOCER ID`S)
                            {
                                this.estado = 2;
                                this.auxiliarLexema = "" + c;
                            }
                            else if (c == '"') // COMILLAS DOBLES [WARNING]
                            {
                                this.estado = 3; // Puede venir una cadena
                            //    agregarToken(TipoToken.COMILLA_DOBLE);
                            }
                            //AQUI VAN A IR TODOS LOS CARACTERES ESPECIALES { } : %
                            else if (c == '\'') // COMILLAS DOBLES [WARNING]
                            {
                                this.estado = 3; // Puede venir una cadena
                                //    agregarToken(TipoToken.COMILLA_DOBLE);
                            }
                            else if (c == '_') //PARTE DE UN ID
                            {
                                this.estado = 2;
                                this.auxiliarLexema += c;
                            }
                            // CAMBIAR ID`S DE LOS TOKENS  [WARNING]

                            else if (c == '[')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 28;
                                this.agregarToken(TipoToken.CORCHETE_APERTURA);
                            }
                            else if (c == ']')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 29;
                                this.agregarToken(TipoToken.CORCHETE_CIERRE);
                            }
                            else if (c == '{')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 30;
                                this.agregarToken(TipoToken.LLAVE_APERTURA);
                            }
                            else if (c == ';')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 31;
                                this.agregarToken(TipoToken.PUNTO_COMA);
                            }
                            else if (c == '}')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 32;
                                this.agregarToken(TipoToken.LLAVE_CIERRE);
                            }
                            else if (c == ':')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 33;
                                this.agregarToken(TipoToken.DOS_PUNTOS);
                            }
                            else if (c == '=')  // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '>') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '<') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '!') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '|') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '&') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '(')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 34;
                                this.agregarToken(TipoToken.PARENTESIS_APERTURA);
                            }
                            else if (c == ')')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 35;
                                this.agregarToken(TipoToken.PARENTESIS_CIERRE);
                            }
                            else if (c == ',')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 36;
                                this.agregarToken(TipoToken.COMA);
                            }
                            else if (c == '.')
                            {
                                this.auxiliarLexema += c;
                                this.idToken = 37;
                                this.agregarToken(TipoToken.PUNTO);
                            }
                            else if (c == '+')  // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '-') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '*') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '/') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '&') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == '|') // MANDAR A ESTADO 5
                            {
                                this.auxiliarLexema += c;
                                this.estado = 5;
                            }
                            else if (c == " ")  //CONSUMIR ESPACIOS
                            {
                                
                                i++;
                                if (i < entrada.length) {
                                    let a = entrada[i];
                                    if (a != " ")
                                    {
                                        i--;
                                    }
                                }
             
                            }
                            else
                            {
                                //FIN DE CADENA
                                if (c == '#' && i == (entrada.length - 1))
                                {
                                    // generarHTML(listaTokens);
                                    // generarHTML(listaErrores);
                                    console.log("FIN DEL ANALISIS LEXICO  ");
                                    this.listaTokens.forEach( Token => {
                                        Token = <Token>Token;
                                        console.log(Token.lexemaToken + "<------>" + Token.tipoTokString());
                                    });
                                    if (this.listaErrores.length > 0)
                                    {
                                        this.listaErrores.forEach( Token => {
                                            console.log(Token.lexemaToken+ "<------>" + Token.tipoTokString());
                                        });
                                    }
                                    else 
                                    {
                                        console.log("\n\n\n EMPEZANDO ANALISIS SINTACTICO");
                                        //Analizador_Sintactico analizador_Sintactico = new Analizador_Sintactico();
                                      //  analizador_Sintactico.parsear(listaTokens, EditorTexto, EditorTraduccion, EditorConsola);
                                    }
                                  }
                            }
                    }
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
                        else if (isLetter(c)) {
                            this.estado = 4;
                            this.auxiliarLexema += c;
                        }
                        else{
                            this.idToken = 40;
                            i--;
                            if (this.esNumeroFlotante == false)
                            {
                                this.agregarToken(TipoToken.NUMERO_ENTERO);
                            }
                            else // this.esNumeroFlotante == true -> se agreaga un numero flotante
                            {
                                this.agregarToken(TipoToken.NUMERO_FLOTANTE);
                            }
                        }
                    }
                    break;
                case 2://RESERVADAS Y LETRAS
                    {
                        if (isLetter(c))
                            {
                                this.estado = 2;
                                this.auxiliarLexema += c;
                            }
                            else if (c >= '0' && c <= '9')// ID`S PUEDEN TERMINAR CON NUMERO
                            {
                                this.estado = 2;
                                this.auxiliarLexema += c;
                            }
                            else if (c == '_') 
                            {
                                this.estado = 2;
                                this.auxiliarLexema += c;
                            }
                            else
                            {
                                i--;
                                this.auxiliarLexema.trim();
                                if (this.palabrasReservadas(this.auxiliarLexema) == false)
                                { 
                                    this.agregarToken(TipoToken.IDENTIFICADOR);
                                }
                            }
                    }   
                    break;
                case 3://CADENAS
                    {
                    if ((c == '"' || c == '\'') && this.esCadena == false)
                    {
                        // if (c == '"') {
                        //     this.esComillaSimple = false;
                        // }
                        // else{
                        //     this.esComillaSimple = true;
                        // }
                        this.estado = 3;
                        this.esCadena = true;
                    }
                    else if ((c == '"' || c == '\'') && this.esCadena == true)
                    {
                        this.esCadena = false;
                        this.idToken = 41;
                        this.agregarToken(TipoToken.CADENA);
                        this.estado = 0;
                    }
                    else //SIGUE CONCATENANDO HASTA QUE ENCUENTRA LA SEGUNDA COMIILA DOBLE
                    {
                        this.auxiliarLexema += c;
                        this.estado = 3;
                        this.esCadena = true;
                    }
                    }
                    break;
                case 4://ERRORES
                    {
                        if (isLetter(c) || (c >= '0' && c <= '9'))//para que reconozca todo el error
                        {
                            this.auxiliarLexema += c;
                            this.estado = 4;
                        }
                        else
                        {
                            i--;
                            this.agregarErrores();
                            this.estado = 0;
                        }
                    }
                    break;
                case 5: //OPERADORES DOBLES
                    {
                        if (c == '=' && this.esCadena == false)
                        {
                            this.auxiliarLexema += c;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                        else if (c == '+' && this.esCadena == false)
                        {
                            this.auxiliarLexema += c;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                        else if (c == '-' && this.esCadena == false)
                        {
                            this.auxiliarLexema += c;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }/**/
                        else if (c == '/' && this.esCadena == false) // PARA COMENTARIOS /* */
                        {
                            this.auxiliarLexema += c;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                        else if (c == '*' && this.esCadena == false) // PARA COMENTARIOS /* */
                        {
                            this.auxiliarLexema += c;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                        else if (c == '&' && this.esCadena == false) // PARA COMENTARIOS /* */
                        {
                            this.auxiliarLexema += c;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                        else if (c == '|' && this.esCadena == false) // PARA COMENTARIOS /* */
                        {
                            this.auxiliarLexema += c;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                        else // MANDA LOS OPERADORES DE UN SOLO CARACTER
                        {
                            i--;
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                    }
                    break;
                case 6://COMENTARIOS
                    {
                        // LA VARIABLE YA VIENE TRUE
                        this.auxiliarLexema += c;
                        this.estado = 6;
                        if (c == '*' && this.esComentarioMultiple == true)
                        {
                            i++;
                            if (i < entrada.length) 
                            {
                                let a = entrada[i];
                                this.auxiliarLexema += a;
                                if (a == '/') 
                                {
                                    this.esComentarioMultiple = false;
                                    this.agregarToken(TipoToken.COMENTARIO_MULTILINEA);
                                }
                            }
                        }
                        else if (this.esComentarioSimple == true && i == (entrada.length - 1) && this.esComentarioMultiple == false)
                        {
                            this.agregarToken(TipoToken.COMENTARIO_SIMPLE);
                        }
                    }
                    break;
            }

            //PARCHE
            if (i == (entrada.length - 1) && this.esComentarioMultiple == false) 
                {
                    if (this.estado == 1)
                    {
                        if (this.esNumeroFlotante == false)
                        {
                           this.agregarToken(TipoToken.NUMERO_ENTERO);
                        }
                        else
                        {
                           this.agregarToken(TipoToken.NUMERO_FLOTANTE);
                        }
                    }
                    else if (this.estado == 4)
                    {
                       this.agregarErrores();
                    }
                    else if (this.estado == 2)
                    {
                        if (this.palabrasReservadas(this.auxiliarLexema) == false)
                        {
                            this.agregarToken(TipoToken.IDENTIFICADOR);
                        }
                    }
                    else
                    {
                        if (this.palabrasReservadas(this.auxiliarLexema) == false && !this.auxiliarLexema.includes(" ") && this.auxiliarLexema.length > 0)
                        {
                            console.log("entre yo 1");
                            this.reconocerOperadores(this.auxiliarLexema);
                        }
                    }
                }
                else if (i == (entrada.length - 1) && this.esComentarioMultiple == true) // agregar saltos de linea al comentario multilinea
                {
                   this.auxiliarLexema += "\n";
                }
        }

    }

    public agregarToken(Tipo: TipoToken):void
    {
        this.listaTokens.push(new Token(Tipo, this.auxiliarLexema, this.idToken, this.fila, this.columna));
        this.auxiliarLexema = "";
        this.estado = 0;
    }
    public agregarErrores():void
    {
        this.listaErrores.push(new Token(TipoToken.ERROR, this.auxiliarLexema, 14, this.fila, this.columna));
        this.estado = 0;
    }
    palabrasReservadas(auxiliarLexema: string): boolean {
        //si no coincide con ninguna palabra reservada es error
        console.log("lexema " + auxiliarLexema );
        if (this.auxiliarLexema == "if")
        {
            this.idToken = 1;
            this.agregarToken(TipoToken.IF);
            return true;
        }
        else if (auxiliarLexema == "else")
        {
            this.idToken = 2;
            this.agregarToken(TipoToken.ELSE);
            return true;
        }
        else if (auxiliarLexema == "while")
        {
            this.idToken = 3;
            this.agregarToken(TipoToken.WHILE);
            return true;
        }
        else if (auxiliarLexema == "switch")
        {
            this.idToken = 4;
            this.agregarToken(TipoToken.SWITCH);
            return true;
        }
        else if (auxiliarLexema ==  "Console")
        {
            this.idToken = 5;
            this.agregarToken(TipoToken.CONSOLE);
            return true;
        }
        else if (auxiliarLexema ==  "WriteLine")
        {
            this.idToken = 6;
            this.agregarToken(TipoToken.WRITELINE);
            return true;
        }
        else if (auxiliarLexema ==  "Write")
        {
            this.idToken = 6;
            this.agregarToken(TipoToken.WRITE);
            return true;
        }
        else if (auxiliarLexema ==  "int")
        {
            this.idToken = 7;
            this.agregarToken(TipoToken.INT);
            return true;
        }
        else if (auxiliarLexema ==  "float"){
            this.idToken = 8;
            this.agregarToken(TipoToken.FLOAT);
            return true;
        }
        else if (auxiliarLexema ==  "char") // REVISAR HERMANOS MAYORES
        {
            this.idToken = 9;
            this.agregarToken(TipoToken.CHAR);
            return true;
        }
        else if (auxiliarLexema ==  "string")
        {
            this.idToken = 10;
            this.agregarToken(TipoToken.STRING);
            return true;
        }
        else if (auxiliarLexema == "String")
        {
            this.idToken = 10;
            this.agregarToken(TipoToken.STRING);
            return true;
        }
        else if (auxiliarLexema ==  "bool")
        {
            this.idToken = 11;
            this.agregarToken(TipoToken.BOOL);
            return true;
        }
        else if (auxiliarLexema ==  "break")
        {
            this.idToken = 38;
            this.agregarToken(TipoToken.BREAK);
            return true;
        }
        else if (auxiliarLexema ==  "static")
        {
            this.idToken = 42;
            this.agregarToken(TipoToken.STATIC);
            return true;
        }
        else if (auxiliarLexema ==  "void")
        {
            this.idToken = 43;
            this.agregarToken(TipoToken.VOID);
            return true;
        }
        else if (auxiliarLexema ==  "class")
        {
            this.idToken = 44;
            this.agregarToken(TipoToken.CLASS);
            return true;
        }
        else if (auxiliarLexema ==  "true")
        {
            this.idToken = 45;
            this.agregarToken(TipoToken.TRUE);
            return true;
        }
        else if (auxiliarLexema ==  "false")
        {
            this.idToken = 46;
            this.agregarToken(TipoToken.FALSE);
            return true;
        }
        else if (auxiliarLexema ==  "new")
        {
            this.idToken = 47;
            this.agregarToken(TipoToken.NEW);
            return true;
        }
        else if (auxiliarLexema == "args")
        {
            this.idToken = 48;
            this.agregarToken(TipoToken.ARGS);
            return true;
        }
        else if (auxiliarLexema ==  "for")
        {
            this.idToken = 49;
            this.agregarToken(TipoToken.FOR);
            return true;
        }
        else if (auxiliarLexema ==  "case")
        {
            this.idToken = 50;
            this.agregarToken(TipoToken.CASE);
            return true;
        }
        else if (auxiliarLexema == "default")
        {
            this.idToken = 51;
            this.agregarToken(TipoToken.DEFAULT);
            return true;
        }
        else if (auxiliarLexema ==  "Main")
        {
            this.idToken = 52;
            this.agregarToken(TipoToken.MAIN);
            return true;
        }
        else if (auxiliarLexema ==  "return")
        {
            this.idToken = 53;
            this.agregarToken(TipoToken.RETURN);
            return true;
        }
        else if (auxiliarLexema ==  "do")
        {
            this.idToken = 54;
            this.agregarToken(TipoToken.DO);
            return true;
        }
        else if (auxiliarLexema ==  "continue")
        {
            this.idToken = 55;
            this.agregarToken(TipoToken.CONTINUE);
            return true;
        }
        else if (auxiliarLexema ==  "public")
        {
            this.idToken = 56;
            this.agregarToken(TipoToken.PUBLIC);
            return true;
        }
        else if (auxiliarLexema ==  "private")
        {
            this.idToken = 57;
            this.agregarToken(TipoToken.PRIVATE);
            return true;
        }
        else if (auxiliarLexema ==  "protected")
        {
            this.idToken = 58;
            this.agregarToken(TipoToken.PROTECTED);
            return true;
        }
        else
        {
            return false;
        }
    }
    private reconocerOperadores(auxiliarLexema:string):void {

        //auxiliarLexema = string.Concat(auxiliarLexema.Split());
        auxiliarLexema = auxiliarLexema.trim();
        //Console.WriteLine("OPERADORES DOBLES " + auxiliarLexema);
        
        if (auxiliarLexema == "+=")
        {
            this.idToken = 39;
            this.agregarToken(TipoToken.SUMA_IGUAL);
        }
        else if (auxiliarLexema == "-=")
        {
            this.idToken = 12;
            this.agregarToken(TipoToken.RESTA_IGUAL);
        }
        else if (auxiliarLexema == "==")
        {
            this.idToken = 13;
            this.agregarToken(TipoToken.DOBLE_IGUAL);
        }
        else if (auxiliarLexema == "!=")
        {
            this.idToken = 14;
            this.agregarToken(TipoToken.DIFERENTEA);
        }
        else if (auxiliarLexema == ">=")
        {
            this.idToken = 15;
            this.agregarToken(TipoToken.MAYOR_IGUAL);
        }
        else if (auxiliarLexema == "<=")
        {
            this.idToken = 16;
            this.agregarToken(TipoToken.MENOR_IGUAL);
        }
        else if (auxiliarLexema == "++")
        {
            this.idToken = 17;
            this.agregarToken(TipoToken.INCREMENTO1);
        }
        else if (auxiliarLexema == "--")
        {
            this.idToken = 18;
            this.agregarToken(TipoToken.DECREMENTO1);
        }
        else if (auxiliarLexema == "||")
        {
            this.idToken = 25;
            this.agregarToken(TipoToken.DOBLE_OR);
        }  
        else if (auxiliarLexema == "&&")
        {
            this.idToken = 26;
            this.agregarToken(TipoToken.DOBLE_AND);
        }  
        else if (auxiliarLexema == "=") // OPERADORES DE UN SOLO CARACTER
        {
            this.idToken = 25;
            this.agregarToken(TipoToken.SIGNO_IGUAL);
        }
        else if (auxiliarLexema == "|") // OPERADORES DE UN SOLO CARACTER
        {
            this.idToken = 25;
            this.agregarToken(TipoToken.PALITO_OR);
        }
        else if (auxiliarLexema == "&") // OPERADORES DE UN SOLO CARACTER
        {
            this.idToken = 25;
            this.agregarToken(TipoToken.I_BONITA);
        }
        else if (auxiliarLexema == "-")
        {
            this.idToken = 19;
            this.agregarToken(TipoToken.GUION);
        }
        else if (auxiliarLexema == "+")
        {
            this.idToken = 20;
            this.agregarToken(TipoToken.OP_SUMA);
        }
        else if (auxiliarLexema == "*")
        {
            this.idToken = 21;
            this.agregarToken(TipoToken.ASTERISCO);
        }
        else if (auxiliarLexema == "/")
        {
            this.idToken = 22;
            this.agregarToken(TipoToken.DIAGONAL);
        }
        else if (auxiliarLexema == ">")
        {
            this.idToken = 23;
            this.agregarToken(TipoToken.MAYOR);
        }
        else if (auxiliarLexema == "<")
        {
            this.idToken = 24;
            this.agregarToken(TipoToken.MENOR);
        }
        
          // COMENTARIOS
        else if (auxiliarLexema == "//")
        {
            this.estado = 6;
            this.esComentarioSimple = true;
            //idToken = 25;
            //agregarToken(TipoToken.COMENTARIO_SIMPLE);
        }
        else if (auxiliarLexema == "/*")
        {
            this.esComentarioMultiple = true;
            this.estado = 6;
            //idToken = 26;
            //agregarToken(TipoToken.COMENTARIO_MULTILINEA_ABRE);
        }
        else if (auxiliarLexema == "*/")
        {
            this.estado = 6;
            //idToken = 27;
            //agregarToken(TipoToken.COMENTARIO_MULTILINEA_CIERRA);
        }
        else 
        {
            this.estado = 4;
        }

    }
}

function isLetter(c:string) {
    return c.toLowerCase() != c.toUpperCase();
}
