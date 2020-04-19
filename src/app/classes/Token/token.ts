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
        CORCHETE_APERTURA = 'CORCHETE_APERTURA',  //  [ X
        CORCHETE_CIERRE = 'CORCHETE_CIERRE',    //  ] X
        LLAVE_APERTURA = 'LLAVE_APERTURA',     //  { X
        LLAVE_CIERRE = 'LLAVE_CIERRE',       //  } X
        DOS_PUNTOS = 'DOS_PUNTOS',         //  : X
        SIGNO_IGUAL = 'SIGNO_IGUAL',        //  = X
        ADMIRACION_CIERRE = 'ADMIRACION_CIERRE',  //  !  // no lo he puesto porque no se si va a servir
        PARENTESIS_APERTURA = 'PARENTESIS_APERTURA',//     X
        PARENTESIS_CIERRE = 'PARENTESIS_CIERRE',  //     X
        COMILLA_SIMPLE = 'COMILLA_SIMPLE',     //  '  [REVISAR]
        COMILLA_DOBLE = 'COMILLA_DOBLE',      //  "  [REVISAR]
        COMA = 'COMA',               //  ,  X
        PUNTO = 'PUNTO',              //  .  X
        PUNTO_COMA = 'PUNTO_COMA',         //  ;  X 
        DIAGONAL_INVERSO = 'DIAGONAL_INVERSO',    //  \  X
        // OPERADORES
        OP_SUMA = 'OP_SUMA',            //    X 
        GUION = 'GUION',           //    X 
        DIAGONAL = 'DIAGONAL',        //    X 
        ASTERISCO = 'ASTERISCO',  //    X 
        GUION_BAJO = 'GUION_BAJO',         //    X
        I_BONITA = 'I_BONITA',
        PALITO_OR = 'PALITO_OR',
        // OPERADORES DOBLES 
        DOBLE_IGUAL = 'DOBLE_IGUAL',        // == X
        MAYOR_IGUAL = 'MAYOR_IGUAL',        // >= X
        MENOR_IGUAL = 'MENOR_IGUAL',        // <= X
        DIFERENTEA = 'DIFERENTEA',         // != X
        INCREMENTO1 = 'INCREMENTO1',        // ++ X
        DECREMENTO1 = 'DECREMENTO1',        // -- X
        SUMA_IGUAL = 'SUMA_IGUAL',         // += X 
        RESTA_IGUAL = 'RESTA_IGUAL',        // -= X  
        DOBLE_OR = 'DOBLE_OR',           // ||
        DOBLE_AND = 'DOBLE_AND',          // &&
        // OPERADORES MAYOR Y MENOR
        MAYOR = 'MAYOR',              //  > X
        MENOR = 'MENOR',              //  < X
        // -----------------------------
        NUMERO_ENTERO = 'NUMERO_ENTERO',
        NUMERO_FLOTANTE = 'NUMERO_FLOTANTE',
        CADENA = 'CADENA',
        ERROR = 'ERROR',
        IDENTIFICADOR = 'IDENTIFICADOR', // NOMBRES DE METODOS, VARIABLES, CLASES, ETC.
        // -----------------------------
        // PALABRAS RESERVADAS
        MAIN = 'MAIN',
        IF = 'IF',              //    X 
        ELSE = 'ELSE',            //    X 
        FOR = 'FOR',             //    X 
        WHILE = 'WHILE',           //    X 
        SWITCH = 'SWITCH',          //    X 
        CONSOLE = 'CONSOLE',         //    X 
        WRITELINE = 'WRITELINE',       //    X 
        WRITE = 'WRITE',
        BREAK = 'BREAK',           //    X
        STATIC = 'STATIC',         //     X
        VOID = 'VOID',       //         X
        CLASS = 'CLASS',          //     X
        TRUE = 'TRUE',           //     X
        FALSE = 'FALSE',          //     X
        NEW = 'NEW',            //     X
        ARGS = 'ARGS',           //     X
        CASE = 'CASE',
        DEFAULT = 'DEFAULT',
        RETURN = 'RETURN',
        DO = 'DO', 
        CONTINUE = 'CONTINUE',
        //TIPOS DE VARIABLES
        INT = 'INT',             //    X 
        FLOAT = 'FLOAT',           //    X 
        CHAR = 'CHAR',            //    X 
        STRING = 'STRING',          //    X 
        BOOL = 'BOOL',             //    X 
        // COMENTARIOS
        COMENTARIO_SIMPLE = 'COMENTARIO_SIMPLE', // //
        COMENTARIO_MULTILINEA = 'COMENTARIO_MULTILINEA', // /*
        // */
   }