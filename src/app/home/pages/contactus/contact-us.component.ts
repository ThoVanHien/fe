import { Component } from '@angular/core';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html'
})
export class ContactUsComponent {
  submitted = false;

  contact: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  sendMessage(): void {
    this.submitted = true;
    this.contact = {
      name: '',
      email: '',
      message: ''
    };
  }
}

