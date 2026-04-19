import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <section class="not-found">
      <p class="eyebrow">404</p>
      <h1>That page left the draft folder.</h1>
      <p>The route does not exist in this demo.</p>
      <a mat-flat-button color="primary" routerLink="/home">Back home</a>
    </section>
  `
})
export class NotFoundComponent {}
