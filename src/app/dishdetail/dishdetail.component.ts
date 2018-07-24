import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';


import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { visibility, flyInOut, expand } from '../animations/app.animation';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  @ViewChild('usercommentsform') userCommentsFormDirective;

  dish : Dish;
  dishIds : number[];
  prev : number;
  next : number;
  userComments : Comment;
  userCommentsForm: FormGroup;
  dishErrMess : string;
  errMess : string;
  dishcopy = null;
  visibility = 'shown';

  constructor(private dishService : DishService,
              private route : ActivatedRoute,
              private location : Location,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) { 
                this.createForm();
              }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.dishErrMess  = <any>errmess.message);
    this.route.params.pipe(switchMap((params : Params) => { this.visibility = 'hidden'; return this.dishService.getDish(+params['id']); }))
    .subscribe( dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
    errmess => { this.dish = null; this.errMess = <any>errmess.message; });
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() : void {
    this.location.back();
  }

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    }
  };

  createForm() {
    this.userCommentsForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: ['5'],
      comment: ['',  [Validators.required]],
      date : ['']
    });
    this.userCommentsForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.userCommentsForm) { return; }
    const form = this.userCommentsForm;
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
    this.userComments = this.userCommentsForm.value;
    this.userComments.date = new Date().toISOString();
    console.log(this.userComments);
    //this.dish.comments.push(this.userComments);
    this.dishcopy.comments.push(this.userComments);
    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
    this.userCommentsFormDirective.resetForm();
    this.userCommentsForm.reset({
      author: '',
      rating: '5',
      comment: '',
      data : ''
    });
    
  }
}
