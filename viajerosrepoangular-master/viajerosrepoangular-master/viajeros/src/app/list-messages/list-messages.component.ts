import { Component, OnInit } from '@angular/core';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";
import { ChatService } from '../services/chat.service';
import { Chat } from '../models/Chat/Chat';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-list-messages',
  standalone: true,
  imports: [PhoneNavbarComponent, CommonModule],
  templateUrl: './list-messages.component.html',
  styleUrl: './list-messages.component.css'
})
export class ListMessagesComponent implements OnInit {
  chats: Chat[] = [];  // Variable para almacenar los chats

  constructor(private chatService: ChatService, private router: Router, private userservice:UserService) { }

  ngOnInit(): void {
    this.loadChats();  // Cargar los chats al inicializar el componente
  }

  // Método para cargar los chats en orden cronológico
  // Método para cargar los chats en orden cronológico
  loadChats(): void {
    this.chatService.getChatsOrderedByDate().subscribe(
      (response: Chat[]) => {
        this.chats = response.map(chat => {
          // Convertir el array de fecha en una fecha válida de JavaScript
          if (Array.isArray(chat.lastMessageDate)) {
            chat.lastMessageDate = new Date(
              chat.lastMessageDate[0], chat.lastMessageDate[1] - 1, chat.lastMessageDate[2],
              chat.lastMessageDate[3], chat.lastMessageDate[4], chat.lastMessageDate[5], chat.lastMessageDate[6]
            );
          }
          return chat;
        });
      },
      (error) => {
        console.error('Error al cargar los chats', error);
      }
    );
  }
  gotochat(chat: Chat) {
    console.log('objeto chat',chat)
    this.userservice.setPassengerId(chat.idPassenger)
    this.router.navigate(['/chat', chat.idTrip]);
  }
}