import { Component, OnInit } from '@angular/core';
import { ReactiveFormConfig } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'zoiss-app';
  ngOnInit(){
    ReactiveFormConfig.set({
      "validationMessage": {
        "required":"Campul este necesar!",
        "minLength":"Numarul minim de caractere este {{1}}!",
        "maxLength":"Numarul maxim de caractere este {{1}}!",
        "numeric": "Format incorect!",
        "email": "Email invalid",
        "compare": "Confirmare parola incorecta",
        "alpha": "Caracterele speciale sunt interzise.",
        "noneOf": "Valoare curenta nu este posibila.",
      }
  });
  }
}