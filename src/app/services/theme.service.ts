import { Injectable, signal, computed } from '@angular/core';

export type ThemeType = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public activeTheme = signal<ThemeType>('system');

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mineops_theme') as ThemeType;
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        this.activeTheme.set(saved);
      } else {
        this.activeTheme.set('system');
      }
      this.applyTheme();

      // Listen to OS theme changes for full system theme synchronization
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', () => {
        if (this.activeTheme() === 'system') {
          this.applyTheme();
        }
      });
    }
  }

  public setTheme(theme: ThemeType) {
    this.activeTheme.set(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mineops_theme', theme);
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const theme = this.activeTheme();
    let useLight = false;

    if (theme === 'light') {
      useLight = true;
    } else if (theme === 'system') {
      useLight = !window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const body = document.body;
    const html = document.documentElement;
    if (useLight) {
      body.classList.add('light-theme');
      html.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
      html.classList.remove('light-theme');
    }
  }

  public isThemeLight = computed(() => {
    const t = this.activeTheme();
    if (t === 'light') return true;
    if (t === 'dark') return false;
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
}
