import { Injectable, signal, WritableSignal } from '@angular/core';

export interface IToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);

  show(type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string, duration: number = 3000): void {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const toast: IToast = { id, type, message, title, duration };
    this.toasts.update(current => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title?: string, duration: number = 3000): void {
    this.show('success', message, title, duration);
  }

  error(message: string, title?: string, duration: number = 4000): void {
    this.show('error', message, title, duration);
  }

  info(message: string, title?: string, duration: number = 3000): void {
    this.show('info', message, title, duration);
  }

  warning(message: string, title?: string, duration: number = 3500): void {
    this.show('warning', message, title, duration);
  }

  remove(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}

