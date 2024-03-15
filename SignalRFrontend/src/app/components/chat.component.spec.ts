import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '../services/chat.service';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms'; 

// Mock ChatService
class MockChatService {
messages$: Observable<{ user: string, message: string }[]> = of([]);
connectionStatus$: Observable<string> = of('Disconnected');

startConnection = jasmine.createSpy('startConnection').and.returnValue(Promise.resolve());
sendMessage = jasmine.createSpy('sendMessage').and.returnValue(Promise.resolve());
stopConnection = jasmine.createSpy('stopConnection').and.returnValue(Promise.resolve());
}

describe('ChatComponent', () => {
let component: ChatComponent;
let fixture: ComponentFixture<ChatComponent>;
let chatService: ChatService;

beforeEach(async () => {
await TestBed.configureTestingModule({
declarations: [ ChatComponent ],
imports: [ FormsModule ],
providers: [
{ provide: ChatService, useClass: MockChatService }
]
})
.compileComponents();
});

beforeEach(() => {
fixture = TestBed.createComponent(ChatComponent);
component = fixture.componentInstance;
chatService = TestBed.inject(ChatService);
fixture.detectChanges();
});

it('should create', () => {
expect(component).toBeTruthy();
});

it('should call startConnection on init', () => {
expect(chatService.startConnection).toHaveBeenCalled();
});

it('should send message and clear input when sendMessage is called', async () => {
component.user = 'User';
component.message = 'Test Message';
await component.sendMessage();
expect(chatService.sendMessage).toHaveBeenCalledWith('User', 'Test Message');
expect(component.message).toBe('');
});

it('should not send message if input is empty', async () => {
component.user = 'User';
component.message = '';
await component.sendMessage();
expect(chatService.sendMessage).not.toHaveBeenCalled();
});

it('should call stopConnection on destroy', () => {
component.ngOnDestroy();
expect(chatService.stopConnection).toHaveBeenCalled();
});
});
