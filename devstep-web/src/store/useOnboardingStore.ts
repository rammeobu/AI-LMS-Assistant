import { create } from 'zustand'

interface OnboardingState {
  step: number
  formData: {
    name: string
    region: string
    skills: string[]
  }
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setFormData: (data: Partial<OnboardingState['formData']>) => void
  toggleSkill: (skill: string) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  formData: {
    name: '',
    region: '',
    skills: [],
  },
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  toggleSkill: (skill) => set((state) => ({
    formData: {
      ...state.formData,
      skills: state.formData.skills.includes(skill)
        ? state.formData.skills.filter((s) => s !== skill)
        : [...state.formData.skills, skill],
    },
  })),
  reset: () => set({
    step: 1,
    formData: {
      name: '',
      region: '',
      skills: [],
    },
  }),
}))
