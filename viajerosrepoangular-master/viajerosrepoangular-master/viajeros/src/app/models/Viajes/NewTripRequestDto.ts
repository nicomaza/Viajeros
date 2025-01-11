export interface NewTripRequestDto {
    idVehiculo: number;
    idChofer: number; // El ID del chofer
    localidadInicioId: number; // El ID de la localidad de inicio
    localidadFinId: number; // El ID de la localidad de fin
    fechaHoraInicio: string; // Fecha y hora de inicio en formato ISO (yyyy-MM-ddTHH:mm)
    gastoTotal: number; // Precio total del viaje
    asientosDisponibles: number; // Espacios disponibles
    aceptaMascotas: boolean; // ¿Aceptas mascotas?
    aceptaFumar: boolean; // ¿Aceptas que fumen?
}
