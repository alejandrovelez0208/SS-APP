import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Prueba } from './prueba/prueba';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'signup', component: Signup },
    { path: 'login', component: Login },
    {path: 'prueba', component: Prueba},
    { path: '**', redirectTo: '' }
];
