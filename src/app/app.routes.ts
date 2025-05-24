import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecipeEditorComponent } from './recipe-editor/recipe-editor.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'recipes/new', component: RecipeEditorComponent },
    { path: '**', redirectTo: '' }
];
