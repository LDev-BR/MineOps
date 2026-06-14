import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-3 md:p-6 antialiased relative overflow-y-auto md:overflow-hidden font-sans select-none transition-colors duration-300"
         [class.bg-slate-50]="themeService.isThemeLight()"
         [class.bg-slate-950]="!themeService.isThemeLight()"
         [style.background-image]="themeService.isThemeLight() ? 'radial-gradient(#cbd5e1 1px, transparent 1px)' : 'radial-gradient(#1e293b 1px, transparent 1px)'"
         style="background-size: 20px 20px;">
      
      <!-- Theme Switcher Button -->
      <div class="absolute top-3 right-3 md:top-4 md:right-4 z-20">
        <button (click)="toggleTheme()" type="button"
                class="p-1.5 md:p-2 rounded-full border transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer"
                [class.bg-white]="themeService.isThemeLight()"
                [class.border-slate-200]="themeService.isThemeLight()"
                [class.text-slate-600]="themeService.isThemeLight()"
                [class.hover:bg-slate-100]="themeService.isThemeLight()"
                [class.bg-slate-900]="!themeService.isThemeLight()"
                [class.border-slate-800]="!themeService.isThemeLight()"
                [class.text-slate-400]="!themeService.isThemeLight()"
                [class.hover:bg-slate-800]="!themeService.isThemeLight()"
                [title]="themeService.isThemeLight() ? 'Alternar para Tema Escuro' : 'Alternar para Tema Claro'">
          <mat-icon class="text-base leading-none h-4.5 w-4.5 md:text-lg md:h-5 md:w-5">{{ themeService.isThemeLight() ? 'dark_mode' : 'light_mode' }}</mat-icon>
        </button>
      </div>

      <!-- Top Secure Access floating indicator badge -->
      <div class="mb-3 md:mb-4 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] md:text-[11px] font-bold uppercase tracking-wider font-mono shadow-sm transition-colors duration-300"
           [class.bg-[#EFF6FF]]="themeService.isThemeLight()"
           [class.border]="true"
           [class.border-[#BFDBFE]]="themeService.isThemeLight()"
           [class.text-[#1E3A8A]]="themeService.isThemeLight()"
           [class.bg-slate-900]="!themeService.isThemeLight()"
           [class.border-slate-800]="!themeService.isThemeLight()"
           [class.text-slate-400]="!themeService.isThemeLight()">
        <mat-icon class="text-[11px] h-3 w-3 leading-none mr-0.5">lock</mat-icon> SECURE ACCESS
      </div>

      <!-- Center Container Card -->
      <div class="w-full max-w-[380px] border rounded-lg shadow-xl z-10 flex flex-col relative p-5 md:p-6.5 transition-colors duration-300 animate-fadeIn"
           [class.bg-white]="themeService.isThemeLight()"
           [class.border-slate-200]="themeService.isThemeLight()"
           [class.bg-slate-900]="!themeService.isThemeLight()"
           [class.border-slate-800]="!themeService.isThemeLight()">
        
        <!-- Corporate Branding Profile -->
        <div class="text-center flex flex-col items-center gap-1.5 mb-4 md:mb-5">
          <!-- Orange Diamond SVG Logo -->
          <div class="flex items-center gap-2">
            <svg class="w-7 h-7 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L85 50 L50 90 L15 50 Z" fill="#F97316" />
              <path d="M50 10 L50 90 L15 50 Z" fill="#EA580C" opacity="0.3" />
            </svg>
            <div class="flex items-baseline font-sans">
              <span class="text-xl md:text-2xl font-black tracking-tight transition-colors duration-300"
                    [class.text-[#1E293B]]="themeService.isThemeLight()"
                    [class.text-slate-100]="!themeService.isThemeLight()">MINE</span>
              <span class="text-xl md:text-2xl font-black tracking-tight text-[#F97316] ml-0.5">OPS</span>
            </div>
          </div>
          
          <h1 class="text-lg md:text-xl font-bold tracking-tight mt-0.5 transition-colors duration-300"
              [class.text-[#1E293B]]="themeService.isThemeLight()"
              [class.text-white]="!themeService.isThemeLight()">Portal Operacional</h1>
          <p class="text-[11px] font-medium font-sans transition-colors duration-300"
             [class.text-slate-500]="themeService.isThemeLight()"
             [class.text-slate-400]="!themeService.isThemeLight()">Entre com suas credenciais corporativas</p>
        </div>

        <!-- Form fields and alerts -->
        <div class="flex flex-col gap-4">
          @if (errorMessage()) {
            <div class="border rounded p-2.5 flex gap-2 items-start text-[11px] transition-colors duration-300 animate-slideIn"
                 [class.bg-rose-50]="themeService.isThemeLight()"
                 [class.border-rose-200]="themeService.isThemeLight()"
                 [class.text-rose-800]="themeService.isThemeLight()"
                 [class.bg-rose-950/30]="!themeService.isThemeLight()"
                 [class.border-rose-900]="!themeService.isThemeLight()"
                 [class.text-rose-200]="!themeService.isThemeLight()">
              <mat-icon class="text-xs shrink-0 mt-0.5">error_outline</mat-icon>
              <div>
                <p class="font-bold uppercase tracking-wider text-[10px]">Acesso Recusado</p>
                <p class="mt-0.5"
                   [class.text-rose-700]="themeService.isThemeLight()"
                   [class.text-rose-300]="!themeService.isThemeLight()">{{ errorMessage() }}</p>
              </div>
            </div>
          }

          @if (forgotMode()) {
            <!-- Forgot Password Panel -->
            <div class="flex flex-col gap-3 font-sans">
              <h2 class="text-[10px] md:text-xs font-bold tracking-wider uppercase transition-colors duration-300"
                  [class.text-[#1E293B]]="themeService.isThemeLight()"
                  [class.text-white]="!themeService.isThemeLight()">Esqueceu a senha / RESET EXPRESS</h2>
              <p class="text-[11px] leading-relaxed transition-colors duration-300"
                 [class.text-slate-500]="themeService.isThemeLight()"
                 [class.text-slate-400]="!themeService.isThemeLight()">
                Digite seu email corporativo cadastrado para dispararmos as instruções de redefinição de credenciais via SSO.
              </p>
              
              <div class="flex flex-col gap-1">
                <label for="reset-email" class="text-[9px] font-bold font-mono uppercase tracking-wider"
                       [class.text-slate-500]="themeService.isThemeLight()"
                       [class.text-slate-400]="!themeService.isThemeLight()">Corporate Email</label>
                <input id="reset-email" #resetEmail type="email" placeholder="superintendent@mineops.com"
                       class="rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/50 transition-colors duration-300"
                       [class.bg-white]="themeService.isThemeLight()"
                       [class.border-slate-350]="themeService.isThemeLight()"
                       [class.text-slate-900]="themeService.isThemeLight()"
                       [class.placeholder-slate-400]="themeService.isThemeLight()"
                       [class.bg-slate-950]="!themeService.isThemeLight()"
                       [class.border-slate-850]="!themeService.isThemeLight()"
                       [class.text-slate-105]="!themeService.isThemeLight()"
                       [class.placeholder-slate-600]="!themeService.isThemeLight()">
              </div>

              <div class="flex gap-2 mt-1">
                <button (click)="submitForgot(resetEmail.value)" 
                        class="flex-1 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded transition tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <mat-icon class="text-sm">mail</mat-icon> SOLICITAR RESGATE
                </button>
                <button (click)="forgotMode.set(false)" 
                        class="py-1.5 px-3 text-xs font-semibold rounded transition cursor-pointer"
                        [class.bg-slate-100]="themeService.isThemeLight()"
                        [class.text-slate-600]="themeService.isThemeLight()"
                        [class.hover:bg-slate-200]="themeService.isThemeLight()"
                        [class.bg-slate-800]="!themeService.isThemeLight()"
                        [class.text-slate-300]="!themeService.isThemeLight()"
                        [class.hover:bg-slate-700]="!themeService.isThemeLight()">
                  CANCELAR
                </button>
              </div>
            </div>
          } @else {
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-3 font-sans">
              
              <!-- USERNAME / EMAIL input -->
              <div class="flex flex-col gap-1">
                <label for="email" class="text-[9px] font-bold uppercase tracking-wider"
                       [class.text-slate-500]="themeService.isThemeLight()"
                       [class.text-slate-400]="!themeService.isThemeLight()">CORPORATE EMAIL</label>
                <div class="relative">
                  <input type="email" formControlName="email" id="email" placeholder="user@mineops.com"
                         class="w-full rounded pl-3 pr-9 py-1.5 text-xs focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/50 transition-colors duration-300"
                         [class.bg-white]="themeService.isThemeLight()"
                         [class.border-slate-300]="themeService.isThemeLight()"
                         [class.text-slate-900]="themeService.isThemeLight()"
                         [class.placeholder-slate-400]="themeService.isThemeLight()"
                         [class.bg-slate-950]="!themeService.isThemeLight()"
                         [class.border-slate-805]="!themeService.isThemeLight()"
                         [class.text-slate-100]="!themeService.isThemeLight()"
                         [class.placeholder-slate-600]="!themeService.isThemeLight()">
                  <mat-icon class="absolute right-2.5 top-2 text-sm h-4 w-4 transition-colors duration-300"
                            [class.text-slate-400]="themeService.isThemeLight()"
                            [class.text-slate-500]="!themeService.isThemeLight()">mail</mat-icon>
                </div>
                @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
                  <p class="text-[9px] font-mono mt-0.5"
                     [class.text-rose-600]="themeService.isThemeLight()"
                     [class.text-rose-450]="!themeService.isThemeLight()">Formato de e-mail corporativo inválido</p>
                }
              </div>

              <!-- PASSWORD input -->
              <div class="flex flex-col gap-1">
                <label for="password" class="text-[9px] font-bold uppercase tracking-wider"
                       [class.text-slate-500]="themeService.isThemeLight()"
                       [class.text-slate-400]="!themeService.isThemeLight()">PASSWORD</label>
                <div class="relative">
                  <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" id="password" placeholder="••••••••"
                         class="w-full rounded pl-3 pr-9 py-1.5 text-xs focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/50 font-mono transition-colors duration-300"
                         [class.bg-white]="themeService.isThemeLight()"
                         [class.border-slate-300]="themeService.isThemeLight()"
                         [class.text-slate-900]="themeService.isThemeLight()"
                         [class.placeholder-slate-400]="themeService.isThemeLight()"
                         [class.bg-slate-950]="!themeService.isThemeLight()"
                         [class.border-slate-805]="!themeService.isThemeLight()"
                         [class.text-slate-100]="!themeService.isThemeLight()"
                         [class.placeholder-slate-600]="!themeService.isThemeLight()">
                  
                  <button type="button" (click)="showPassword.set(!showPassword())" 
                          class="absolute right-2.5 top-2.5 transition flex items-center justify-center h-4 w-4 cursor-pointer"
                          [class.text-slate-400]="themeService.isThemeLight()"
                          [class.text-slate-500]="!themeService.isThemeLight()"
                          aria-label="Toggle password view">
                    <mat-icon class="text-xs">vpn_key</mat-icon>
                  </button>
                </div>
              </div>

              <!-- REMEMBER ME & FORGOT -->
              <div class="flex justify-between items-center text-[11px] select-none">
                <label class="flex items-center gap-1.5 cursor-pointer transition-colors duration-300"
                       [class.text-slate-600]="themeService.isThemeLight()"
                       [class.text-slate-300]="!themeService.isThemeLight()">
                  <input type="checkbox" formControlName="rememberMe" id="rememberMe"
                         class="accent-[#F97316] h-3 w-3 rounded">
                  <span>Remember me</span>
                </label>
                
                <button type="button" (click)="forgotMode.set(true)" 
                        class="text-[#F97316] hover:text-[#EA580C] font-semibold transition hover:underline cursor-pointer">
                  Forgot password?
                </button>
              </div>

              <!-- SIGN IN ACTION -->
              <button type="submit" [disabled]="loading()"
                      class="mt-1 w-full py-2 bg-[#F97316] hover:bg-[#EA580C] disabled:bg-[#F97316]/60 text-white text-xs font-bold rounded transition tracking-widest flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
                @if (loading()) {
                  <span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  CONNECTING CONTROL ROOM...
                } @else {
                  <span class="font-bold flex items-center gap-1">
                    ACESSAR PORTAL <mat-icon class="text-xs leading-none h-3.5 w-3.5">arrow_forward</mat-icon>
                  </span>
                }
              </button>
            </form>
          }

          <!-- OR LOGIN WITH SSO Section -->
          <div class="flex flex-col gap-2.5 mt-0.5 border-t pt-3.5 transition-colors duration-300"
               [class.border-slate-200]="themeService.isThemeLight()"
               [class.border-slate-800]="!themeService.isThemeLight()">
            <div class="relative flex py-0.5 items-center justify-center text-center">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-dashed"
                      [class.border-slate-200]="themeService.isThemeLight()"
                      [class.border-slate-800]="!themeService.isThemeLight()"></span>
              </div>
              <span class="relative px-2 text-[9px] font-bold uppercase tracking-widest font-mono transition-colors duration-300"
                    [class.bg-white]="themeService.isThemeLight()"
                    [class.text-slate-400]="themeService.isThemeLight()"
                    [class.bg-slate-900]="!themeService.isThemeLight()"
                    [class.text-slate-500]="!themeService.isThemeLight()">OR LOGIN WITH</span>
            </div>

            <!-- Single Sign-On Button -->
            <button (click)="onSubmit()" class="w-full py-1.5 border text-xs font-semibold rounded transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all duration-300"
                    [class.bg-white]="themeService.isThemeLight()"
                    [class.border-slate-300]="themeService.isThemeLight()"
                    [class.text-slate-800]="themeService.isThemeLight()"
                    [class.hover:bg-slate-50]="themeService.isThemeLight()"
                    [class.bg-slate-950]="!themeService.isThemeLight()"
                    [class.border-slate-805]="!themeService.isThemeLight()"
                    [class.text-slate-200]="!themeService.isThemeLight()"
                    [class.hover:bg-slate-900]="!themeService.isThemeLight()">
              <mat-icon class="text-amber-600 text-xs h-3.5 w-3.5 transition-colors duration-300"
                        [class.text-amber-500]="!themeService.isThemeLight()">security</mat-icon>
              <span>Single Sign-On (SSO)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Secure Platform footer -->
      <div class="mt-4 md:mt-6 text-center flex flex-col gap-1 text-[11px] z-10 transition-colors duration-300"
           [class.text-slate-400]="themeService.isThemeLight()"
           [class.text-slate-500]="!themeService.isThemeLight()">
        <div class="space-x-3">
          <a class="hover:text-amber-700 transition cursor-pointer"
             [class.text-slate-500]="themeService.isThemeLight()"
             [class.text-slate-400]="!themeService.isThemeLight()">Support</a>
          <span class="text-slate-300" [class.text-slate-800]="!themeService.isThemeLight()">•</span>
          <a class="hover:text-amber-700 transition cursor-pointer"
             [class.text-slate-500]="themeService.isThemeLight()"
             [class.text-slate-400]="!themeService.isThemeLight()">Privacy Policy</a>
          <span class="text-slate-300" [class.text-slate-800]="!themeService.isThemeLight()">•</span>
          <a class="hover:text-amber-700 transition cursor-pointer"
             [class.text-slate-500]="themeService.isThemeLight()"
             [class.text-slate-400]="!themeService.isThemeLight()">Terms of Use</a>
        </div>
        <p class="text-[9px] font-mono tracking-wide mt-0.5 transition-colors duration-300"
           [class.text-slate-400/80]="themeService.isThemeLight()"
           [class.text-slate-500]="!themeService.isThemeLight()">© 2026 MineOps Enterprise Operations. All rights reserved.</p>
      </div>
    </div>
  `,
  styles: [`
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: #f1f5f9;
      -webkit-box-shadow: 0 0 0px 1000px #020617 inset;
      transition: background-color 5000s ease-in-out 0s;
    }
  `]
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);

  public loading = signal<boolean>(false);
  public forgotMode = signal<boolean>(false);
  public showPassword = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['luistavares235@gmail.com', [Validators.required, Validators.email]],
      password: ['••••••••••••', [Validators.required, Validators.minLength(4)]],
      rememberMe: [true]
    });
  }

  public toggleTheme() {
    const current = this.themeService.activeTheme();
    if (current === 'light') {
      this.themeService.setTheme('dark');
    } else if (current === 'dark') {
      this.themeService.setTheme('light');
    } else {
      this.themeService.setTheme(this.themeService.isThemeLight() ? 'dark' : 'light');
    }
  }

  public async onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set(' Clearance credentials invalid. Please check layout bindings.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password, rememberMe } = this.loginForm.value;

    try {
      const success = await this.authService.login(email, password, rememberMe);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Corporate Single Sign-On rejected clearance pattern.');
      }
    } catch {
      this.errorMessage.set('Connection refused by Identity Provider directory.');
    } finally {
      this.loading.set(false);
    }
  }

  public submitForgot(email: string) {
    if (!email || !email.includes('@')) {
      this.errorMessage.set('Invalid email routing path.');
      return;
    }
    this.forgotMode.set(false);
    this.errorMessage.set('');
    alert(`Reset handshake initiated for: ${email}. Please check simulation logs.`);
  }
}
