import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../models/ChatMessage';
import { UserService } from '../services/user.service';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { Subscription } from 'rxjs';  // Importa Subscription para manejar las suscripciones

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  
  messageList: ChatMessage[] = [];
  userId: string = '';
  userIdConvertedToNumber!: number;
  messageInput: string = '';
  choferId!: number;
  chatId: number = 1;
  userIdBehavior!: number;
  choferIdBehavior!: number;
  tripDetails!: SearchResultMatchDto;
  @Input() tripId: number = 0;

  private subscriptions: Subscription = new Subscription();  // Variable para almacenar todas las suscripciones

  constructor(
    private viajeService: ViajeService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeChat();

    const routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('tripId');
      if (id) {
        this.tripId = +id;
        this.loadTripDetails();
        this.getChoferId();
      }
    });
    this.subscriptions.add(routeSubscription);

    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      this.userId = userIdFromStorage;
      this.userIdConvertedToNumber = parseInt(this.userId, 10);
    } else {
      console.error('No se encontró el userId en localStorage');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();  // Desuscribe todas las suscripciones
    this.chatService.disconnect();  // Lógica para desconectar el chat (si la tienes implementada)
  }

  getChoferId(): void {
    const choferSubscription = this.viajeService.getChoferByTrip(this.tripId).subscribe(
      (idChofer: number) => {
        this.choferId = idChofer;
        console.log('Id del chofer:', this.choferId);
        this.initializeChat();
      },
      (error) => {
        console.error('Error al obtener el id del chofer', error);
      }
    );
    this.subscriptions.add(choferSubscription);
  }

  loadTripDetails(): void {
    const tripDetailsSubscription = this.viajeService.getTripById(this.tripId).subscribe(
      (data: SearchResultMatchDto) => {
        this.tripDetails = data;
        console.log('Detalles del viaje:', this.tripDetails);
      },
      (error) => {
        console.error('Error al cargar los detalles del viaje:', error);
      }
    );
    this.subscriptions.add(tripDetailsSubscription);
  }

  initializeChat(): void {
    if (this.tripId && this.userId && this.choferId) {
      let useridlong = parseInt(this.userId, 10);

      if (this.choferId === useridlong) {
        console.log('El usuario logueado es el chofer. Obteniendo passengerId...');
        const passengerIdSubscription = this.userService.passengerId$.subscribe((passengerId) => {
          if (passengerId !== null) {
            useridlong = passengerId;
            console.log('Nuevo userId (passengerId):', useridlong);
            this.proceedWithChatInitialization(useridlong);
          } else {
            console.error('No se encontró passengerId en UserService.');
          }
        });
        this.subscriptions.add(passengerIdSubscription);
      } else {
        this.proceedWithChatInitialization(useridlong);
      }
    }
  }

  proceedWithChatInitialization(useridlong: number): void {
    const chatSubscription = this.chatService.getOrCreateChat(this.choferId, useridlong, this.tripId).subscribe(
      (idChat) => {
        console.log('Datos enviados:', this.choferId, useridlong, this.tripId);
        this.chatId = idChat;
        this.loadChatHistory();
        this.chatService.joinRoom(idChat.toString());
        this.listenerMessage();
      },
      (error) => {
        console.error('Error al obtener o crear el chat, reintentando...', error);
        setTimeout(() => this.initializeChat(), 3000);
      }
    );
    this.subscriptions.add(chatSubscription);
  }

  loadChatHistory(): void {
    const chatHistorySubscription = this.chatService.getChatHistory(this.chatId).subscribe(
      (messages: ChatMessage[]) => {
        this.messageList = messages;
      },
      (error) => {
        console.error('Error al cargar el historial del chat:', error);
      }
    );
    this.subscriptions.add(chatHistorySubscription);
  }

  sendMessage(): void {
    if (!this.chatId) {
      console.error('El id del chat no está definido.');
      return;
    }

    const chatMessage = {
      contenido: this.messageInput,
      idMensaje: this.chatId,
      idUsuario: parseInt(this.userId, 10),
      leido: false
    };

    this.chatService.sendMessage(this.chatId.toString(), chatMessage);
    this.messageInput = '';
    this.loadChatHistory();
  }

  listenerMessage(): void {
    const listenerSubscription = this.chatService.getMessageSubject().subscribe(
      (newMessages: ChatMessage[]) => {
        this.messageList = [...this.messageList, ...newMessages];
        newMessages.forEach(message => {
          if (message.idUsuario !== parseInt(this.userId, 10)) {
            this.chatService.markMessageAsRead(message.idMensaje).subscribe(
              () => console.log(`Mensaje ${message.idMensaje} marcado como leído`),
              (error) => console.error('Error al marcar el mensaje como leído', error)
            );
          }
        });
        this.loadChatHistory();
      }
    );
    this.subscriptions.add(listenerSubscription);
  }

  onSubirmeClick(): void {
    this.router.navigate(['/subirme', this.tripId]);
  }
}
