import { Token, TipoToken } from '../Token/token';
export interface TabVariables{
    nombre:string,
    linea:number,
    tipo:string,
}
export class ErrorSintactico{
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
    private banderaRecuperacion: number = -1;
    private esError:boolean = false;
    private tokenActual: Token;
    private controlToken:number;
    private listaTokens:Token[] =[];
    private _listaErrores: ErrorSintactico[] = [];
    nombreMetodo: string;
    public get listaErrores(): ErrorSintactico[] {
        return this._listaErrores;
    }
    public set listaErrores(value: ErrorSintactico[]) {
        this._listaErrores = value;
    }
    private _listaVariables: TabVariables[] = [];
    tipoDato: string;
    lineaVar: number;
    public get listaVariables(): TabVariables[] {
        return this._listaVariables;
    }
    public set listaVariables(value: TabVariables[]) {
        this._listaVariables = value;
    }
    //VARIABLES PARA LA TRADUCCION
    private _Traduccion: string = "";
    public get Traduccion(): string {
        return this._Traduccion;
    }
    public set Traduccion(value: string) {
        this._Traduccion = value;
    }
    tabulacion:string = "";


    //VARIABLES AUXILIARES
    terminarSintactico:boolean = false;
    NombreVariabletemp:string;
    variableContadorFOR:Token;
    primerValFOR:boolean = false;
    primerDato:boolean = false;
    contadorBucles: number = 0;
    //AUXILIARES PARA EL FOR
    condicionFOR:string = "";
    esFor: boolean = false;
    inicio_rango: number = -1;
    final_rango:number = -1;
    //primera_declaracion:boolean = false;
    //AUXILIARES PARA EL SWITCH
    contadorCase:number = 0;
    variableCondicionCase:Token;
    //METODO QUE EMPIEZA EL ANALISIS SINTACTICO
    public parsear(tokens:Token[]):void{
        this.terminarSintactico = false;
        this.esError = false;
        this.listaTokens = tokens;
        console.log(this.listaTokens.length);
        this.controlToken = 0;
        this.tokenActual = this.listaTokens[0];
        this.LISTA_TODAS_SENTENCIAS();
    }

