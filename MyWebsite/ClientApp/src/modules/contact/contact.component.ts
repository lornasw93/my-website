import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { MetaDataService } from 'src/core/meta-data.service';
import { Title, Meta } from '@angular/platform-browser';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent extends MetaDataService implements OnInit {
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  constructor(titleService: Title,
    metaService: Meta,
    private fb: FormBuilder,
    public afAuth: AngularFireAuth,
    private functions: AngularFireFunctions,
    private httpClient: HttpClient
  ) {
    super(titleService, metaService);
  }

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    message: ['', Validators.required],
  });

  result: any;

  ngOnInit() {
    this.updateTags('Contact', 'contact');
  }

  onSubmit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    let data = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      message: this.contactForm.value.message
    };

    this.httpClient.post('https://us-central1-email-service-4e890.cloudfunctions.net/sendContactFormSubmittedEmail',
      data,
      httpOptions)
      .subscribe(
        res => {
          Swal.fire(
            'Thanks, ' + this.contactForm.value.name + ' 😀',
            'Your request has been sent.',
            'success'
          );
        },
        err => {
          Swal.fire(
            'Oops!',
            'Something has gone wrong, please send your request via email to hello@lorna.dev.',
            'error'
          );
        }
      );
  };
}
