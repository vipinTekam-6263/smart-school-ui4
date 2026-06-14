import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VerifyOtpRequestDto } from '../../../models/auth/request/varify-otp-request.dto';

interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  // ================= FIELDS =================
  email = '';
  password = '';
  otp = '';
  newPassword = '';

  otpType: string = '';

  // ================= FLOW CONTROL =================
  isLoginFlow = false;
  isForgotFlow = false;
  isResetFlow = false;

  showOtpField = false;
  showPassword = false;
  isLoading = false;

  timer = 60;
  interval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // ================= LOGIN =================
  login() {

    if (!this.email || !this.password) {

      this.snackBar.open(
        'Email and password required',
        'Close',
        { duration: 3000 }
      );

      return;
    }

    this.isLoading = true;

    const data: LoginData = {
      username: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe({

      next: () => {

        this.isLoading = false;

        // 🔥 LOGIN FLOW START
        this.otpType = 'LOGIN';

        this.isLoginFlow = true;
        this.isForgotFlow = false;
        this.isResetFlow = false;

        this.showOtpField = true;

        this.snackBar.open(
          'OTP sent for login',
          'Close',
          { duration: 3000 }
        );
      },

      error: () => {

        this.isLoading = false;

        this.snackBar.open(
          'Invalid credentials',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  // ================= SEND OTP =================
  sendOtp() {

    const otpTypeToSend = this.isForgotFlow
      ? 'FORGET_PASSWORD'
      : 'LOGIN';

    const data = {
      username: this.email,
      otpType: otpTypeToSend
    };

    this.authService.sendOtp(data).subscribe({

      next: () => {

        this.startTimer();

        this.snackBar.open(
          'OTP sent successfully',
          'Close',
          { duration: 3000 }
        );
      },

      error: () => {

        this.snackBar.open(
          'Failed to send OTP',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  // ================= VERIFY OTP =================
  verifyOtp() {

    if (!this.otp) {

      this.snackBar.open(
        'Please enter OTP',
        'Close',
        { duration: 3000 }
      );

      return;
    }

    this.isLoading = true;

    const data: VerifyOtpRequestDto = {
      username: this.email.trim(),
      otp: this.otp.trim(),
      otpType: this.otpType
    };

    // 🔥 API SELECT
    const apiCall = this.isForgotFlow
      ? this.authService.verifyForgotOtp(
          this.email.trim(),
          this.otp.trim()
        )
      : this.authService.verifyOtp(data);

    apiCall.subscribe({

      next: (res: any) => {

        this.isLoading = false;

        // ================= FORGOT PASSWORD FLOW =================
        if (this.isForgotFlow) {

          this.showOtpField = false;

          this.isResetFlow = true;

          this.snackBar.open(
            'OTP verified. Now reset password.',
            'Close',
            { duration: 3000 }
          );

        }

        // ================= LOGIN FLOW =================
        else {

          console.log('LOGIN VERIFY RESPONSE:', res);

          const token = res.data?.token;
          const role = res.data?.role;
          const schoolId = res.data?.schoolId;

          // 🔥 STORE TOKEN
          if (token) {
            localStorage.setItem('token', token);
          }

          // 🔥 STORE ROLE
          if (role) {
            localStorage.setItem('role', role);
          }

          // 🔥 STORE SCHOOL ID
          if (schoolId) {
            localStorage.setItem(
              'schoolId',
              schoolId.toString()
            );
          }

          this.snackBar.open(
            'Login successful',
            'Close',
            { duration: 3000 }
          );

          // ================= ROLE BASED REDIRECT =================

          if (role === 'SUPER_ADMIN') {

            this.router.navigate([
              '/superadmin-dashboard'
            ]);

          }

          else if (role === 'STATE_ADMIN') {

            this.router.navigate([
              '/stateadmin-dashboard'
            ]);

          }

          else if (role === 'DISTRICT_ADMIN') {

            this.router.navigate([
              '/districtadmin-dashboard'
            ]);

          }

          else if (role === 'SCHOOL_ADMIN') {

            this.router.navigate([
              '/schooladmin-dashboard'
            ]);

          }

          else if (role === 'TEACHER') {

            this.router.navigate([
              '/teacher-dashboard'
            ]);

          }

          else if (role === 'PARENT') {

            this.router.navigate([
              '/parent-dashboard'
            ]);

          }

          else if (role === 'STUDENT') {

            this.router.navigate([
              '/dashboard'
            ]);

          }

          else {

            // 🔥 FALLBACK
            this.router.navigate([
              '/'
            ]);
          }
        }
      },

      error: () => {

        this.isLoading = false;

        this.snackBar.open(
          'Invalid OTP',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  // ================= FORGOT PASSWORD =================
  sendForgotOtp() {

    if (!this.email) {

      this.snackBar.open(
        'Please enter email or mobile',
        'Close',
        { duration: 3000 }
      );

      return;
    }

    // 🔥 FORGOT FLOW START
    this.otpType = 'FORGET_PASSWORD';

    this.isForgotFlow = true;
    this.isLoginFlow = false;
    this.isResetFlow = false;

    this.showOtpField = true;

    const data = {
      username: this.email,
      otpType: this.otpType
    };

    this.authService.sendOtp(data).subscribe({

      next: () => {

        this.startTimer();

        this.snackBar.open(
          'Reset OTP sent',
          'Close',
          { duration: 3000 }
        );
      },

      error: () => {

        this.snackBar.open(
          'Failed to send OTP',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  // ================= RESET PASSWORD =================
  resetPassword() {

    if (!this.email || !this.otp || !this.newPassword) {

      this.snackBar.open(
        'All fields are required',
        'Close',
        { duration: 3000 }
      );

      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(
      this.email.trim(),
      this.otp.trim(),
      this.newPassword.trim()
    ).subscribe({

      next: () => {

        this.isLoading = false;

        this.snackBar.open(
          'Password reset successful',
          'Close',
          { duration: 3000 }
        );

        // 🔥 RESET STATES
        this.isForgotFlow = false;
        this.isResetFlow = false;
        this.showOtpField = false;

        this.otp = '';
        this.newPassword = '';

        // 🔥 REDIRECT LOGIN
        this.router.navigate([
          '/auth/login'
        ]);
      },

      error: () => {

        this.isLoading = false;

        this.snackBar.open(
          'Reset password failed',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  // ================= TIMER =================
  startTimer() {

    this.timer = 60;

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {

      if (this.timer > 0) {
        this.timer--;
      }

      else {
        clearInterval(this.interval);
      }

    }, 1000);
  }

  // ================= RESEND OTP =================
  resendOtp() {

    if (this.timer > 0) {
      return;
    }

    this.sendOtp();
  }

  // ================= TOGGLE PASSWORD =================
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ================= DESTROY =================
  ngOnDestroy() {

    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}