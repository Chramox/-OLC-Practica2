//import { type } from 'os';

export class Token {
   
    // ATRIBUTOS DE LA CLASE CON SUS RESPECTIVOS GET Y SET
    private _tipoToken: TipoToken;
    private _valorToken: string;
    private _ID: number;
    private _fila: number;
    private _columna: number;

    
    public get tipoToken(): TipoToken {
        return this._tipoToken;
    }
    public set tipoToken(value: TipoToken) {
        this._tipoToken = value;
    }
    
    public get lexemaToken(): string {
        return this._valorToken;
    }
    public set valorToken(value: string) {
        this._valorToken = value;
    }
   
    public get ID(): number {
        return this._ID;
    }
    public set ID(value: number) {
        this._ID = value;
    }
   
    public get fila(): number {
        return this._fila;
    }
    public set fila(value: number) {
        this._fila = value;
    }
   
    public get columna(): number {
        return this._columna;
    }
    public set columna(value: number) {
        this._columna = value;
    }
    //TODO: REVISAR SI HAY QUE HACER OPERACIONES ARITMETICAS O NO
   // private valorObjeto: any;
   
   
   
    constructor(typeToken?: TipoToken, valueToken?: string, id?:number, fila?:number, columna?:number ){
        this._tipoToken = typeToken;
        this._valorToken = valueToken;
        this._ID = id;
        this._fila = fila;
        this._columna = columna;
    }
    public tipoTokString(): string{
        return this._tipoToken.toString();
    }
    //constructor(typeToken?: TipoToken, valueToken?: string);
}

export enum TipoToken
   {
        // SIMBOLOS ESPECIALES
        CORCHETE_APERTURA,  //  [ X
        CORCHETE_CIERRE,    //  ] X
        LLAVE_APERTURA,     //  { X
        LLAVE_CIERRE,       //  } X
        DOS_PUNTOS,         //  : X
        SIGNO_IGUAL,        //  = X
        ADMIRACION_CIERRE,  //  !  // no lo he puesto porque no se si va a servir
        PARENTESIS_APERTURA,//     X
        PARENTESIS_CIERRE,  //     X
        COMILLA_SIMPLE,     //  '  [REVISAR]
        COMILLA_DOBLE,      //  "  [REVISAR]
        COMA,               //  ,  X
        PUNTO,              //  .  X
        PUNTO_COMA,         //  ;  X 
        DIAGONAL_INVERSO,    //  \  X
        // OPERADORES
        OP_SUMA,            //    X 
        GUION,           //    X 
        DIAGONAL,        //    X 
        ASTERISCO,  //    X 
        GUION_BAJO,         //    X
        I_BONITA,
        PALITO_OR,
        // OPERADORES DOBLES 
        DOBLE_IGUAL,        // == X
        MAYOR_IGUAL,        // >= X
        MENOR_IGUAL,        // <= X
        DIFERENTEA,         // != X
        INCREMENTO1,        // ++ X
        DECREMENTO1,        // -- X
        SUMA_IGUAL,         // += X 
        RESTA_IGUAL,        // -= X  
        DOBLE_OR,           // ||
        DOBLE_AND,          // &&
        // OPERADORES MAYOR Y MENOR
        MAYOR,              //  > X
        MENOR,              //  < X
        // -----------------------------
        NUMERO_ENTERO,
        NUMERO_FLOTANTE,
        CADENA,
        ERROR,
        IDENTIFICADOR, // NOMBRES DE METODOS, VARIABLES, CLASES, ETC.
        // -----------------------------
        // PALABRAS RESERVADAS
        MAIN,
        IF,              //    X 
        ELSE,            //    X 
        FOR,             //    X 
        WHILE,           //    X 
        SWITCH,          //    X 
        CONSOLE,         //    X 
        WRITELINE,       //    X 
        BREAK,           //    X
        STATIC,         //     X
        VOID,       //         X
        CLASS,          //     X
        TRUE,           //     X
        FALSE,          //     X
        NEW,            //     X
        ARGS,           //     X
        CASE,
        DEFAULT,
        GRAFICAR_VECTOR,
        //TIPOS DE VARIABLES
        INT,             //    X 
        FLOAT,           //    X 
        CHAR,            //    X 
        STRING,          //    X 
        BOOL,             //    X 
        // COMENTARIOS
        COMENTARIO_SIMPLE, // //
        COMENTARIO_MULTILINEA, // /*
        // */
   }