import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../module-service/user.service';
import { Subscription } from 'rxjs';
import { CreateUserService } from '../create-user/create-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-team',
  templateUrl: './assign-team.component.html',
  styleUrls: ['./assign-team.component.css']
})
export class AssignTeamComponent implements OnInit {
  assignUserData: FormGroup;
  createUserData: FormGroup;
  public userSubscription: Subscription;
  public teamNameSubscription: Subscription;
  setMessage: any = {};msg: string; status: String;
 
  companyNames: string[];
  departmentNames: string[];
  projectNames: string[];
  teamNames: string[];
  selectedDepartment: string;
  selectedCompany: string;
  dropdownSettings = {};
  selectedItems = [];
  requiredField: boolean = false;
  teamSubscription$: Subscription; 
  userteamSubscription$: Subscription;
  userDetails: [];

  constructor(
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private _createUserService: CreateUserService,
    private router: Router
  ) { }

  ngOnInit() {

    this.userSubscription = this._userService.getAllUser().subscribe(resp => {
      this.userDetails = resp;
      console.log(resp)
    }, err => {
      this.setMessage = { message: 'Server Unreachable ,Please Try Again Later !!', error: true };
    })

    this.assignUserData = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(1)]],
      userTeamName: ['', [Validators.required, Validators.minLength(2)]],
      // eMail: ['', [Validators.required, Validators.minLength(2)]]
    });
    
    this.userteamSubscription$ = this._createUserService.getAllTeamNames().subscribe(resp => {
      this.teamNames = resp;
      console.log(resp)
    }, err => {
      this.setMessage = { message: 'Server Unreachable ,Please Try Again Later !!', error: true };
    })

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'teamId',
      textField: 'teamName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.setStatus();
  }
  setStatus() {
    (this.selectedItems.length > 0) ? this.requiredField = true : this.requiredField = false;
  }

  onItemSelect(item: any) {
    console.log(item)
    //Do something if required
    // this.setClass();
  }
  onSelectAll(items: any) {
    //Do something if required
    this.setClass();
  }

  setClass() {
    this.setStatus();
    if (this.selectedItems.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }
  submission() {
    if (this.requiredField == false) {
      /* Print a message that not all required fields were filled... */
    }
    /* Do form submission... */
  }
  onSubmit() {
    // if (this.assignUserData.invalid) {
    //   return;
    // }
    let k =[];

       k= this.assignUserData.value.userTeamName
       var object = k.reduce(
         (obj, item) => Object.assign(obj, {[item.teamId]:  item.teamName }), {});


      this._createUserService.createUserTeam(this.assignUserData.value, Object.values(object).toString()).subscribe(resp => {
      console.log("response Object ", resp);
      this.msg = resp.msg;
      this.status = resp.status.toUpperCase();
      if (this.status == 'ERROR') {
        this.router.navigate(['/admin']);
        this.setMessage = { message: this.msg, error: true };
      } else if (this.status == 'SUCCESS') {
        this.router.navigate(['/admin']);
        this.setMessage = { message: this.msg, msg: true };
      }
    })
  }
  

}


