import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { signup } from './signup/signup';
import { Login } from './login/login';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'signup', component: signup },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '' }
];
