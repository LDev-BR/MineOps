import { Injectable, signal, computed } from '@angular/core';

export interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  role: 'Superintendent' | 'Operations Manager' | 'Maintenance Supervisor' | 'Safety Auditor';
  avatarUrl: string;
  lastLogin: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<UserProfile | null>(null);
  
  public currentUser = computed(() => this.currentUserSignal());
  public isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor() {
    // Check if user is stored in localStorage (mocking Remember Me feature)
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('mineops_user');
      if (savedUser) {
        try {
          this.currentUserSignal.set(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('mineops_user');
        }
      } else {
        // Auto-login with default corporate user for demo convenience so the user doesn't hit a wall!
        // This is excellent for UX design so the prototype greets them immediately or lets them log in easily.
        this.loginSilently();
      }
    }
  }

  public loginSilently() {
    const demoUser: UserProfile = {
      username: 'luis.tavares',
      email: 'luistavares235@gmail.com',
      fullName: 'Luis Tavares',
      role: 'Operations Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
      lastLogin: new Date().toISOString()
    };
    this.currentUserSignal.set(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mineops_user', JSON.stringify(demoUser));
    }
  }

  public login(email: string, password: string, rememberMe: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Let's allow any corporate login for the mock prototype
        const baseUsername = email.split('@')[0];
        const fullName = baseUsername
          .split('.')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || 'Operational Superintendent';

        const user: UserProfile = {
          username: baseUsername,
          email: email,
          fullName: fullName,
          role: email.includes('admin') || email.includes('super') ? 'Superintendent' : 'Operations Manager',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          lastLogin: new Date().toISOString()
        };

        this.currentUserSignal.set(user);
        
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem('mineops_user', JSON.stringify(user));
        }

        resolve(true);
      }, 800); // Simulate network latency of authentication
    });
  }

  public updateProfile(fullName: string, email: string, role: 'Superintendent' | 'Operations Manager' | 'Maintenance Supervisor' | 'Safety Auditor') {
    const current = this.currentUserSignal();
    if (current) {
      const updated = { ...current, fullName, email, role };
      this.currentUserSignal.set(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mineops_user', JSON.stringify(updated));
      }
    }
  }

  public logout() {
    this.currentUserSignal.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mineops_user');
    }
  }
}
