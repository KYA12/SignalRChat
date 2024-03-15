import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Message } from '../models/message'; // Adjust the path as necessary

describe('ChatService', () => {
let service: ChatService;
let hubConnectionSpy: jasmine.SpyObj<any>;

beforeEach(() => {
hubConnectionSpy = jasmine.createSpyObj('HubConnection', ['start', 'stop', 'onclose', 'on', 'invoke']);
hubConnectionSpy.start.and.returnValue(Promise.resolve());
hubConnectionSpy.stop.and.returnValue(Promise.resolve());
hubConnectionSpy.invoke.and.returnValue(Promise.resolve());

spyOn(HubConnectionBuilder.prototype, 'build').and.returnValue(hubConnectionSpy);

TestBed.configureTestingModule({
providers: [ChatService]
});
service = TestBed.inject(ChatService);
});

it('should be created', () => {
expect(service).toBeTruthy();
});

it('should start connection', async () => {
await service.startConnection();
expect(hubConnectionSpy.start).toHaveBeenCalled();
});

it('should handle connection error', async () => {
const error = new Error('Connection failed');
hubConnectionSpy.start.and.returnValue(Promise.reject(error));
await service.startConnection();
expect(hubConnectionSpy.start).toHaveBeenCalled();
service.connectionStatus$.subscribe(status => {
expect(status).toBe('Disconnected');
});
});

it('should send message', async () => {
const newMessage = new Message();
newMessage.user = 'testUser';
newMessage.text = 'testMessage';
await service.startConnection();
await service.sendMessage(newMessage);
expect(hubConnectionSpy.invoke).toHaveBeenCalledWith('SendMessage', newMessage.user, newMessage.text);
});

it('should stop connection', async () => {
await service.startConnection();
await service.stopConnection();
expect(hubConnectionSpy.stop).toHaveBeenCalled();
});
});