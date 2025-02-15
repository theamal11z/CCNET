
import { Socket, io } from 'socket.io-client';
import { Session, Account } from '@matrix-org/olm';
import { openDB } from 'idb';
import { supabase } from '../lib/supabase';

export class MessageService {
  private static socket: Socket;
  private static olmAccount: Account;
  private static sessions: Map<string, Session> = new Map();
  private static db: any;

  static async initialize() {
    // Initialize Olm
    await global.Olm.init();
    this.olmAccount = new global.Olm.Account();
    this.olmAccount.create();
    
    // Initialize IndexedDB
    this.db = await openDB('messages', 1, {
      upgrade(db) {
        db.createObjectStore('messages', { keyPath: 'id' });
        db.createObjectStore('sessions', { keyPath: 'userId' });
      },
    });

    // Initialize Socket.IO
    this.socket = io(process.env.EXPO_PUBLIC_SOCKET_URL || '', {
      auth: {
        token: (await supabase.auth.getSession())?.access_token
      }
    });

    this.setupSocketListeners();
  }

  private static setupSocketListeners() {
    this.socket.on('message', async (data) => {
      const { sender, ciphertext } = data;
      const session = this.sessions.get(sender);
      
      if (!session) {
        await this.establishSession(sender);
      }
      
      const plaintext = session?.decrypt(ciphertext);
      await this.storeMessage({
        id: Date.now(),
        sender,
        content: plaintext,
        timestamp: new Date()
      });
    });
  }

  static async sendMessage(recipientId: string, content: string) {
    let session = this.sessions.get(recipientId);
    
    if (!session) {
      session = await this.establishSession(recipientId);
    }

    const ciphertext = session.encrypt(content);
    this.socket.emit('message', {
      recipient: recipientId,
      ciphertext
    });

    await this.storeMessage({
      id: Date.now(),
      recipient: recipientId,
      content,
      timestamp: new Date()
    });
  }

  private static async establishSession(userId: string) {
    const session = new global.Olm.Session();
    // Implementation of Double Ratchet key exchange would go here
    this.sessions.set(userId, session);
    await this.db.put('sessions', { userId, session });
    return session;
  }

  private static async storeMessage(message: any) {
    await this.db.add('messages', message);
  }

  static async getMessages(userId: string): Promise<any[]> {
    return this.db.getAllFromIndex('messages', 'userId', userId);
  }
}
