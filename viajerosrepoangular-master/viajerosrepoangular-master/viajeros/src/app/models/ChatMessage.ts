export interface ChatMessage {
    contenido: string;  // Contenido del mensaje
    idMensaje: number;     // ID del chat
    idUsuario: number;  // ID del usuario que envía el mensaje
    leido: boolean;
}