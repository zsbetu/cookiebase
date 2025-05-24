import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-password-dialog',
  standalone: true,
  templateUrl: './confirm-password-dialog.component.html',
  styleUrls: ['./confirm-password-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class ConfirmPasswordDialogComponent {
  passwordForm: FormGroup;
  hide = true;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ConfirmPasswordDialogComponent>,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get password() {
    return this.passwordForm.get('password');
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.dialogRef.close(this.passwordForm.value.password);
  }
}