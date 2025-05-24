import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, updateProfile, createUserWithEmailAndPassword, signOut, User, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';
import { authState } from 'rxfire/auth';
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class AuthService {
    user$: Observable<User | null>;
    constructor(private auth: Auth, private router: Router, private firestore: Firestore) {
            this.user$ = authState(this.auth);
    }

    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async register(email: string, password: string, name: string): Promise<void> {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            const user = userCredential.user;
            if (!user) throw new Error('User creation failed');

            await updateProfile(user, { displayName: name });

            const userDocRef = doc(this.firestore, `users/${user.uid}`);
            await setDoc(userDocRef, {
                name: name,
                email: email,
                createdAt: new Date()
            });

            await this.router.navigate(['/dashboard']);

        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(this.getFriendlyErrorMessage(error.code));
        }
    }

    private getFriendlyErrorMessage(code: string): string {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'This email is already registered.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            default:
                return 'Registration failed. Please try again.';
        }
    }

    logout() {
        return signOut(this.auth).then(() => this.router.navigate(['/login']));
    }

    get user(): User | null {
        return this.auth.currentUser;
    }
}