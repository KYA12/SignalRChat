import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';

@Component({
selector: 'app-chat',
templateUrl: './chat.component.html',
styleUrls: ['./chat.component.scss'],
changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {
messages$: Observable<{ user: string, message: string }[]>;
user: string = '';
message: string = '';
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
if (this.message.trim()) {
this.chatService.sendMessage(this.user, this.message).then(() => {
this.message = '';
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

trackByMessages(index: number, message: { user: string, message: string }): any {
return message ? message.message : undefined;
}
}
