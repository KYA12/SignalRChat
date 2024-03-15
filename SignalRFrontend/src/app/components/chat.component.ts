import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChatComponent implements OnInit, OnDestroy {
    messages$: Observable<Message[]>;
    user: string = '';
    text: string = '';

    connectionStatus$: Observable<string>;

    constructor(private chatService: ChatService) {
        this.messages$ = this.chatService.messages$;
        this.connectionStatus$ = this.chatService.connectionStatus$;
    }

    ngOnInit(): void {
        this.chatService.startConnection().catch(error => {
        console.error('Error starting connection:', error);
        });
    }

    sendMessage(): void {
        if (this.text.trim()) {
            const newMessage = new Message();
            newMessage.user = this.user;
            newMessage.text = this.text;
            this.chatService.sendMessage(newMessage).then(() => {
                this.text = '';
            }).catch(error => {
                console.error('Error sending message:', error);
            });
        }   
    }

    ngOnDestroy(): void {
        this.chatService.stopConnection().catch(error => {
            console.error('Error disconnecting:', error);
        });
    }

    trackByMessages(index: number, message: Message): any {
        return message ? message.text : undefined;
    }
}