import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  photoUrl: string;
  user: User;
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  constructor(
    private route: ActivatedRoute,
    private alertifyService: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });

    this.authService.currentPhotoUrl.subscribe(photoUrl => (this.photoUrl = photoUrl));
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
      () => {
        this.alertifyService.success('Profile updated successfully');
        this.editForm.reset(this.user);
      },
      error => this.alertifyService.error(error)
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotificaton($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  updateMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }
}
