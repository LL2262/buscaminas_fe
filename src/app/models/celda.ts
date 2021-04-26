export interface Celda{
    
        esMina?: boolean, // Indica si la celda es una mina
        descubierta?: boolean, // Indica si la celda fue descubierta
        bandera?: boolean, // Indica si en la celda se coloco una bandera
        probabilidad?: number, // Indica la cantidad de minas en los alrrededores
    
}