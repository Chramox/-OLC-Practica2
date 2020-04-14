import { Token, TipoToken } from '../Token/token';
class ErrorSintactico{
    private _tokenActual: Token;
    public get tokenActual(): Token {
        return this._tokenActual;
    }
    public set tokenActual(value: Token) {
        this._tokenActual = value;
    }
    private _tokenEsperado: TipoToken;
    public get tokenEsperado(): TipoToken {
        return this._tokenEsperado;
    }
    public set tokenEsperado(value: TipoToken) {
        this._tokenEsperado = value;
    }

   
    constructor(actual?: Token, esperado?: TipoToken){
        this._tokenActual = actual;
        this._tokenEsperado = esperado;
    }
}
export class Sintactico {

    //VARIABLES DE CONTROL PARA EL ANALISIS SINTACTICO
    private tokenActual: Token;
    private controlToken:number;
    private listaTokens:Token[] =[];
    private listaErrores:ErrorSintactico[] = [];
    //VARIABLES PARA LA TRADUCCION
    private _Traduccion: string;
    public get Traduccion(): string {
        return this._Traduccion;
    }
    public set Traduccion(value: string) {
        this._Traduccion = value;
    }
    tabulacion:string;


    //VARIABLES AUXILIARES
    esFor: boolean = false;
    NombreVariabletemp:string;
    variableContadorFOR:Token;
    primerValFOR:boolean = false;
    primerDato:boolean = false;
    condicionFOR:string = "";
    //AUXILIARES PARA EL SWITCH
    contadorCase:number = 0;
    variableCondicionCase:Token;
    //METODO QUE EMPIEZA EL ANALISIS SINTACTICO
    public parsear(tokens:Token[]):void{
        this.listaTokens = tokens;
        this.controlToken = 0;
        this.tokenActual = this.listaTokens[0];
    }

