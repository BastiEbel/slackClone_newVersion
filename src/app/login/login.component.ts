import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
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
  loading: boolean = false;
  hide: boolean = true;
  hide1: boolean = true;

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

  ngOnInit(): void {
    this.router.navigate(['/login']);
  }

  get email() {
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
  onSignIn() {
    this.loading = true;
    if (!this.loginForm.valid) {
      this.loading = false;
      return;
    }
    this.loginUser();
  }

  async loginUser() {
    const { email, password } = this.loginForm.value;

    await this.authService
      .signInUser(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'logging in...',
          error: 'There was an error',
        })
      )
      .subscribe((res) => {
        this.router.navigate([`/slack/${res.user.uid}`]);
        this.authService.login = true;
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
  async createUser() {
    const { email, password, name } = this.signUpForm.value; //TODO ERROR FirebaseError: Firebase: Error (auth/email-already-in-use). beheben

    await this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.profilService.addUser({ uid, email, displayName: name })
        ),
        this.toast.observe({
          success: 'You are registered',
        })
      )
      .subscribe(() => {
        this.authService.currentUser$.subscribe((res) => {
          this.authService.login = true;
          this.router.navigate([`/slack/${res.uid}`]);
        });
      });
    this.loading = false;
  }

  /**
   * Guest login
   *
   */
  loginGuest() {
    const email = 'guest@example.de';
    const password = '12345678';
    this.loginForm.setValue({ email, password });
    return this.onSignIn();
  }
}