    private emparejar(tipo_esperado: TipoToken){

        //TODO:REVISAR CUAL ERA EL MOOD PANICO DE RECUPERACION Y HACER LA IMPLEMENTACION
        // if(this.tokenActual.tipoToken === TipoToken.PUNTO_COMA)
        // {
        //     this.Traduccion += "\n";            
        // }
        if (this.esError === true) {
            if(this.banderaRecuperacion == -1){
                let buscar:number = this.controlToken+1;
                let token_busqueda:Token;
                let salir:boolean = false;
                while(buscar < this.listaTokens.length){
                    token_busqueda = this.listaTokens[buscar];
                    switch (token_busqueda.tipoToken) {
                        case TipoToken.PUNTO_COMA:
                            salir = true;
                            break;
                        case TipoToken.PARENTESIS_CIERRE:
                            salir = true;
                            break;
                        case TipoToken.LLAVE_CIERRE:
                            salir = true;
                            break;
                        default:
                            break;
                    }
                    if(salir == true){
                        break;
                    }
                    buscar++;
                }
                this.banderaRecuperacion = buscar;
            }
            //SE SUPONE QUE AMBOS ENCUENTRAN EL PRIMERO
            if(tipo_esperado == TipoToken.PUNTO_COMA || tipo_esperado == TipoToken.PARENTESIS_CIERRE || tipo_esperado == TipoToken.LLAVE_CIERRE){//HASTA ENCONTRAR QUE COINCIDA CON UN PUNTO Y COMA SE PARA
                this.esError = false;
                this.controlToken = this.banderaRecuperacion;
                this.banderaRecuperacion = -1;
            }
            else{
                let error =  new ErrorSintactico(this.tokenActual, tipo_esperado);
                this.listaErrores.push(error);
            }
        }
        else{
            if (this.tokenActual.tipoToken != tipo_esperado) {
                //IMPLEMENTACION DEL MODO PANICO
                if (this.tokenActual.tipoToken === TipoToken.COMENTARIO_MULTILINEA 
                    || this.tokenActual.tipoToken === TipoToken.COMENTARIO_SIMPLE ) {
                    //NADA PORQUE ES UN COMENTARIO AGREGADO
                }
                else{ //ERROR SINTACTICO, SE AGREGA A LA LISTA DE ERRORES
                    this.esError = true;
                    let error =  new ErrorSintactico(this.tokenActual, tipo_esperado);
                    console.log('ERROR SINTACTICO');
                    console.log("valor actual " + this.tokenActual.tipoToken);
                    console.log("\tError se esperaba " + tipo_esperado);
                    this.listaErrores.push(error);
                    //COMO EL ERROR SE CORRERIA ENTRA EL MODO PANICO, COMERSE TODO HASTA ENCONTRAR PUNTO Y COMA
                }
            }
            else{console.log("val :" + this.tokenActual.tipoToken + " esperado: " + tipo_esperado);}
        }
        
        this.controlToken++;
        if (this.controlToken < this.listaTokens.length) {
            this.tokenActual = this.listaTokens[this.controlToken];
            console.log('Token siguiente: ' + this.tokenActual.tipoToken + ' cT: ' + this.controlToken);
        }
        else{
            console.log('FIN DEL ANALISIS SINTACTICO');
            this.terminarSintactico = true;
        }
    }
    private LISTA_TODAS_SENTENCIAS(){
        if (this.tokenActual.tipoToken === TipoToken.IF) {
            console.log("SENTENCIA IF");
            this.Sentencia_IF();
        } //YA REVISADO
        else if (this.Reconocer_TipoDato()) // PARA DECLARACION Y ASIGNACION DE VARIABLES
        {
            console.log("SENTENCIA DECLA");
            this.SentenciaDeclaracion_Asignacion_Variables(); // YA TRADUCION [FALTA PROBAR ARREGLOS]
        }//YA REVISADO
        else if(this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR){
            if (this.esFor)
            {
                this.variableContadorFOR = this.tokenActual;
            }
            this.Asignacion_VALOR();

            this.LISTA_TODAS_SENTENCIAS();
        }
        else if(this.tokenActual.tipoToken === TipoToken.VOID){
            this.void_metodo();
        }
        else if (this.tokenActual.tipoToken === TipoToken.WHILE) {
            console.log("SENTENCIA WHILE");
            this.Sentencia_While(); // YA TRADUCIDO
        }//YA REVISADO
        else if (this.tokenActual.tipoToken === TipoToken.FOR)  // PENDIENTE DE TRADUCCION
        {
            console.log("SENTENCIA FOR");
            this.Sentencia_For();
        }//YA REVISADO
        else if (this.tokenActual.tipoToken === TipoToken.SWITCH)
        {
            console.log("SENTENCIA SWITCH");
            this.Sentencia_Switch();
        }
        else if (this.tokenActual.tipoToken === TipoToken.CONSOLE)
        {
            console.log("SENTENCIA IMPRIMIR");
            this.Sentencia_Imprimir();
        }//YA REVISADO
        else if(this.tokenActual.tipoToken === TipoToken.BREAK && this.contadorCase==0){
            if(this.contadorBucles>0){
                this.Traduccion += this.tabulacion + "break\n";
                this.emparejar(TipoToken.BREAK);
                this.emparejar(TipoToken.PUNTO_COMA);
            }
            else{
                let error =  new ErrorSintactico(this.tokenActual, TipoToken.IDENTIFICADOR);
                console.log('ERROR SINTACTICO, NO PUEDE PONER '+this.tokenActual.lexemaToken+' ALLI');
                this.listaErrores.push(error);
            }
        }
        else if(this.tokenActual.tipoToken === TipoToken.DO){
            this.Sentencia_DoWhile();
        }
        else if(this.tokenActual.tipoToken === TipoToken.CONTINUE){
            if(this.contadorBucles>0){
                this.Traduccion += this.tabulacion + "continue\n";
                this.emparejar(TipoToken.CONTINUE);
                this.emparejar(TipoToken.PUNTO_COMA);
                this.LISTA_TODAS_SENTENCIAS();
            }
            else{
                let error =  new ErrorSintactico(this.tokenActual, TipoToken.IDENTIFICADOR);
                console.log('ERROR SINTACTICO, NO PUEDE PONER '+this.tokenActual.lexemaToken+' ALLI');
                this.listaErrores.push(error);
            }
        }
        else if(this.tokenActual.tipoToken === TipoToken.RETURN){
            this.emparejar(TipoToken.RETURN);
            this.Traduccion += this.tabulacion  + "return ";
            this.ValorDato();
            this.emparejar(TipoToken.PUNTO_COMA);
            this.Traduccion += "\n";
            this.LISTA_TODAS_SENTENCIAS();
        }
        else if (this.tokenActual.tipoToken === TipoToken.COMENTARIO_SIMPLE)
        {
            let vector:string[] = this.tokenActual.lexemaToken.split('/');
            try
            {
                let index = 2;
                this.Traduccion += "#"
                do {
                    this.Traduccion +=  vector[index];
                    index++;
                } while (index< (vector.length-1));
                //this.Traduccion += "... "
            }
            catch (error)
            {
                console.log(error);
            }
        
            this.emparejar(TipoToken.COMENTARIO_SIMPLE);
            this.LISTA_TODAS_SENTENCIAS();
        }
        else if (this.tokenActual.tipoToken === TipoToken.COMENTARIO_MULTILINEA) 
        {/**/
            let vct:string[] = this.tokenActual.lexemaToken.split('*');
            try
            {
                let index = 1;
                this.Traduccion += "... "
                do {
                    this.Traduccion +=  vct[index];
                    index++;
                } while (index< (vct.length-1));
                this.Traduccion += "... "
            }
            catch (error)
            {
                console.log(error);
            }
            this.emparejar(TipoToken.COMENTARIO_MULTILINEA);
            this.Traduccion += "\n";
            this.LISTA_TODAS_SENTENCIAS();
        }
        
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
        else if (this.tokenActual.tipoToken === TipoToken.DOUBLE)
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
        else if (this.tokenActual.tipoToken === TipoToken.DOUBLE)
        {
            this.emparejar(TipoToken.DOUBLE);
        }
    }
    private esMetodo():boolean{
        if(this.tokenActual.tipoToken === TipoToken.PARENTESIS_APERTURA){
            return true;
        }
        else{ return false; }
    }
    public SentenciaDeclaracion_Asignacion_Variables():void{
        /*                                      GRAMATICA UTILIZADA
            <SENTENCIA_DECLARACION> :: = <TIPO_VAR> Id <ASIGNACION_LISTA_VARIABLES> TipoToken.PUNTO_COMA
        */
        let esmetodo: boolean = false;
        if (this.Reconocer_TipoDato()) //DECLARACION
        {
            this.tipoDato = this.tokenActual.lexemaToken;
            this.lineaVar = this.tokenActual.fila;
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
                if(this.esMetodo() == false){
                    if(!this.listaVariables.some(e => e.nombre === this.NombreVariabletemp)){
                        let variable:TabVariables = {nombre: this.NombreVariabletemp, linea:this.lineaVar, tipo: this.tipoDato};
                        this.listaVariables.push(variable);
                    }
                    this.AsignacionOrListaVariables();
                    this.emparejar(TipoToken.PUNTO_COMA);
                    if (this.esFor == false)
                    {
                        this.Traduccion += "\n";
                    }
                    this.primerDato = false;
                }
                else{
                    this.nombreMetodo = this.NombreVariabletemp;
                    this.Sentencia_Metodos();
                    esmetodo = true;
                }
            }
            else if (this.tokenActual.tipoToken == TipoToken.CORCHETE_APERTURA)  // DECLARACION DE UN ARRAY
            {
                
                this.emparejar(TipoToken.CORCHETE_APERTURA);
                this.emparejar(TipoToken.CORCHETE_CIERRE);
                this.Traduccion += "" + this.tokenActual.lexemaToken;
                this.NombreVariabletemp = this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.IDENTIFICADOR);
                if(!this.listaVariables.some(e => e.nombre === this.NombreVariabletemp)){
                    let variable:TabVariables = {nombre: this.NombreVariabletemp, linea:this.lineaVar, tipo: this.tipoDato+"[]"};
                    this.listaVariables.push(variable);
                }
                this.Sentencia_Asignacion_Array();
            }
        }
        if (this.esFor == false && esmetodo == false)
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
            // if (this.primera_declaracion === true) {
            //     this.Traduccion += this.tabulacion + "var " + this.NombreVariabletemp + " " + this.tokenActual.lexemaToken;
            //     this.primera_declaracion = false;
            // }
            if (this.esFor == false) {
                this.Traduccion += "" + this.tabulacion + this.NombreVariabletemp + " " + this.tokenActual.lexemaToken + " ";
            }
            
            this.emparejar(TipoToken.SIGNO_IGUAL);
            
            this.ValorDato();
            // @ts-ignore
            if (this.tokenActual.tipoToken === TipoToken.COMA)
            {
                if (this.esFor == false) {
                    this.Traduccion += "\n";
                }
                
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
                if(!this.listaVariables.some(e => e.nombre === this.NombreVariabletemp)){
                    let variable:TabVariables = {nombre: this.NombreVariabletemp, linea:this.lineaVar, tipo: this.tipoDato};
                    this.listaVariables.push(variable);
                }
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
        this.nombreMetodo = this.tokenActual.lexemaToken;
        this.emparejar(TipoToken.IDENTIFICADOR);
        if (this.tokenActual.tipoToken == TipoToken.CORCHETE_APERTURA) // ASIGNAR VALOR A POSICION DE ALGUN VECTOR
        {
            this.emparejar(TipoToken.CORCHETE_APERTURA);
            this.Traduccion += "[" + this.tokenActual.lexemaToken;
            //@ts-ignore
            if(this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR){
                this.emparejar(TipoToken.IDENTIFICADOR);
            }
            else{
                this.emparejar(TipoToken.NUMERO_ENTERO);
            }
            this.emparejar(TipoToken.CORCHETE_CIERRE);
            this.Traduccion += "]";
            this.TipoAsignacion();
        }
        else if(this.tokenActual.tipoToken === TipoToken.PARENTESIS_APERTURA){
            this.LlamarFuncion();
        }
        else { this.TipoAsignacion();  }
        if (this.esFor == false)
        {
            this.emparejar(TipoToken.PUNTO_COMA);
            this.Traduccion += "\n";
        }
        else if (this.primerValFOR == false)
        {
            this.emparejar(TipoToken.PUNTO_COMA);
            this.Traduccion += "\n";
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
            //this.Traduccion += " " + this.tokenActual.lexemaToken;
            if (this.tokenActual.tipoToken == TipoToken.SIGNO_IGUAL)
            {
                this.Traduccion += " " + this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.SIGNO_IGUAL);
                this.ValorDato();
            }
            else if (this.tokenActual.tipoToken == TipoToken.INCREMENTO1)
            {
                this.emparejar(TipoToken.INCREMENTO1);
                this.Traduccion += "+= 1"
                
            }
            else if (this.tokenActual.tipoToken == TipoToken.DECREMENTO1)
            {
                this.Traduccion += " " + this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.DECREMENTO1);
                this.Traduccion += "-= 1"
                
            }
            else if (this.tokenActual.tipoToken == TipoToken.SUMA_IGUAL)
            {
                this.Traduccion += " " + this.tokenActual.lexemaToken;
                this.emparejar(TipoToken.SUMA_IGUAL);
                this.ValorDato();
            }
            else if (this.tokenActual.tipoToken == TipoToken.RESTA_IGUAL)
            {
                this.Traduccion += " " + this.tokenActual.lexemaToken;
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
        this.Traduccion += "\n";
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
            if(this.esFor == false){
                this.Traduccion += "\"" + this.tokenActual.lexemaToken + "\"";
            }else{
                if(this.inicio_rango != -1){
                    this.final_rango = parseInt(this.tokenActual.lexemaToken);
                }
                else{
                    this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                }
            }
            this.emparejar(TipoToken.CADENA);
        }
        else if (this.tokenActual.tipoToken == TipoToken.NUMERO_ENTERO)
        {
            this.primerDato = true;
            if(this.esFor == false){
                this.Traduccion += "" + this.tokenActual.lexemaToken;
            }else{
                if(this.inicio_rango != -1){
                    this.final_rango = parseInt(this.tokenActual.lexemaToken);
                }
                else{
                    this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                }
            }
            this.emparejar(TipoToken.NUMERO_ENTERO);

        }
        else if (this.tokenActual.tipoToken == TipoToken.NUMERO_FLOTANTE)
        {
            this.primerDato = true;
            if(this.esFor == false){
                this.Traduccion += "" + this.tokenActual.lexemaToken;
            }else{
                if(this.inicio_rango != -1){
                    this.final_rango = parseInt(this.tokenActual.lexemaToken);
                }
                else{
                    this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                }
            }
            this.emparejar(TipoToken.NUMERO_FLOTANTE);

        }
        else if (this.tokenActual.tipoToken == TipoToken.TRUE)
        {
            this.primerDato = true;
            if(this.esFor == false){
                this.Traduccion += " " + this.tokenActual.lexemaToken;
            }else{
                if(this.inicio_rango != -1){
                    this.final_rango = parseInt(this.tokenActual.lexemaToken);
                }
                else{
                    this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                }
            }
            this.emparejar(TipoToken.TRUE);
        }
        else if (this.tokenActual.tipoToken == TipoToken.FALSE)
        {
            this.primerDato = true;
            if(this.esFor == false){
                this.Traduccion += " " + this.tokenActual.lexemaToken;
            }else{
                if(this.inicio_rango != -1){
                    this.final_rango = parseInt(this.tokenActual.lexemaToken);
                }
                else{
                    this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                }
            }
            this.emparejar(TipoToken.FALSE);
        }
        else if (this.tokenActual.tipoToken == TipoToken.IDENTIFICADOR)
        {
            this.primerDato = true;
            if(this.esFor == false){
                this.Traduccion += "" + this.tokenActual.lexemaToken;
            }else{
                if(this.inicio_rango != -1){
                    this.final_rango = parseInt(this.tokenActual.lexemaToken);
                }
                else{
                    this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                }
            }
            this.emparejar(TipoToken.IDENTIFICADOR);
            // @ts-ignore
            if (this.tokenActual.tipoToken == TipoToken.CORCHETE_APERTURA)
            {
                this.emparejar(TipoToken.CORCHETE_APERTURA);
                if(this.esFor == false){
                    this.Traduccion += "[";
                }else{
                    if(this.inicio_rango != -1){
                        this.final_rango = parseInt(this.tokenActual.lexemaToken);
                    }
                    else{
                        this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                    }
                }
                this.ValorDato();
                if(this.esFor == false){
                    this.Traduccion += " ]";
                }else{
                    if(this.inicio_rango != -1){
                        this.final_rango = parseInt(this.tokenActual.lexemaToken);
                    }
                    else{
                        this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                    }
                }
                this.emparejar(TipoToken.CORCHETE_CIERRE);
            }
            // @ts-ignore
            else if(this.tokenActual.tipoToken === TipoToken.PARENTESIS_APERTURA){
                this.LlamarFuncion();
            }
        }
        else if (this.tokenActual.tipoToken == TipoToken.CHAR) // FALTA AGREGAR EL RECONOCIMIENTO DEL CHAR AL AUTOMATA
        {
            this.primerDato = true;
            if(this.esFor == false){
                this.Traduccion += " " + this.tokenActual.lexemaToken;
            }else{
                if(this.inicio_rango != -1){
                    this.final_rango = parseInt(this.tokenActual.lexemaToken);
                }
                else{
                    this.inicio_rango = parseInt(this.tokenActual.lexemaToken);
                }
            }
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
            else if(this.ReconocerLogicos()){
                this.OperadoresLogicos();
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
        if (this.esFor == false && this.tokenActual.tipoToken !== TipoToken.DOBLE_AND &&
            this.tokenActual.tipoToken !== TipoToken.DOBLE_OR) {
           this.Traduccion += "" + this.tokenActual.lexemaToken;
        }
        else if(this.esFor == false)
        {
            if(this.tokenActual.tipoToken ===  TipoToken.DOBLE_OR){
                this.Traduccion += " or ";
            }
            else if(this.tokenActual.tipoToken === TipoToken.DOBLE_AND){
                this.Traduccion += " and ";
            }
        }
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
        else if (this.tokenActual.tipoToken === TipoToken.DOBLE_AND)  // <
        {
            this.emparejar(TipoToken.DOBLE_AND);
        }
        else if (this.tokenActual.tipoToken === TipoToken.DOBLE_OR)  // <
        {
            this.emparejar(TipoToken.DOBLE_OR);
        }
    }
    private ReconocerLogicos():boolean  // == , >= , <= , != , > , <
    {
       
        if (this.tokenActual.tipoToken === TipoToken.DOBLE_IGUAL)  // == 
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.MAYOR_IGUAL)  // >=
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.MENOR_IGUAL)  // <=
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.DIFERENTEA)  // !=
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.MAYOR)  // >
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.MENOR)  // <
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.DOBLE_AND)  // <
        {
            return true;
        }
        else if (this.tokenActual.tipoToken === TipoToken.DOBLE_OR)  // <
        {
            return true;
        }
        else{
            return false;
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
            this.emparejar(TipoToken.PARENTESIS_CIERRE);
            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.AumentarTab();
            this.LISTA_TODAS_SENTENCIAS();
            this.emparejar(TipoToken.LLAVE_CIERRE);
            this.disminuirTab();
            this.ELSE();
        }
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
    }
    private Condicion():void{
        if(this.tokenActual.tipoToken === TipoToken.ADMIRACION_CIERRE){
            this.emparejar(TipoToken.ADMIRACION_CIERRE);
            this.Traduccion += "not ";
            this.ValorDato();
        }
        else{
            //PARA VALIDAR SOLO UNA VARIABLE BOOLEAN O UN TRUE EN LA CONDICION
            let siguiente:Token;
            if(this.controlToken < this.listaTokens.length){
                siguiente = this.listaTokens[this.controlToken+1];
            }
            if(siguiente.tipoToken === TipoToken.PARENTESIS_CIERRE){
                if(this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR){
                    this.Traduccion += this.tokenActual.lexemaToken;
                    this.emparejar(TipoToken.IDENTIFICADOR);
                }
                else if(this.tokenActual.tipoToken === TipoToken.TRUE || this.tokenActual.tipoToken === TipoToken.FALSE){
                    this.emparejar(this.tokenActual.tipoToken);
                }
            }
            else{
                this.ValorDato();
                this.OperadoresLogicos();
                this.ValorDato();
            }
            
        }
    }   
    private ELSE():void{
        if (this.tokenActual.tipoToken === TipoToken.ELSE)
        {
            this.emparejar(TipoToken.ELSE);
            //ELSE IF
            //@ts-ignore
            if (this.tokenActual.tipoToken === TipoToken.IF) {
                this.emparejar(TipoToken.IF);
                this.Traduccion += this.tabulacion+"elif "; 
                this.emparejar(TipoToken.PARENTESIS_APERTURA);
                this.Condicion();
                this.Traduccion += " :\n";
                this.emparejar(TipoToken.PARENTESIS_CIERRE);
                this.emparejar(TipoToken.LLAVE_APERTURA);
                this.AumentarTab();
                this.LISTA_TODAS_SENTENCIAS();
                this.emparejar(TipoToken.LLAVE_CIERRE);
                this.disminuirTab();
                this.ELSE();
            }
            else{
                this.Traduccion += this.tabulacion + "else:\n";
                this.AumentarTab();
                this.emparejar(TipoToken.LLAVE_APERTURA);
                this.LISTA_TODAS_SENTENCIAS();
                this.emparejar(TipoToken.LLAVE_CIERRE);
                this.disminuirTab();
            }
        }
        else{ } // EPSILON
    }
    /*------------------------------------------------------------------
           SENTENCIA WHILE  -----------
    -------------------------------------------------------------------   */
    private Sentencia_While():void {
        if (this.tokenActual.tipoToken === TipoToken.WHILE) 
        {
            this.contadorBucles++;
            this.emparejar(TipoToken.WHILE);
            this.Traduccion +=  this.tabulacion + "while";
            this.Traduccion += " " + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
            this.Condicion();
            this.Traduccion += "" + this.tokenActual.lexemaToken + "\n"; //salto de linea
            this.emparejar(TipoToken.PARENTESIS_CIERRE);

            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.AumentarTab();
            this.LISTA_TODAS_SENTENCIAS();
            this.disminuirTab();
            this.emparejar(TipoToken.LLAVE_CIERRE);
        }
        this.contadorBucles--;
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
    }
    /*------------------------------------------------------------------
           SENTENCIA DO WHILE  -----------
    ------------------1-------------------------------------------------   */
    private Sentencia_DoWhile():void {
        if (this.tokenActual.tipoToken === TipoToken.DO) 
        {
            this.contadorBucles++;
            this.emparejar(TipoToken.DO);
            this.Traduccion +=  this.tabulacion + "while True:\n";
            
            this.emparejar(TipoToken.LLAVE_APERTURA);
            this.AumentarTab();
            this.LISTA_TODAS_SENTENCIAS();
            
            this.emparejar(TipoToken.LLAVE_CIERRE);

            this.emparejar(TipoToken.WHILE);
            this.Traduccion += this.tabulacion + "if" + this.tokenActual.lexemaToken;
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
            this.Condicion();
            this.Traduccion += "" + this.tokenActual.lexemaToken + ":\n"; //salto de linea
            this.AumentarTab();
            this.Traduccion += this.tabulacion + "break\n";
            this.disminuirTab();
            this.emparejar(TipoToken.PARENTESIS_CIERRE);
            this.disminuirTab();
        }
        this.contadorBucles--;
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
    }
     /*------------------------------------------------------------------
           SENTENCIA FOR
    -------------------------------------------------------------------   */
    public Sentencia_For():void {
        // let variable = "";
        let condicion = "";
        if (this.tokenActual.tipoToken === TipoToken.FOR) 
        {
            this.contadorBucles++;
            this.emparejar(TipoToken.FOR);
            //this.contadorVariablesFor++;
            this.esFor = true;
            this.primerValFOR = false;
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
                
            
            this.SentenciaDeclaracion_Asignacion_Variables(); // POSIBLE ERROR, QUE DECLARE UN ARRAY (AUNQUE C# DEJA HACERLO)
            this.primerValFOR = true;
           

            this.Condicion(); // LA CONDICION YA ESTA TRADUCIDA
            this.emparejar(TipoToken.PUNTO_COMA);
            this.Asignacion_VALOR();
            this.Traduccion += this.tabulacion + "for " + this.variableContadorFOR.lexemaToken + " in range (" + this.inicio_rango + "," + this.final_rango;
            //REINCIANDO VALORES
            this.final_rango = -1;
            this.inicio_rango = -1;
            this.emparejar(TipoToken.PARENTESIS_CIERRE); // TERMINA LAS CONDICIONES DEL FOR
            this.esFor = false;
            this.AumentarTab();
            this.emparejar(TipoToken.LLAVE_APERTURA); // EMPIEZA EL FOR
            // variable = this.variableContadorFOR.lexemaToken;
    
            condicion = this.condicionFOR;
            if (condicion == "--")
            {
                this.Traduccion +=  ",-1):\n";
            }
            else{
                this.Traduccion += "):\n";
            }
            //Console.WriteLine("variable for " + variable);
            //Console.WriteLine("variable condicion " + condicion);
            this.LISTA_TODAS_SENTENCIAS();
            //AUMENTO DE LA VARIABLE DEL FOR
            
            this.emparejar(TipoToken.LLAVE_CIERRE);
            // if (condicion == "++")
            // {
            //     // variable = variableContadorFOR.getLexema();
            //     this.Traduccion += this.tabulacion + variable + " += " + "1\n";
            // }
            
            // else
            // {
            //     this.Traduccion += this.tabulacion + variable + " " + condicion + " " + "1\n";
            // }
        }
        this.disminuirTab();
        this.contadorBucles--;
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE

        
    }
    
    /*------------------------------------------------------------------
          SENTENCIA SWITCH
    -------------------------------------------------------------------   */
    public Sentencia_Switch():void {
        if (this.tokenActual.tipoToken == TipoToken.SWITCH) 
        {
            this.emparejar(TipoToken.SWITCH);
            this.emparejar(TipoToken.PARENTESIS_APERTURA);
          //  this.Traduccion += "" + this.tokenActual.lexemaToken + " == ";
            this.variableCondicionCase = this.tokenActual; // GUARDAMOS EL NOMBRE DE LA VARIABLE QUE SE VA A USAR EL LOS CASES
            this.emparejar(TipoToken.IDENTIFICADOR);
            this.emparejar(TipoToken.PARENTESIS_CIERRE);
            
            this.emparejar(TipoToken.LLAVE_APERTURA);

            this.Traduccion += this.tabulacion + "def switch(case, " + this.variableCondicionCase.lexemaToken + "):\n";
            this.AumentarTab();
            this.Traduccion += this.tabulacion + "switcher = {\n";
            this.AumentarTab();
            this.List_Case();
            this.Case_Default();
            this.List_Case();
            
            this.emparejar(TipoToken.LLAVE_CIERRE);
    
            this.disminuirTab();
            this.Traduccion += this.tabulacion + "}\n";
            this.disminuirTab();
            
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
        // let bandera: number = this.controlToken;
        // while (this.tokenActual.tipoToken !== TipoToken.DOS_PUNTOS && this.listaTokens.length > this.controlToken) {
        //     this.controlToken++;
        //     this.tokenActual = this.listaTokens[this.controlToken];
        // }
        // if (this.tokenActual.tipoToken === TipoToken.IDENTIFICADOR && this.contadorCase == 0)
        // {
        //     this.esFor = true; //NO QUEREMOS QUE TRADUZCA NADA
            
        //     this.variableCondicionCase = this.tokenActual;
        //     console.log(" variable contador " + this.variableCondicionCase.lexemaToken);
        //     this.AumentarTab();
        //     this.Traduccion += "" + this.variableCondicionCase.lexemaToken + "):\n" + this.tabulacion + "switcher = {\n";
        //     this.AumentarTab();
        //     this.emparejar(TipoToken.IDENTIFICADOR);
        //     this.AsignacionOrListaVariables();
        //     this.emparejar(TipoToken.PUNTO_COMA);
        //     //PARA ESTA COSA
        //     this.esFor = false;
        //     this.controlToken = bandera;
        // }
        // else if(this.contadorCase == 0){
        //     this.AumentarTab();
        //     this.Traduccion += "None):\n" + this.tabulacion + "switcher = {\n";
        //     this.AumentarTab();
        // }
        // this.controlToken = bandera;
        this.tokenActual = this.listaTokens[this.controlToken];
        this.emparejar(TipoToken.CASE);
        this.contadorCase++;
        this.Traduccion += this.tabulacion;
        this.ValorDato();
        
        this.emparejar(TipoToken.DOS_PUNTOS);
        this.Traduccion += ":\n";
        //PRIMER VALOR TIENE QUER SER UNA ASIGNACION
        //this.AumentarTab();
        this.LISTA_TODAS_SENTENCIAS();
        if(this.Traduccion[this.Traduccion.length-1] == "\n" || this.Traduccion[this.Traduccion.length-1] == ";"){
            this.Traduccion = this.Traduccion.slice(0,-1);
            this.Traduccion += ",\n"
        }
        else{
            this.Traduccion += ',\n';
        }
        this.emparejar(TipoToken.BREAK);
        this.emparejar(TipoToken.PUNTO_COMA);
        //this.disminuirTab();
    }
    private Case_Default():void  // default es opcional
    {
        if (this.tokenActual.tipoToken == TipoToken.DEFAULT) 
        {
            this.emparejar(TipoToken.DEFAULT);
            this.Traduccion += this.tabulacion + (this.contadorCase+1) + ':\n'; 
            this.emparejar(TipoToken.DOS_PUNTOS);
            this.LISTA_TODAS_SENTENCIAS();
            this.emparejar(TipoToken.BREAK);
            this.emparejar(TipoToken.PUNTO_COMA);
            if(this.Traduccion[this.Traduccion.length-1] == "\n" || this.Traduccion[this.Traduccion.length-1] == ";"){
                this.Traduccion = this.Traduccion.slice(0,-1);
                this.Traduccion += ",\n"
            }
            else{
                this.Traduccion += ',\n';
            }
        }
    }
     /*------------------------------------------------------------------
        SENTENCIA IMPRIMIR
    -------------------------------------------------------------------   */
    public Sentencia_Imprimir():void {
        this.emparejar(TipoToken.CONSOLE);
        this.emparejar(TipoToken.PUNTO);
        if(this.tokenActual.tipoToken === TipoToken.WRITELINE){
            this.emparejar(TipoToken.WRITELINE);
        }
        else{
            this.emparejar(TipoToken.WRITE);
        }
        this.Traduccion += this.tabulacion + "print";
        this.emparejar(TipoToken.PARENTESIS_APERTURA);
        this.Traduccion += "(";
        this.ValorDato();
        this.emparejar(TipoToken.PARENTESIS_CIERRE);
        this.Traduccion += ")";
        this.emparejar(TipoToken.PUNTO_COMA);
        this.Traduccion += "\n";
        this.LISTA_TODAS_SENTENCIAS();  //CUANDO TERMINE UNA PASE A LA SIGUIENTE
    }
    /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                    METODOS, FUNCIONES Y MAIN ------------------------------------------------------------------------------------------------------------------------------------
    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  */
    private LlamarFuncion():void{
        this.emparejar(TipoToken.PARENTESIS_APERTURA);
        this.Traduccion += "(";
        if(this.tokenActual.tipoToken === TipoToken.PARENTESIS_CIERRE){
            //EPSILON
        }
        else{
            this.ValorDato();
            if(this.tokenActual.tipoToken === TipoToken.COMA){
                this.MasParametros();
            }
        }
        this.Traduccion += ")\n";
        this.emparejar(TipoToken.PARENTESIS_CIERRE);
    }
    private MasParametros():void{
        if(this.tokenActual.tipoToken === TipoToken.COMA){
            this.emparejar(TipoToken.COMA);
            this.ValorDato();
            this.MasParametros();
        }
        else{}//EPSILON
    }
    private ReconocerEncapsulamiento(){
        if (this.tokenActual.tipoToken === TipoToken.PRIVATE) {
            this.emparejar(TipoToken.PRIVATE);
        }
        else if (this.tokenActual.tipoToken === TipoToken.PUBLIC) {
            this.emparejar(TipoToken.PUBLIC);
        }
        else if (this.tokenActual.tipoToken === TipoToken.PROTECTED) {
            this.emparejar(TipoToken.PROTECTED);
        }
    }
    private Parametro_NoVacio() {
        if(this.Reconocer_TipoDato()){
            this.TipoDato();
        }
        else{this.emparejar(TipoToken.VALOR);} //TIPO DE DATO REPRESENTATIVO //ERROR SINTACTICO
        
        this.Traduccion += this.tokenActual.lexemaToken; //AGREGANDO PARAMETRO
        this.emparejar(TipoToken.IDENTIFICADOR);
        if(this.tokenActual.tipoToken === TipoToken.COMA){
            this.Traduccion += ',';
            this.emparejar(TipoToken.COMA);
            this.Parametro_NoVacio();
        }
        else{}//YA NO VIENEN PARAMETROS
    }
    private Parametros(){
        if(this.tokenActual.tipoToken !== TipoToken.PARENTESIS_CIERRE){
            this.Parametro_NoVacio();
        }
        else{}//EPSILON NO VIENE NI UN SOLO PARAMETRO
    }
    private Sentencia_Metodos(){
        //this.ReconocerEncapsulamiento();
        this.Traduccion += this.tabulacion + "def " + this.nombreMetodo + "(";
        this.emparejar(TipoToken.PARENTESIS_APERTURA);
        this.Parametros();
        this.emparejar(TipoToken.PARENTESIS_CIERRE);
        this.Traduccion += '):\n';
        this.emparejar(TipoToken.LLAVE_APERTURA);
        this.AumentarTab();
        this.LISTA_TODAS_SENTENCIAS();
        this.disminuirTab();
        this.emparejar(TipoToken.LLAVE_CIERRE);
        if(this.nombreMetodo === 'main'){
            this.Traduccion += this.tabulacion + "if _name_=\"_main_\": \n"
            this.AumentarTab();
            this.Traduccion += this.tabulacion + "main()\n";
            this.disminuirTab();
        }
        
        this.LISTA_TODAS_SENTENCIAS();
    }
    private void_metodo(){
        if(this.Reconocer_TipoDato()){
            this.TipoDato();
        }
        else if(this.tokenActual.tipoToken === TipoToken.VOID){
            this.emparejar(TipoToken.VOID);
        }
        this.nombreMetodo = this.tokenActual.lexemaToken;
        this.Traduccion += this.tabulacion + "def " + this.nombreMetodo + "(";
        this.emparejar(TipoToken.IDENTIFICADOR); //NOMBRE DEL METODO
        this.emparejar(TipoToken.PARENTESIS_APERTURA);
        this.Parametros();
        this.emparejar(TipoToken.PARENTESIS_CIERRE);
        this.Traduccion += '):\n';
        this.emparejar(TipoToken.LLAVE_APERTURA);
        this.AumentarTab();
        this.LISTA_TODAS_SENTENCIAS();
        this.disminuirTab();
        this.emparejar(TipoToken.LLAVE_CIERRE);
        if(this.nombreMetodo === 'main'){
            this.Traduccion += this.tabulacion + "if _name_=\"_main_\": \n"
            this.AumentarTab();
            this.Traduccion += this.tabulacion + "main()\n";
            this.disminuirTab();
        }
        
        this.LISTA_TODAS_SENTENCIAS();
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