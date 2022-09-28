import { Component, HostListener, OnInit } from '@angular/core';
import { ChatServiceService } from '../services/chat-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(public chatService: ChatServiceService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (window.innerWidth < 600) {
      this.chatService.sideNav = true;
    }
  }
}
