import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, deleteDoc, doc, collectionData, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Recipe } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
    constructor(
        private firestore: Firestore,
        private auth: Auth
    ) {}

    getUserRecipes() {
        const user = this.auth.currentUser;
        if (!user) throw new Error('User not authenticated');
    
        const recipesCollection = collection(this.firestore, 'recipes');
        const q = query(
            recipesCollection,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        return collectionData(q, { idField: 'id' }).pipe(
            map(recipes => recipes as Recipe[])
        );
    }

    async deleteRecipe(recipeId: string) {
        await deleteDoc(doc(this.firestore, 'recipes', recipeId));
    }

    async createRecipe(recipeData: any) {
        const user = this.auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const recipeWithMetadata = {
            ...recipeData,
            ingredients: recipeData.ingredients.filter((i: string) => i.trim() !== ''), // Clean empty strings
            userId: user.uid,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const recipesCollection = collection(this.firestore, 'recipes');
        return await addDoc(recipesCollection, recipeWithMetadata);
    }
}