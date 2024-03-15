import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { ChatService } from './services/chat.service';

@NgModule({
    declarations: [
        AppComponent,
        ChatComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        AppRoutingModule,
    ],
    providers: [ChatService],
    bootstrap: [AppComponent]
})

export class AppModule { }