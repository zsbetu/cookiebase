import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { RecipeService } from '../core/services/recipe.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './recipe-editor.component.html',
  styleUrls: ['./recipe-editor.component.css']
})
export class RecipeEditorComponent {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  router = inject(Router);

  recipeForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    prepTime: [0, [Validators.min(0)]],
    ingredients: this.fb.array([this.fb.control('')]), // Simple string array
    instructions: ['']
  });

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.control(''));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  async onSubmit() {
    if (this.recipeForm.valid) {
      try {
        await this.recipeService.createRecipe(this.recipeForm.value);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe');
      }
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}