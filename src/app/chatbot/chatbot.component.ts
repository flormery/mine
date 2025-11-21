// src/app/chatbot/chatbot.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, Message } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isOpen = false;
  userInput = '';
  messages: Message[] = [];
  isTyping = false;
  private shouldScrollToBottom = false;

  // Sugerencias rápidas
  quickSuggestions = [
    { icon: '📰', text: 'Últimas noticias', command: 'Últimas noticias' },
    { icon: '⚽', text: 'Deportes', command: 'Noticias de deportes' },
    { icon: '💼', text: 'Economía', command: 'Noticias de economía' },
    { icon: '🌍', text: 'Internacional', command: 'Noticias internacionales' }
  ];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.messages = this.chatbotService.getConversationHistory();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * Alterna la visibilidad del chat
   */
  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.shouldScrollToBottom = true;
      setTimeout(() => {
        const input = document.querySelector('.chat-input') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  }

  /**
   * Envía mensaje del usuario
   */
  async sendMessage(): Promise<void> {
    if (!this.userInput.trim()) return;

    const message = this.userInput.trim();
    this.userInput = '';
    this.isTyping = true;
    this.shouldScrollToBottom = true;

    try {
      await this.chatbotService.processMessage(message);
      this.messages = this.chatbotService.getConversationHistory();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setTimeout(() => {
        this.isTyping = false;
        this.shouldScrollToBottom = true;
      }, 500);
    }
  }

  /**
   * Envía sugerencia rápida
   */
  async sendQuickSuggestion(command: string): Promise<void> {
    this.userInput = command;
    await this.sendMessage();
  }

  /**
   * Maneja el Enter en el input
   */
  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Limpia el historial del chat
   */
  clearChat(): void {
    this.chatbotService.clearHistory();
    this.messages = this.chatbotService.getConversationHistory();
    this.shouldScrollToBottom = true;
  }

  /**
   * Abre enlace de noticia
   */
  openNewsLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  /**
   * Formatea la fecha
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      return date.toLocaleDateString('es-ES', options);
    } catch {
      return dateString;
    }
  }

  /**
   * Trunca texto largo
   */
  truncateText(text: string, maxLength: number = 150): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Scroll automático al final
   */
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  /**
   * Formatea el tiempo del mensaje
   */
  formatMessageTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
