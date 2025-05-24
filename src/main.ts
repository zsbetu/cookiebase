import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { firebaseConfig } from './app/firebase.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
