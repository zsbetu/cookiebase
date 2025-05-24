import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, signOut, User } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { RecipeService } from '../core/services/recipe.service';
import { Subscription } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { ConfirmPasswordDialogComponent } from '../confirm-password-dialog/confirm-password-dialog.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  auth = inject(Auth);
  user: User | null = null;
  private recipesSub!: Subscription;
  deleteForm: FormGroup;
  userRecipes: Recipe[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private recipeService: RecipeService
  ) {
    authState(this.auth).subscribe(u => this.user = u);
    this.deleteForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadRecipes();
  }

  logout() {
    signOut(this.auth)
    .then(() => {
      this.router.navigate(['/'])
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
  }

  loadRecipes() {
    this.recipesSub = this.recipeService.getUserRecipes().subscribe({
      next: (recipes) => this.userRecipes = recipes,
      error: (err) => console.error('Error loading recipes:', err)
    });
  }

  async deleteRecipe(recipeId: string) {
    const confirmed = confirm('Delete this recipe permanently?');
    if (confirmed) {
      try {
        await this.recipeService.deleteRecipe(recipeId);
      } catch (err) {
        alert('Error deleting recipe: ' + (err as Error).message);
      }
    }
  }

  ngOnDestroy() {
    if (this.recipesSub) {
      this.recipesSub.unsubscribe();
    }
  }

  async confirmDelete() {
    if (!this.user || !this.user.email) {
      alert('No user logged in');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmPasswordDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(async (password) => {
      if (password) {
        try {
          const credential = EmailAuthProvider.credential(this.user!.email!, password);
          await reauthenticateWithCredential(this.user!, credential);
        
          const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
          if (confirmed) {
           await deleteUser(this.user!);
            alert('Account deleted successfully.');
           this.logout();
        }
       } catch (err) {
          console.error('Error deleting account:', err);
          alert(this.getFriendlyErrorMessage(err));
        }
      }
    });
  }

  private getFriendlyErrorMessage(error: any): string {
    if (!error.code) return 'An unknown error occurred.';
    switch (error.code) {
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
     case 'auth/requires-recent-login':
       return 'Your session is too old. Please log out and log in again before deleting your account.';
     case 'auth/too-many-requests':
       return 'Too many attempts. Please try again later.';
     default:
       return `Error: ${error.message}`;
    }
  }
}
