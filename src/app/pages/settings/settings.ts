import { Component, inject, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { TranslationService, LangType } from '../../services/translation.service';
import { ThemeService, ThemeType } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <!-- Top Command Block -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2 uppercase">
          <mat-icon class="text-amber-500">settings</mat-icon> {{ t()('TITLE', 'settings') }}
        </h1>
        <p class="text-xs text-slate-400 mt-1 font-mono tracking-wider">
          {{ t()('SUBTITLE', 'settings') }}
        </p>
      </div>
    </div>

    @if (showSuccess()) {
      <div id="success-banner" class="bg-emerald-950/20 border-l-4 border-emerald-600 rounded-r p-4 flex items-start gap-3 shadow-inner">
        <mat-icon class="text-emerald-500">check_circle</mat-icon>
        <div>
          <h4 class="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">{{ t()('SAVE_SUCCESS', 'settings') }}</h4>
        </div>
      </div>
    }

    <!-- Settings Forms Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Profile Card -->
      <div id="profile-card" class="bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
        <div class="border-b border-slate-800 pb-3 flex items-center gap-2 text-slate-350">
          <mat-icon class="text-sm">account_circle</mat-icon>
          <h3 class="text-sm font-bold font-mono text-slate-200 tracking-wider uppercase">{{ t()('PROFILE_SECTION', 'settings') }}</h3>
        </div>
        
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="flex flex-col gap-4">
          <!-- Full Name -->
          <div class="flex flex-col gap-1.5">
            <label for="fullname" class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
              {{ t()('FULL_NAME', 'settings') }} <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input id="fullname" type="text" formControlName="fullName"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-sans transition">
              <mat-icon class="absolute left-3.5 top-3 text-slate-500 text-sm">badge</mat-icon>
            </div>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
              {{ t()('EMAIL_ADDRESS', 'settings') }} <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input id="email" type="email" formControlName="email"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-sans transition">
              <mat-icon class="absolute left-3.5 top-3 text-slate-500 text-sm">email</mat-icon>
            </div>
          </div>

          <!-- Corporate Role -->
          <div class="flex flex-col gap-1.5">
            <label for="role" class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
              {{ t()('ROLE_LBL', 'settings') }}
            </label>
            <div class="relative">
              <select id="role" formControlName="role"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 appearance-none focus:outline-none focus:border-amber-500 font-mono transition">
                <option value="Superintendent">Superintendent</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Maintenance Supervisor">Maintenance Supervisor</option>
                <option value="Safety Auditor">Safety Auditor</option>
              </select>
              <mat-icon class="absolute left-3.5 top-3 text-slate-500 text-sm">shield</mat-icon>
              <mat-icon class="absolute right-3.5 top-3 text-slate-500 text-sm pointer-events-none">arrow_drop_down</mat-icon>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end mt-2">
            <button type="submit" [disabled]="profileForm.invalid"
              class="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 text-xs font-mono font-bold px-4 py-2.5 rounded-lg transition uppercase flex items-center gap-1.5">
              <mat-icon class="text-sm">save_as</mat-icon>
              {{ t()('SAVE_CONFIG', 'common') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Theme & Language Card -->
      <div id="locale-card" class="bg-slate-850 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-6">
        
        <!-- Language Block -->
        <div class="flex flex-col gap-3">
          <div class="border-b border-slate-800 pb-3 flex items-center gap-2 text-slate-350">
            <mat-icon class="text-sm">translate</mat-icon>
            <h3 class="text-sm font-bold font-mono text-slate-200 tracking-wider uppercase">{{ t()('LOCALE_SECTION', 'settings') }}</h3>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="locale-select" class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
              {{ t()('LANG_LBL', 'settings') }}
            </label>
            <div class="relative">
              <select id="locale-select" [formControl]="langControl"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 appearance-none focus:outline-none focus:border-amber-500 font-mono transition">
                <option value="en-US">{{ t()('ENGLISH', 'settings') }}</option>
                <option value="pt-BR">{{ t()('PORTUGUESE', 'settings') }}</option>
              </select>
              <mat-icon class="absolute left-3.5 top-3 text-slate-500 text-sm">language</mat-icon>
              <mat-icon class="absolute right-3.5 top-3 text-slate-500 text-sm pointer-events-none">arrow_drop_down</mat-icon>
            </div>
          </div>
        </div>

        <!-- Theme Selection Block -->
        <div class="flex flex-col gap-3">
          <div class="border-b border-slate-800 pb-3 flex items-center gap-2 text-slate-350">
            <mat-icon class="text-sm">palette</mat-icon>
            <h3 class="text-sm font-bold font-mono text-slate-200 tracking-wider uppercase">{{ t()('THEME_SECTION', 'settings') }}</h3>
          </div>
          <p class="text-[11px] text-slate-400 font-mono">
            {{ t()('THEME_DESC', 'settings') }}
          </p>

          <div class="grid grid-cols-3 gap-3">
            <button (click)="selectTheme('dark')" type="button"
              class="p-3 rounded-lg border flex flex-col items-center gap-1.5 transition text-center cursor-pointer"
              [ngClass]="activeTheme() === 'dark' ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' : 'border-slate-700 hover:border-slate-500 bg-slate-900 text-slate-300'">
              <mat-icon class="text-base">dark_mode</mat-icon>
              <span class="text-[10px] font-mono tracking-wider font-bold">{{ t()('DARK', 'common') }}</span>
            </button>

            <button (click)="selectTheme('light')" type="button"
              class="p-3 rounded-lg border flex flex-col items-center gap-1.5 transition text-center cursor-pointer"
              [ngClass]="activeTheme() === 'light' ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' : 'border-slate-700 hover:border-slate-500 bg-slate-900 text-slate-300'">
              <mat-icon class="text-base">light_mode</mat-icon>
              <span class="text-[10px] font-mono tracking-wider font-bold">{{ t()('LIGHT', 'common') }}</span>
            </button>

            <button (click)="selectTheme('system')" type="button"
              class="p-3 rounded-lg border flex flex-col items-center gap-1.5 transition text-center cursor-pointer"
              [ngClass]="activeTheme() === 'system' ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' : 'border-slate-700 hover:border-slate-500 bg-slate-900 text-slate-300'">
              <mat-icon class="text-base">settings_brightness</mat-icon>
              <span class="text-[10px] font-mono tracking-wider font-bold">{{ t()('SYSTEM', 'common') }}</span>
            </button>
          </div>
        </div>

        <!-- Reset Block -->
        <div class="flex justify-end pt-3 border-t border-slate-800">
          <button (click)="resetToDefaults()"
            class="bg-rose-900/50 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded transition uppercase flex items-center gap-1">
            <mat-icon class="text-xs">restore</mat-icon>
            {{ t()('RESET_BTN', 'settings') }}
          </button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
    }
  `]
})
export class SettingsPage {
  private authService = inject(AuthService);
  private transService = inject(TranslationService);
  private themeService = inject(ThemeService);

  public user = computed(() => this.authService.currentUser());
  public t = computed(() => this.transService.translate());
  
  public showSuccess = signal<boolean>(false);
  
  public profileForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    role: new FormControl<'Superintendent' | 'Operations Manager' | 'Maintenance Supervisor' | 'Safety Auditor'>('Operations Manager', { nonNullable: true })
  });

  public langControl = new FormControl<LangType>('en-US', { nonNullable: true });

  public activeTheme = computed(() => this.themeService.activeTheme());

  constructor() {
    this.syncFormWithUser();
    
    // Set initial lang controller
    this.langControl.setValue(this.transService.activeLang());
    
    // Listen for language alterations
    this.langControl.valueChanges.subscribe(lang => {
      this.transService.setLanguage(lang);
      this.triggerSuccess();
    });
  }

  private syncFormWithUser() {
    const u = this.user();
    if (u) {
      this.profileForm.patchValue({
        fullName: u.fullName,
        email: u.email,
        role: u.role
      });
    }
  }

  public saveProfile() {
    if (this.profileForm.valid) {
      const vals = this.profileForm.getRawValue();
      this.authService.updateProfile(vals.fullName, vals.email, vals.role);
      this.triggerSuccess();
    }
  }

  public selectTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
    this.triggerSuccess();
  }

  public resetToDefaults() {
    this.authService.updateProfile('Luis Tavares', 'luistavares235@gmail.com', 'Operations Manager');
    this.themeService.setTheme('system');
    
    const sysLang = (typeof navigator !== 'undefined' && navigator.language.startsWith('pt')) ? 'pt-BR' : 'en-US';
    this.langControl.setValue(sysLang);
    this.transService.setLanguage(sysLang);
    this.syncFormWithUser();
    this.triggerSuccess();
  }

  private triggerSuccess() {
    this.showSuccess.set(true);
    setTimeout(() => {
      this.showSuccess.set(false);
    }, 4000);
  }
}
