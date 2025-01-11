import { Injectable } from '@angular/core';
import { Message, Stomp } from '@stomp/stompjs';
import { BehaviorSubject, map, Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../models/ChatMessage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IsChoferDto } from '../models/Chat/IsChoferDto';
import { Chat } from '../models/Chat/Chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  private apiUrl = 'http://localhost:8080'; // Si usas environment para la base URL
  constructor(private http: HttpClient) {
    this.initConnectionSocket();
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'  // Asegúrate de que sea JSON
    });
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket desconectado');
      });
    } else {
      console.log('WebSocket ya estaba desconectado o no inicializado.');
    }
  }


  initConnectionSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = "//localhost:8080/chat-websocket";
      const socket = new SockJS(url);
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect({}, () => {
        console.log("Conectado al WebSocket");
        resolve();
      }, (error: any) => {
        console.error("Error en la conexión WebSocket:", error);
        reject(error);
      });
    });
  }

  async joinRoom(roomId: string): Promise<void> {
    try {
      await this.initConnectionSocket();  // Asegura que la conexión esté establecida
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);
        console.log(messageContent);
        this.messageSubject.next(currentMessage);
      });
      console.log(`Unido a la sala: ${roomId}`);
    } catch (error) {
      console.error('Error al unirse a la sala:', error);
    }
  }


  sendMessage(roomId: string, chatmessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatmessage))
  }

  getMessageSubject() {
    return this.messageSubject.asObservable()
  }

  markMessageAsRead(messageId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    const url = `http://localhost:8080/api/chat/message/${messageId}/markAsRead`;
    return this.http.put<void>(url, {}, { headers });
  }


  // Método para obtener o crear un ChatEntity en el backend
  getOrCreateChat(choferId: number, pasajeroId: number, tripId: number): Observable<number> {
    const headers = this.getAuthHeaders();
    const url = `http://localhost:8080/api/getOrCreateChat?choferId=${choferId}&pasajeroId=${pasajeroId}&viajeId=${tripId}`;
    return this.http.get<number>(url, { headers });
  }


  getChatHistory(chatId: number): Observable<ChatMessage[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChatMessage[]>(`http://localhost:8080/api/chat/history/${chatId}`, { headers });
  }

  // Solicitud para verificar si el usuario es chofer en el chat
  soyChoferDelChat(chatId: number, userId: number): Observable<IsChoferDto> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/chat/message/${chatId}/${userId}`;
    return this.http.get<IsChoferDto>(url, { headers });
  }

  // Solicitud para obtener el ID del chat dado un tripId, choferId y pasajeroId
  getChatId(tripId: number, choferId: number, pasajeroId: number): Observable<number> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/chat/${tripId}/${choferId}/${pasajeroId}`;
    return this.http.get<number>(url, { headers });
  }



  // Método para obtener los chats ordenados por fecha
  getChatsOrderedByDate(): Observable<Chat[]> {
    const headers = this.getAuthHeaders();
    const userId = localStorage.getItem('userId'); // Obtener el userId del localStorage

    if (!userId) {
      throw new Error('User ID no encontrado en localStorage'); // Manejar si no existe el userId
    }

    // Cambiar la URL para que apunte al endpoint correcto y pasar el userId en la ruta
    return this.http.get<Chat[]>(`${this.apiUrl}/api/chats/${userId}`, { headers });
  }



}
