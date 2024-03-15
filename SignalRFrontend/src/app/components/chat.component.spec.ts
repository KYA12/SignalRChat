import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '../services/chat.service';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message';

// Mock ChatService
class MockChatService {
    messages$: Observable<Message[]> = of([]);
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
        const testMessage = new Message();
        testMessage.user = 'User';
        testMessage.text = 'Test Message';
        component.user = testMessage.user;
        component.text = testMessage.text;
        await component.sendMessage();
        expect(chatService.sendMessage).toHaveBeenCalledWith(testMessage);
        expect(component.text).toBe('');
    });

    it('should not send message if input is empty', async () => {
        component.user = 'User';
        component.text = '';
        await component.sendMessage();
        expect(chatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should call stopConnection on destroy', () => {
        component.ngOnDestroy();
        expect(chatService.stopConnection).toHaveBeenCalled();
    });
});