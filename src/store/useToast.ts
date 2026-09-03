import { create } from 'zustand'

export type ToastType = 'success' | 'warning' | 'error'

export interface Toast {
  id: string
  type: ToastType
  title: string
  sub?: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (type: ToastType, title: string, sub?: string) => void
  removeToast: (id: string) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, title, sub) => {
    const id = Date.now().toString()
    set(state => ({
      toasts: [...state.toasts, { id, type, title, sub }].slice(-3) // Max 3 toasts
    }))
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, 3000)
  },
  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  }))
}))