    private emparejar(tipo_esperado: TipoToken){

        //TODO:REVISAR CUAL ERA EL MOOD PANICO DE RECUPERACION Y HACER LA IMPLEMENTACION
        
        if (this.tokenActual.tipoToken != tipo_esperado) {
            //IMPLEMENTACION DEL MODO PANICO
            if (this.tokenActual.tipoToken === TipoToken.COMENTARIO_MULTILINEA 
                || this.tokenActual.tipoToken === TipoToken.COMENTARIO_SIMPLE ) {
                //NADA PORQUE ES UN COMENTARIO AGREGADO
            }
            else{ //ERROR SINTACTICO, SE AGREGA A LA LISTA DE ERRORES
                let error =  new ErrorSintactico(this.tokenActual, tipo_esperado);
                console.log('ERROR SINTACTICO');
                console.log("valor actual " + this.tokenActual.tipoToken);
                console.log("\tError se esperaba " + tipo_esperado);
                this.listaErrores.push(error);
                //COMO EL ERROR SE CORRERIA ENTRA EL MODO PANICO, COMERSE TODO HASTA ENCONTRAR PUNTO Y COMA
            }
        }
        this.controlToken++;
        if (this.controlToken < this.listaTokens.length) {
            this.tokenActual = this.listaTokens[this.controlToken];
            console.log('Token siguiente: ' + this.tokenActual.tipoToken);
        }
        else{
            console.log('FIN DEL ANALISIS SINTACTICO');
        }
    }
    //TODO: FALTAN TODAS LAS OPERACIONES LOGICAS, PERO YA ESTA LA DECLARACION DE VECTORES Y LA DECLARACION DE VARIABLES, ASI COMO SU RESPECTIVA TRADUCCION
    //TODO: REVISAR AL FINALIZAR LAS TRADUCCIONES HECHAS
    //TODO: NUEVA GRAMATICA PARA EL SWITCH
    //TODO: HACER GRAMATICA PARA LOS METODOS Y SU RESPECTIVA TRADUCCION
    private LISTA_TODAS_SENTENCIAS(){
        if (this.tokenActual.tipoToken === TipoToken.IF) {
            console.log("SENTENCIA IF");
            this.Sentencia_IF();
        }
        else if (this.Reconocer_TipoDato() || this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR) // PARA DECLARACION Y ASIGNACION DE VARIABLES
        {
            console.log("SENTENCIA DECLA");
            this.SentenciaDeclaracion_Asignacion_Variables(); // YA TRADUCION [FALTA PROBAR ARREGLOS]
        }
        else if (this.tokenActual.tipoToken === TipoToken.WHILE) {
            console.log("SENTENCIA WHILE");
            this.Sentencia_While(); // YA TRADUCIDO
        }
        else if (this.tokenActual.tipoToken === TipoToken.FOR)  // PENDIENTE DE TRADUCCION
        {
            console.log("SENTENCIA FOR");
            this.Sentencia_For();
        }
        else if (this.tokenActual.tipoToken === TipoToken.SWITCH)
        {
            console.log("SENTENCIA SWITCH");
            this.Sentencia_Switch();
        }
        else if (this.tokenActual.tipoToken === TipoToken.CONSOLE)
        {
            console.log("SENTENCIA IMPRIMIR");
            this.Sentencia_Imprimir();
        }
        this.LISTA_TODAS_SENTENCIAS();
    }
    /*------------------------------------------------------------------
            DECLARACION Y ASIGNACION DE VARIABLES
    -------------------------------------------------------------------   */
    private Reconocer_TipoDato():boolean  //  TIPO DE DATOS: INT , BOOL, STRING, FLOAT, CHAR
    {
        if (this.tokenActual.tipoToken === TipoToken.INT)
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.BOOL)
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.STRING)
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.FLOAT)
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.CHAR)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    private TipoDato():void  //  TIPO DE DATOS: INT , BOOL, STRING, FLOAT, CHAR
    {
        if (this.tokenActual.tipoToken === TipoToken.INT) 
        {
            this.emparejar(TipoToken.INT);
        } 
        else if (this.tokenActual.tipoToken === TipoToken.BOOL)
        {
            this.emparejar(TipoToken.BOOL);
        }
        else if (this.tokenActual.tipoToken === TipoToken.STRING) 
        {
            this.emparejar(TipoToken.STRING);
        }
        else if (this.tokenActual.tipoToken === TipoToken.FLOAT)
        {
            this.emparejar(TipoToken.FLOAT);
        }
        else if (this.tokenActual.tipoToken === TipoToken.CHAR)
        {
            this.emparejar(TipoToken.CHAR);
        }
    }
    public SentenciaDeclaracion_Asignacion_Variables():void{
        /*                                      GRAMATICA UTILIZADA
            <SENTENCIA_DECLARACION> :: = <TIPO_VAR> Id <ASIGNACION_LISTA_VARIABLES> TOKEN.TIPO.PUNTO_COMA
        */
    
        if (this.Reconocer_TipoDato()) //DECLARACION
        {
            this.TipoDato();

            if (this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR)
            {
                if (this.esFor == true)
                {
                    this.variableContadorFOR = this.tokenActual;
                    console.log(" variable contador " + this.variableContadorFOR.lexemaToken);
                }
                this.NombreVariabletemp = this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.IDENTIFICADOR);
                this.AsignacionOrListaVariables();
                this.emparejar(TipoToken.PUNTO_COMA);
                this.primerDato = false;

            }
            else if (this.tokenActual.tipoToken == TipoToken.CORCHETE_APERTURA)  // DECLARACION DE UN ARRAY
            {
                
                this.emparejar(TipoToken.CORCHETE_APERTURA);
                this.emparejar(TipoToken.CORCHETE_CIERRE);
                this.Traduccion += "" + this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.IDENTIFICADOR);
                this.Sentencia_Asignacion_Array();
            }
        }
        else if (this.tokenActual.tipoToken == TipoToken.IDENTIFICADOR)  // ASIGNANDO VALOR NADA MAS
        {
            if (this.esFor)
            {
                this.variableContadorFOR = this.tokenActual;
            }
           this.Asignacion_VALOR();

        }
        if (this.esFor == false)
        {
           this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
        }
        
        
    }
    //---------------------------------------------------------------------
    // METODOS AUXILIARES Y CONTINUACION GRAMATICA PARA VARIABLES
    private AsignacionOrListaVariables():void
    {
        if (this.tokenActual.tipoToken === TipoToken.SIGNO_IGUAL)
        {
            this.Traduccion += "" + this.tabulacion + this.NombreVariabletemp + " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.SIGNO_IGUAL);
            
            this.ValorDato();
            // @ts-ignore
            if (this.tokenActual.tipoToken === TipoToken.COMA)
            {
                this.Traduccion += "\n";
                this.Lista_ID();
            }
          
        }
        else // SI NO ASIGNA VALOR, ES QUE VA A LISTAR VARIABLES O SOLO DECLARAR (EPSILON) EPSILON -> LO DEVUELVE LA FUNCION LISTAVARIABLES
        {
            this.Lista_ID();
        }
    }
    private Lista_ID():void
    {
        if (this.tokenActual.tipoToken === TipoToken.COMA) 
        {
            this.emparejar(TipoToken.COMA);
            // @ts-ignore
            if (this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR)
            {
                this.NombreVariabletemp = this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.IDENTIFICADOR);
                // @ts-ignore
                if (this.tokenActual.tipoToken === TipoToken.SIGNO_IGUAL)
                {
                    this.AsignacionOrListaVariables();
                }
                this.Lista_ID();
            }
        }
        else // ACA SIGNIFICA QUE SOLO DECLARO UNA VARIABLE
        {
            // EPSILON
        }
    }
   /*------------------------------------------------------------------
                    ASIGNACION DE VARIABLES
    -------------------------------------------------------------------   */
    private Asignacion_VALOR():void  // ASIGNAR VALOR A UNA VARIABLE ( =, += , -= , ++, --  )
    {
        //                                          GRAMATICA
        /*
                <ASIGNACION>::=   Id <TIPO_ASIGNACION> ;
                <TIPO_ASIGANCION>:: = <VALOR> | ++ | -- | += <VALOR> | -= <VALOR> 
        */
        console.log("metodo: Asignacion_Valor");
        if (this.esFor == false)
        {
            this.Traduccion += "" + this.tabulacion + this.tokenActual.lexemaToken;
        }
        else if(this.primerValFOR == false)
        {
            this.Traduccion +=  this.tabulacion + this.variableContadorFOR.lexemaToken + " =";
        }
    
        this.emparejar(TipoToken.IDENTIFICADOR);
        if (this.tokenActual.tipoToken == TipoToken.CORCHETE_APERTURA) // ASIGNAR VALOR A POSICION DE ALGUN VECTOR
        {
            this.emparejar(TipoToken.CORCHETE_APERTURA);
            this.Traduccion += "[" + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.NUMERO_ENTERO);
            this.emparejar(TipoToken.CORCHETE_CIERRE);
            this.Traduccion += "]";
            this.TipoAsignacion();
        }
        else { this.TipoAsignacion();  }
        if (this.esFor == false)
        {
            this.emparejar(TipoToken.PUNTO_COMA);
        }
        else if (this.primerValFOR == false)
        {
            this.emparejar(TipoToken.PUNTO_COMA);
        }
    

    }
    private TipoAsignacion():void 
    {
        
        if (this.esFor)
        {
            this.condicionFOR = "" + this.tokenActual.lexemaToken;
            // EL FOR NO PUEDE TENER EL SIGNO DE IGUAL ( SE ENCICLA )
            if (this.tokenActual.tipoToken == TipoToken.SIGNO_IGUAL)
            {
                this.emparejar(TipoToken.SIGNO_IGUAL);
                this.ValorDato();
            }
            else if (this.tokenActual.tipoToken == TipoToken.INCREMENTO1)
            {
                this.emparejar(TipoToken.INCREMENTO1);
            }
            else if (this.tokenActual.tipoToken == TipoToken.DECREMENTO1)
            {
                this.emparejar(TipoToken.DECREMENTO1);
            }
            else if (this.tokenActual.tipoToken == TipoToken.SUMA_IGUAL)
            {
                this.emparejar(TipoToken.SUMA_IGUAL);
                this.ValorDato();
            }
            else if (this.tokenActual.tipoToken == TipoToken.RESTA_IGUAL)
            {
                this.emparejar(TipoToken.RESTA_IGUAL);
                this.ValorDato();
            }
        }
        else 
        {
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            if (this.tokenActual.tipoToken == TipoToken.SIGNO_IGUAL)
            {
                this.emparejar(TipoToken.SIGNO_IGUAL);
                this.ValorDato();
            }
            else if (this.tokenActual.tipoToken == TipoToken.INCREMENTO1)
            {
                this.emparejar(TipoToken.INCREMENTO1);
            }
            else if (this.tokenActual.tipoToken == TipoToken.DECREMENTO1)
            {
                this.emparejar(TipoToken.DECREMENTO1);
            }
            else if (this.tokenActual.tipoToken == TipoToken.SUMA_IGUAL)
            {
                this.emparejar(TipoToken.SUMA_IGUAL);
                this.ValorDato();
            }
            else if (this.tokenActual.tipoToken == TipoToken.RESTA_IGUAL)
            {
                this.emparejar(TipoToken.RESTA_IGUAL);
                this.ValorDato();
            }
        }
        
    }

    //---------------------------------------------------------------------
    /*------------------------------------------------------------------
            DECLARACION DE VECTORES
    -------------------------------------------------------------------   */
    private Sentencia_Asignacion_Array():void
    {
        this.Traduccion += " = ";
        this.emparejar(TipoToken.SIGNO_IGUAL);
        this.Asignacion_ArrayPRIMA();
    }
    private Asignacion_ArrayPRIMA():void
    {
        if (this.tokenActual.tipoToken === TipoToken.LLAVE_APERTURA)
        {
            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.Traduccion += "[";
            this.ListaObjetos();
            this.emparejar(TipoToken.LLAVE_CIERRE);
            this.Traduccion += " ]";
        }
        else if (this.tokenActual.tipoToken === TipoToken.NEW) // EQUIVALENTE -> <NEW_ARRAY>
        {
            this.primerDato = true;
            this.emparejar(TipoToken.NEW);

            this.TipoDato();
            this.emparejar(TipoToken.CORCHETE_APERTURA);
            this.ValorDato();
            this.Traduccion += "[ ]";
            this.emparejar(TipoToken.CORCHETE_CIERRE);
        }
        else if (this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR)// EL ARRAY ESTA IGUALADO A UN VALOR PUNTUAL (EJEMPLO: A OTRO ARRAY)
        {
            this.ValorDato();
        }
        else { } // EPSILON EL ARRAY PUEDE ESTAR VACIO 
        this.emparejar(TipoToken.PUNTO_COMA);
    }
    private ListaObjetos():void
    {
        if (this.ReconocerSiEsValor()) //<VALOR><LIST_OBJ  PRIMA>
        {
            this.ValorDato();
            this.ListaObjetosPRIMA();
        }
        else if (!this.ReconocerSiEsValor())
        {
            this.ValorDato();
            this.ListaObjetosPRIMA();
        }
        else { }
    }
    private ListaObjetosPRIMA():void
    {
        if (this.tokenActual.tipoToken == TipoToken.COMA)
        {
            this.emparejar(TipoToken.COMA);
            this.Traduccion += " , ";
            this.ListaObjetos();
        }
        else { } // EPSILON
    }
    private ValorDato():void // EL VALOR DE UNA VARIABLE SIMPRE EMPIEZA CON UN TIPO DE DATO O CON UN IDENTIFICADOR DE UNA VARIABLE (REFIRIENDOSE AL VALOR DE LA VARIABLE REFERENCIADA)
    {
        // SI HAY UNA OPERACION PRIMERO HAY QUE RESOLVER EL VALOR HASTA QUE VENGA EL PUNTO Y COMA <-------------------- [FALTA VER QUE ONDA]
        
        console.log("ando por aca");

        if (this.tokenActual.tipoToken == TipoToken.CADENA)
        {
            this.primerDato = true;
            this.Traduccion += "\"" + this.tokenActual.lexemaToken + "\"";
            this.emparejar(TipoToken.CADENA);
        }
        else if (this.tokenActual.tipoToken == TipoToken.NUMERO_ENTERO)
        {
            this.primerDato = true;
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.NUMERO_ENTERO);

        }
        else if (this.tokenActual.tipoToken == TipoToken.NUMERO_FLOTANTE)
        {
            this.primerDato = true;
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.NUMERO_FLOTANTE);

        }
        else if (this.tokenActual.tipoToken == TipoToken.TRUE)
        {
            this.primerDato = true;
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.TRUE);
        }
        else if (this.tokenActual.tipoToken == TipoToken.FALSE)
        {
            this.primerDato = true;
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.FALSE);
        }
        else if (this.tokenActual.tipoToken == TipoToken.IDENTIFICADOR)
        {
            this.primerDato = true;
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.IDENTIFICADOR);
            // @ts-ignore
            if (this.tokenActual.tipoToken == TipoToken.CORCHETE_APERTURA)
            {
                this.emparejar(TipoToken.CORCHETE_APERTURA);
                this.Traduccion += "[";
                this.ValorDato();
                this.Traduccion += " ]";
                this.emparejar(TipoToken.CORCHETE_CIERRE);
            }
        }
        else if (this.tokenActual.tipoToken == TipoToken.CHAR) // FALTA AGREGAR EL RECONOCIMIENTO DEL CHAR AL AUTOMATA
        {
            this.primerDato = true;
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.CHAR);
        }
        else
        {
            console.log("ando en el es de valordato");
        }
        this.MasValores();
    }
    private MasValores():void 
    {
        //Console.WriteLine("ando por mas valores");
        if (this.tokenActual.tipoToken != TipoToken.PUNTO_COMA && !this.ReconocerSiEsValor())
        {
            if (this.tokenActual.tipoToken == TipoToken.PARENTESIS_APERTURA)
            {
                this.primerDato = true;
                //this.Console.WriteLine("Operacion encerrad en parentesis");
                this.Traduccion += " " + this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.PARENTESIS_APERTURA);
                this.ValorDato();
                this.Traduccion += " " + this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.PARENTESIS_CIERRE);
                this.ValorDato();
                //this.Console.WriteLine("ella dice que no me conoce");

            }
            else if (this.ReconocerOperadores())
            {
               // Console.WriteLine("que pex");
                this.Traduccion += "" + this.tokenActual.lexemaToken;
                this.emparejar(this.tokenActual.tipoToken);
                this.ValorDato();
            }
            else
            {
            
            }

        }
        else
        {
             console.log("no entra a nda " + this.tokenActual.lexemaToken);
            if (this.primerDato == false)
            {
                console.log("Error se esperaba un valor para la variable");
            }
        }

    }
    private ReconocerOperadores():boolean{
        /*
                   VA A SERVIR PARA AGREGAR A LA TRADUCCION COSAS QUE NO CAMBIAN EN SU TRADUCCION 
                   EJEMPLO:        
                               * OPERADORES   // == , >= , <= , != , > , < , = , + , -, * , / 
                               * VALORES : CADENAS, NUMEROS, CHAR, ---> PALABRAS RESERVADAS: TRUE, FALSE
                               * IDENTIFICADORES SOLO SE MANDA A LLAMAR EL NOMBRE DE LA VARIABLE
                               * PUNTO Y COMA VAN A EMPEZAR UNA LINEA NUEVA
                               * PARENTESIS
        */
        
        if (this.tokenActual.tipoToken === TipoToken.OP_SUMA)  // +
        {
            
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.GUION)  // -
        {
            
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.DIAGONAL)  // /
        {
            
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.ASTERISCO)  // *
        {
            return true;
        }
        else
        {
            
            return false;
        }
    }
    private ReconocerSiEsValor():boolean // DEVOLVER TRUE OR FALSE
    {
        if (this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR || this.tokenActual.tipoToken === TipoToken.CADENA ||
                    this.tokenActual.tipoToken === TipoToken.NUMERO_ENTERO || this.tokenActual.tipoToken === TipoToken.NUMERO_FLOTANTE ||
                    this.tokenActual.tipoToken === TipoToken.TRUE || this.tokenActual.tipoToken === TipoToken.FALSE ||
                    this.tokenActual.tipoToken === TipoToken.CHAR)
        {
            return true;
        }
        else { return false; }
    }
    private OperadoresLogicos():void  // == , >= , <= , != , > , <
    {
       console.log("metodo: OperadoresLogicos");
        this.Traduccion += " " + this.tokenActual.lexemaToken; 
        if (this.tokenActual.tipoToken === TipoToken.DOBLE_IGUAL)  // == 
        {
            this.emparejar(TipoToken.DOBLE_IGUAL);
        }
        else if (this.tokenActual.tipoToken === TipoToken.MAYOR_IGUAL)  // >=
        {
            this.emparejar(TipoToken.MAYOR_IGUAL);
        }
        else if (this.tokenActual.tipoToken === TipoToken.MENOR_IGUAL)  // <=
        {
            this.emparejar(TipoToken.MENOR_IGUAL);
        }
        else if (this.tokenActual.tipoToken === TipoToken.DIFERENTEA)  // !=
        {
            this.emparejar(TipoToken.DIFERENTEA);
        }
        else if (this.tokenActual.tipoToken === TipoToken.MAYOR)  // >
        {
            this.emparejar(TipoToken.MAYOR);
        }
        else if (this.tokenActual.tipoToken === TipoToken.MENOR)  // <
        {
            this.emparejar(TipoToken.MENOR);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                    CONDICIONALES ------------------------------------------------------------------------------------------------------------------------------------
    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  */


    /*------------------------------------------------------------------
    SENTENCIA IF 
    -------------------------------------------------------------------   */
    private Sentencia_IF():void 
    {
        if (this.tokenActual.tipoToken === TipoToken.IF) 
        {
        
            this.emparejar(TipoToken.IF);
            this.Traduccion += this.tabulacion+"if "; 
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
            this.Condicion();
            this.Traduccion += " :\n";
            this.AumentarTab();
            this.emparejar(TipoToken.PARENTESIS_CIERRE);
            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.LISTA_TODAS_SENTENCIAS();
            this.emparejar(TipoToken.LLAVE_CIERRE);
            this.disminuirTab();
            this.ELSE();
        }
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
    }
    private Condicion():void{
        this.ValorDato();
        this.OperadoresLogicos();
        this.ValorDato();
    }   
    private ELSE():void{
        if (this.tokenActual.tipoToken === TipoToken.ELSE)
        {
            this.emparejar(TipoToken.ELSE);
            this.Traduccion += this.tabulacion + "else:\n";
            this.AumentarTab();
            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.LISTA_TODAS_SENTENCIAS();
            this.emparejar(TipoToken.LLAVE_CIERRE);
            this.disminuirTab();
        }
        else{ } // EPSILON
    }
    /*------------------------------------------------------------------
           SENTENCIA WHILE  -----------
    -------------------------------------------------------------------   */
    private Sentencia_While():void {
        if (this.tokenActual.tipoToken === TipoToken.WHILE) 
        {
            this.emparejar(TipoToken.WHILE);
            this.Traduccion +=  this.tabulacion + "while";
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
            this.Condicion();
            this.Traduccion += " " + this.tokenActual.lexemaToken + "\n"; //salto de linea
            this.emparejar(TipoToken.PARENTESIS_CIERRE);

            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.AumentarTab();
            this.LISTA_TODAS_SENTENCIAS();
            this.disminuirTab();
        }
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
    }
     /*------------------------------------------------------------------
           SENTENCIA FOR
    -------------------------------------------------------------------   */
    public Sentencia_For():void {
        let variable = "";
        let condicion = "";
        if (this.tokenActual.tipoToken === TipoToken.FOR) 
        {
            this.emparejar(TipoToken.FOR);
            //this.contadorVariablesFor++;
            this.esFor = true;
            this.primerValFOR = false;
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
                
            
            this.SentenciaDeclaracion_Asignacion_Variables(); // POSIBLE ERROR, QUE DECLARE UN ARRAY (AUNQUE C# DEJA HACERLO)
            this.primerValFOR = true;
            this.Traduccion += "\n" + this.tabulacion + "while ";

            this.Condicion(); // LA CONDICION YA ESTA TRADUCIDA
            this.emparejar(TipoToken.PUNTO_COMA);
            this.Asignacion_VALOR();
            
            this.emparejar(TipoToken.PARENTESIS_CIERRE); // TERMINA LAS CONDICIONES DEL FOR
            this.esFor = false;
            this.Traduccion += ":\n";
            this.AumentarTab();
            this.emparejar(TipoToken.LLAVE_APERTURA); // EMPIEZA EL FOR
            variable = this.variableContadorFOR.lexemaToken;
    
            condicion = this.condicionFOR;
            //Console.WriteLine("variable for " + variable);
            //Console.WriteLine("variable condicion " + condicion);
            this.LISTA_TODAS_SENTENCIAS();
            //AUMENTO DE LA VARIABLE DEL FOR
            
            this.emparejar(TipoToken.LLAVE_CIERRE);
            if (condicion == "++")
            {
                // variable = variableContadorFOR.getLexema();
                this.Traduccion += this.tabulacion + variable + " += " + "1\n";
            }
            else if (condicion == "--")
            {
                this.Traduccion += this.tabulacion + variable + " -= " + "1\n";
            }
            else
            {
                this.Traduccion += this.tabulacion + variable + " " + condicion + " " + "1\n";
            }
        }
        this.disminuirTab();
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE

        
    }
    //TODO: REVISAR LA TRADUCCION A PYTHON DEL SWITCH (HAY QUE CAMBIARLA, ANTES CREO QUE ESTABA COMO UN ELSE IF)
    /*------------------------------------------------------------------
          SENTENCIA SWITCH
    -------------------------------------------------------------------   */
    public Sentencia_Switch():void {
        if (this.tokenActual.tipoToken == TipoToken.SWITCH) 
        {
            this.emparejar(TipoToken.SWITCH);
            this.Traduccion += this.tabulacion + "if ";
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
            this.Traduccion += "" + this.tokenActual.lexemaToken + " == ";
            this.variableCondicionCase = this.tokenActual; // GUARDAMOS EL NOMBRE DE LA VARIABLE QUE SE VA A USAR EL LOS CASES
            this.emparejar(TipoToken.IDENTIFICADOR);
            this.emparejar(TipoToken.PARENTESIS_CIERRE);
    
            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.List_Case();
            this.Case_Default();
            this.List_Case();
    
            this.emparejar(TipoToken.LLAVE_CIERRE);
            this.contadorCase = 0; // REINICIAR EL CONTADOR DE CASE
        }
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
    }
    private List_Case():void {
        if (this.tokenActual.tipoToken == TipoToken.CASE)
        {
            this.Case();
            this.List_Case();
        }
        else { } // EPSILON 
    }
    private Case():void {
        if (this.contadorCase > 0)
        {
            this.Traduccion += this.tabulacion + "elif " + this.variableCondicionCase.lexemaToken + " == "; //nombre de la pinche variable;
        }
        this.emparejar(TipoToken.CASE);
        this.contadorCase++;
        this.ValorDato();
        
        this.emparejar(TipoToken.DOS_PUNTOS);
        this.Traduccion += ":" + "\n";
        this.AumentarTab();
        this.LISTA_TODAS_SENTENCIAS();
        this.emparejar(TipoToken.BREAK);
        this.emparejar(TipoToken.PUNTO_COMA);
        this.disminuirTab();
    }
    private Case_Default():void  // default es opcional
    {
        if (this.tokenActual.tipoToken == TipoToken.DEFAULT) 
        {
            this.emparejar(TipoToken.DEFAULT);
            this.Traduccion += this.tabulacion + "else"; 
            this.emparejar(TipoToken.DOS_PUNTOS);
            this.Traduccion += ":" + "\n";
            this.AumentarTab();
            this.LISTA_TODAS_SENTENCIAS();
            this.emparejar(TipoToken.BREAK);
            this.emparejar(TipoToken.PUNTO_COMA);
            this.disminuirTab();
        }
    }
     /*------------------------------------------------------------------
          SENTENCIA IMPRIMIR
       -------------------------------------------------------------------   */
       public Sentencia_Imprimir():void {
           this.emparejar(TipoToken.CONSOLE);
           this.emparejar(TipoToken.PUNTO);
           this.emparejar(TipoToken.WRITELINE);
           this.Traduccion += this.tabulacion + "print";
           this.emparejar(TipoToken.PARENTESIS_APERTURA);
           this.Traduccion += "( ";
           this.ValorDato();
           this.emparejar(TipoToken.PARENTESIS_CIERRE);
           this.Traduccion += " )";
           this.emparejar(TipoToken.PUNTO_COMA);

           this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
       }

       /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
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