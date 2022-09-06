import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { doc } from 'firebase/firestore';
import { Observable, switchMap } from 'rxjs';
import { User } from 'src/models/user';
import { AuthService } from '../services/auth.service';
import { ProfilServiceService } from '../services/profil-service.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /* matcher = new MyErrorStateMatcher(); */
  loading = false;
  hide = true;
  hide1 = true;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  signUpForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    },
    { validators: passwordsMatchValidator() }
  );

  constructor(
    public router: Router,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    public profilService: ProfilServiceService,
    private toast: HotToastService,
    public auth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  get email() {
    //return this.signInForm.get('email');
    return this.loginForm.get('email'), this.signUpForm.get('email');
  }

  get password() {
    return this.loginForm.get('password'), this.signUpForm.get('password');
  }

  get name() {
    return this.signUpForm.get('name');
  }

  /**
   *
   * Login Function
   */
  async onSignIn() {
    this.loading = true;
    if (!this.loginForm.valid) {
      this.loading = false;
      return;
    }
    this.loginUser();
  }

  loginUser() {
    const { email, password } = this.loginForm.value;

    this.authService
      .signInUser(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'logging in...',
          error: 'There was an error',
        })
      )
      .subscribe(() => {
        this.router.navigate(['/slack/:id']);
      });
    this.loading = false;
  }

  /**
   * User Registration
   *
   */
  onSignUp() {
    //this.checkPasswords;
    this.loading = true;

    if (!this.signUpForm.valid) {
      this.loading = false;
      return;
    }

    this.createUser();
  }

  /**
   * User Registration
   *
   */
  createUser() {
    const { email, password, name } = this.signUpForm.value;

    this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.profilService.addUser({ uid, email, displayName: name })
        ),
        this.toast.observe({
          success: 'You are registered',
          loading: 'Signing In',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate([`/slack/:id`]);
      });
  }

  /* async loginGuest() {
    await this.authService.guestLogin();
    this.loading = false;
  } */
}
