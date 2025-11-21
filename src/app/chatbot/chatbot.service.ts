// src/app/chatbot/chatbot.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../../supabaseClients';

export interface Noticia {
  id: number;
  diario: string;
  titulo: string;
  fecha: string;
  enlace: string;
  contenido: string;
  autor: string;
  categoria: string;
  imagen_url: string;
  descripcion: string;
  lugar: string;
}

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  noticias?: Noticia[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private conversationHistory: Message[] = [];
  private messageIdCounter = 0;

  constructor() {
    this.initializeChat();
  }

  /**
   * Inicializa el chat con mensaje de bienvenida
   */
  private initializeChat(): void {
    this.addBotMessage(
      '¡Hola! 👋 Soy tu asistente de NoticiasHoy.\n\n' +
      'Puedo ayudarte con:\n\n' +
      '📰 Ver las últimas noticias\n' +
      '🏷️ Buscar por categoría\n' +
      '📍 Noticias por lugar\n' +
      '📰 Noticias de un diario específico\n' +
      '🔍 Buscar por tema\n\n' +
      '¿Qué te gustaría saber?'
    );
  }

  /**
   * Procesa el mensaje del usuario
   */
  async processMessage(userMessage: string): Promise<void> {
    this.addUserMessage(userMessage);
    const intent = this.detectIntent(userMessage.toLowerCase());
    await this.generateResponse(intent, userMessage);
  }

  /**
   * Detecta la intención del usuario
   */
  private detectIntent(message: string): string {
    // Saludos
    if (/^(hola|hi|hey|buenos días|buenas tardes|buenas noches|saludos)/i.test(message)) {
      return 'greeting';
    }

    // Ayuda o menú
    if (/(ayuda|help|menú|menu|opciones|qué puedes|que puedes|comandos)/i.test(message)) {
      return 'help';
    }

    // Últimas noticias
    if (/(últimas|ultimas|recientes|nuevas|hoy|actuales|última|ultima)/i.test(message)) {
      return 'latest';
    }

    // Por categoría
    if (/(categoría|categoria|tipo|sección|seccion)/i.test(message)) {
      return 'category';
    }

    // Por lugar
    if (/(lugar|ciudad|región|region|donde|dónde|de dónde)/i.test(message)) {
      return 'place';
    }

    // Por diario
    if (/(diario|periódico|periodico|medio|fuente)/i.test(message)) {
      return 'newspaper';
    }

    // Buscar
    if (/(buscar|busca|encuentra|encontrar|sobre|acerca|tema)/i.test(message)) {
      return 'search';
    }

    // Despedida
    if (/(adiós|adios|bye|chao|hasta luego|nos vemos|gracias)/i.test(message)) {
      return 'goodbye';
    }

    return 'search';
  }

  /**
   * Genera respuesta según la intención
   */
  private async generateResponse(intent: string, message: string): Promise<void> {
    switch (intent) {
      case 'greeting':
        this.addBotMessage(
          '¡Hola! 😊 Estoy aquí para ayudarte con las noticias.\n\n' +
          'Puedes preguntarme:\n' +
          '• "Últimas noticias"\n' +
          '• "Noticias de deportes"\n' +
          '• "Noticias de Lima"\n' +
          '• "Noticias de El Comercio"'
        );
        break;

      case 'help':
        this.addBotMessage(
          '🤖 Comandos disponibles:\n\n' +
          '📰 "Últimas noticias" - Noticias más recientes\n' +
          '🏷️ "Noticias de [categoría]" - Por categoría\n' +
          '📍 "Noticias de [lugar]" - Por ubicación\n' +
          '📰 "Noticias de [diario]" - Por periódico\n' +
          '🔍 "Buscar [tema]" - Búsqueda general\n\n' +
          '¿Qué quieres explorar?'
        );
        break;

      case 'latest':
        await this.getLatestNews();
        break;

      case 'category':
        await this.handleCategorySearch(message);
        break;

      case 'place':
        await this.handlePlaceSearch(message);
        break;

      case 'newspaper':
        await this.handleNewspaperSearch(message);
        break;

      case 'search':
        await this.handleGeneralSearch(message);
        break;

      case 'goodbye':
        this.addBotMessage(
          '¡Hasta pronto! 👋 Vuelve cuando necesites más noticias.'
        );
        break;

      default:
        this.addBotMessage(
          'Hmm, no entendí bien. Intenta con:\n' +
          '• "Últimas noticias"\n' +
          '• "Noticias de tecnología"\n' +
          '• "Noticias de Lima"'
        );
    }
  }

  /**
   * Obtiene las últimas noticias
   */
  private async getLatestNews(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('noticiass')
        .select('*')
        .order('id', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        this.addBotMessage(
          `📰 Aquí están las ${data.length} noticias más recientes:`,
          data
        );
      } else {
        this.addBotMessage('No hay noticias disponibles en este momento.');
      }
    } catch (error) {
      console.error('Error obteniendo noticias:', error);
      this.addBotMessage('Hubo un error al obtener las noticias. Intenta de nuevo.');
    }
  }

  /**
   * Busca por categoría
   */
  private async handleCategorySearch(message: string): Promise<void> {
    const categories = [
      'política', 'politica', 'deportes', 'deporte', 'tecnología', 'tecnologia',
      'economía', 'economia', 'internacional', 'entretenimiento', 'salud',
      'educación', 'educacion', 'sociedad', 'cultura', 'ciencia'
    ];

    let foundCategory = '';
    for (const cat of categories) {
      if (message.toLowerCase().includes(cat)) {
        foundCategory = cat;
        break;
      }
    }

    if (!foundCategory) {
      this.addBotMessage(
        '🏷️ Categorías disponibles:\n\n' +
        '• Política\n• Deportes\n• Tecnología\n• Economía\n' +
        '• Internacional\n• Entretenimiento\n• Salud\n• Cultura\n\n' +
        '¿Cuál te interesa?'
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from('noticiass')
        .select('*')
        .ilike('categoria', `%${foundCategory}%`)
        .order('id', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        this.addBotMessage(
          `🏷️ Encontré ${data.length} noticia${data.length > 1 ? 's' : ''} de ${foundCategory}:`,
          data
        );
      } else {
        this.addBotMessage(
          `No encontré noticias de ${foundCategory}. ¿Quieres ver otra categoría?`
        );
      }
    } catch (error) {
      console.error('Error buscando por categoría:', error);
      this.addBotMessage('Hubo un error al buscar. Intenta de nuevo.');
    }
  }

  /**
   * Busca por lugar
   */
  private async handlePlaceSearch(message: string): Promise<void> {
    const places = ['lima', 'arequipa', 'cusco', 'trujillo', 'piura', 'iquitos',
                    'chiclayo', 'huancayo', 'tacna', 'puno', 'juliaca'];

    let foundPlace = '';
    for (const place of places) {
      if (message.toLowerCase().includes(place)) {
        foundPlace = place;
        break;
      }
    }

    if (!foundPlace) {
      this.addBotMessage(
        '📍 ¿De qué lugar quieres ver noticias?\n\n' +
        'Ejemplo: "Noticias de Lima", "Noticias de Arequipa"'
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from('noticiass')
        .select('*')
        .ilike('lugar', `%${foundPlace}%`)
        .order('id', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        this.addBotMessage(
          `📍 Noticias de ${foundPlace.charAt(0).toUpperCase() + foundPlace.slice(1)}:`,
          data
        );
      } else {
        this.addBotMessage(
          `No encontré noticias de ${foundPlace}. Intenta con otro lugar.`
        );
      }
    } catch (error) {
      console.error('Error buscando por lugar:', error);
      this.addBotMessage('Hubo un error al buscar. Intenta de nuevo.');
    }
  }

  /**
   * Busca por diario/periódico
   */
  private async handleNewspaperSearch(message: string): Promise<void> {
    const newspapers = ['comercio', 'república', 'republica', 'gestión', 'gestion',
                        'perú21', 'peru21', 'correo', 'trome', 'ojo'];

    let foundNewspaper = '';
    for (const paper of newspapers) {
      if (message.toLowerCase().includes(paper)) {
        foundNewspaper = paper;
        break;
      }
    }

    if (!foundNewspaper) {
      this.addBotMessage(
        '📰 ¿De qué diario quieres ver noticias?\n\n' +
        'Ejemplo: "Noticias de El Comercio", "Noticias de Gestión"'
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from('noticiass')
        .select('*')
        .ilike('diario', `%${foundNewspaper}%`)
        .order('id', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        this.addBotMessage(
          `📰 Noticias de ${data[0].diario}:`,
          data
        );
      } else {
        this.addBotMessage(
          `No encontré noticias de ese diario. Intenta con otro.`
        );
      }
    } catch (error) {
      console.error('Error buscando por diario:', error);
      this.addBotMessage('Hubo un error al buscar. Intenta de nuevo.');
    }
  }

  /**
   * Búsqueda general por palabra clave
   */
  private async handleGeneralSearch(message: string): Promise<void> {
    const stopWords = ['buscar', 'sobre', 'acerca', 'de', 'la', 'el', 'los', 'las',
                       'un', 'una', 'noticias', 'noticia', 'ver', 'mostrar', 'dame'];

    const words = message.toLowerCase()
      .split(' ')
      .filter(word => !stopWords.includes(word) && word.length > 2);

    if (words.length === 0) {
      this.addBotMessage(
        '🔍 ¿Qué tema quieres buscar?\n\n' +
        'Ejemplo: "Buscar elecciones", "Buscar tecnología"'
      );
      return;
    }

    const searchTerm = words.join(' ');

    try {
      const { data, error } = await supabase
        .from('noticiass')
        .select('*')
        .or(`titulo.ilike.%${searchTerm}%,contenido.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
        .order('id', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        this.addBotMessage(
          `🔍 Encontré ${data.length} noticia${data.length > 1 ? 's' : ''} sobre "${searchTerm}":`,
          data
        );
      } else {
        this.addBotMessage(
          `No encontré noticias sobre "${searchTerm}". Intenta con otro tema.`
        );
      }
    } catch (error) {
      console.error('Error en búsqueda general:', error);
      this.addBotMessage('Hubo un error al buscar. Intenta de nuevo.');
    }
  }

  /**
   * Agrega mensaje del usuario
   */
  private addUserMessage(text: string): void {
    this.conversationHistory.push({
      id: this.messageIdCounter++,
      text,
      isBot: false,
      timestamp: new Date()
    });
  }

  /**
   * Agrega mensaje del bot
   */
  private addBotMessage(text: string, noticias?: Noticia[]): void {
    this.conversationHistory.push({
      id: this.messageIdCounter++,
      text,
      isBot: true,
      timestamp: new Date(),
      noticias
    });
  }

  /**
   * Obtiene el historial
   */
  getConversationHistory(): Message[] {
    return this.conversationHistory;
  }

  /**
   * Limpia el historial
   */
  clearHistory(): void {
    this.conversationHistory = [];
    this.messageIdCounter = 0;
    this.initializeChat();
  }
}
