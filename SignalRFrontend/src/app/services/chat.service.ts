import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType  } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
providedIn: 'root'
})
export class ChatService {
private hubConnection!: HubConnection;
private connectionStatusSource = new BehaviorSubject<string>('Disconnected');
public connectionStatus$ = this.connectionStatusSource.asObservable();
private messagesSource = new BehaviorSubject<{ user: string, message: string }[]>([]);
public messages$ = this.messagesSource.asObservable();

public async startConnection(): Promise<void> {
this.hubConnection = new HubConnectionBuilder()
.withUrl(environment.hubConnectionURL, {
skipNegotiation: true,
transport: HttpTransportType.WebSockets
})
.withAutomaticReconnect()
.build();

this.hubConnection.onclose(() => {
this.connectionStatusSource.next('Disconnected');
console.log('SignalR Disconnected');
});

try {
await this.hubConnection.start();
this.connectionStatusSource.next('Connected');
console.log('Connection started');
} catch (err) {
this.connectionStatusSource.next('Disconnected');
console.log('Error while starting connection: ' + err);
}

this.hubConnection.on('ReceiveMessage', (user, message) => {
const newMessages = [...this.messagesSource.value, { user, message }];
this.messagesSource.next(newMessages);
});
}

public async sendMessage(user: string, message: string): Promise<void> {
try {
await this.hubConnection.invoke('SendMessage', user, message);
} catch (err) {
console.log('Error while sending message: ' + err);
}
}

public stopConnection(): Promise<void> {
return this.hubConnection.stop();
}

public getConnectionStatus(): string {
return this.hubConnection.state;
}
}