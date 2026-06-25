import { FindJobDataTypes } from "@/app/(website)/find-job/_components/find-job-data-type"


export const STORAGE_KEY = 'service_register_form'

export const loadForm = (): FindJobDataTypes | null => {
  if (typeof window === 'undefined') return null

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as FindJobDataTypes) : null
  } catch (error) {
    console.error('Failed to load form from storage:', error)
    return null
  }
}

export const saveForm = (data: FindJobDataTypes): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save form to storage:', error)
  }
}

export const clearForm = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}











// export const STORAGE_KEY = 'service_register_form'

// export const loadForm = () => {
//   if (typeof window === 'undefined') return null
//   const saved = localStorage.getItem(STORAGE_KEY)
//   return saved ? JSON.parse(saved) : null
// }

// export const saveForm = (data: any) => {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
// }

// export const clearForm = () => {
//   localStorage.removeItem(STORAGE_KEY)
// }


