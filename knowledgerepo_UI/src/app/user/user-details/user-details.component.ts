import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../shared/storage.service';
import { Subscription } from 'rxjs';
import { ShowService } from '../show.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  eMail: string;
  userSubscription: Subscription;
  setMessage: any;
  UserDetails: string[];
  public userName: string; public userCompany: string; public userDepartment: string; public userProject: string; public userTeam: string; public userRole:string
  constructor(
    private _storage: StorageService,
    private _userService: ShowService
  ) { }

  ngOnInit() {
    this.userSubscription = this._userService.getUserDetails().subscribe(respObj => {
      console.log(respObj)
      this.UserDetails = respObj;
      this.userName=respObj.userName;
      this.userCompany=respObj.userCompany;
      this.userDepartment=respObj.userdepartment;
      this.userProject=respObj.userProjectName;
      this.userTeam=respObj.userTeamName;
      this.userRole=respObj.userRole;
    }, err => {
      this.setMessage = { message: 'Server Error /Server Unreachable!', error: true };
    })
  }

}
