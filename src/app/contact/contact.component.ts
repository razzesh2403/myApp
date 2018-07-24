import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class ContactComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective;

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackList : Feedback[];
  copyFeedbackList = null;
  copyFeedback = null;
  returnFeedback = null;
  contactType = ContactType;
  loading : boolean;
  contactErrMess : string;

  constructor(private fb: FormBuilder,
    private feedbackService : FeedbackService,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
    this.loading=false;
    this.feedbackService.getFeedbacks().subscribe(feedbacks => {this.copyFeedbackList = feedbacks.slice(0,feedbacks.length);
       this.feedbackList = feedbacks.slice(0,feedbacks.length);},
       errmess => this.contactErrMess  = <any>errmess.message);
    
  }

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern('[0-9]+')] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.loading=true;
    this.feedback = this.feedbackForm.value;
    this.copyFeedback = this.feedback;
    this.copyFeedbackList.push(this.copyFeedback);
    console.log("copy feedback list from service {}", this.copyFeedbackList);
    this.feedbackService.submitFeedback(this.copyFeedback).
    subscribe(feedback => { this.returnFeedback = feedback; 
                            this.loading=false;
                            setTimeout(() =>
                            this.returnFeedback = null
                          , 5000);});
    this.feedbackList.push(this.returnFeedback);
    console.log("after service call this.feedback {}", this.returnFeedback);  
    console.log("updated feedback list {}", this.feedbackList);
    
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
    
  }

}
