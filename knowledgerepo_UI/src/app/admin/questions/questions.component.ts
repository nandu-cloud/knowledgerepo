import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, from } from 'rxjs';
import { DepartmentService } from '../../module-service/department.service';
import { QuestionService } from '../../module-service/question.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  addQuestions: FormGroup;
  setMessage: any = {};msg: string; status: String;
  companyNameSubscription: Subscription;
  questionSubscription$: Subscription;
  companyNames:string[];

  constructor(
    private formBuilder: FormBuilder,
    private _companyNameService: DepartmentService,
    private router: Router,
    private _questionService: QuestionService
  ) { }

  ngOnInit() {
    this.companyNameSubscription = this._companyNameService.getCompanyName().subscribe(resp => {
      this.companyNames=resp;
    }, err => {
      this.setMessage = { message: 'Server Error /Server Unreachable!', error: true };
    })
  
    this.addQuestions = this.formBuilder.group({
      clientId: ['', [Validators.required, Validators.minLength(1)]],
      jobFunction: ['', [Validators.required, Validators.minLength(2)]],
      question: ['', [Validators.required, Validators.minLength(2)]],
      answer: ['', [Validators.required, Validators.minLength(2)]],
      topic: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit() {
    if (this.addQuestions.invalid) {
      return;
    }
    console.log("output Test",this.addQuestions.value.companyName)
    // console.log(this.addQuestions.value);
    this.questionSubscription$ = this._questionService.createQuestion(this.addQuestions.value).subscribe(resp => {
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
