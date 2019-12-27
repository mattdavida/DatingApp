import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message.model';
import { Pagination } from '../_models/pagination.model';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data.messages.result;
      this.pagination = data.messages.pagination;
    });
    this.loadMessages();
  }

  loadMessages() {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        ({ results, pagination }) => {
          this.messages = results;
          this.pagination = pagination;
        },
        error => this.alertifyService.error(error)
      );
  }

  deleteMessage(clickEvent, id: number) {
    clickEvent.stopPropagation();
    this.alertifyService.confirm('Are you sure you want to delete this message?', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(
        () => {
          this.messages.splice(
            this.messages.findIndex(m => m.id === id),
            1
          );
          this.alertifyService.success('Message has been deleted');
        },
        error => this.alertifyService.error(error)
      );
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
