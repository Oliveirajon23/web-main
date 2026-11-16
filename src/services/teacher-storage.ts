export interface ScheduleItem {
  week_day: string
  from: string
  to: string
}

export interface TeacherProfileData {
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  whatsapp: string
  biography: string
  subject: string
  cost: number
  schedule: ScheduleItem[]
}

const STORAGE_KEY = "@proffy:teacher-profile-2026"

const DEFAULT_TEACHER: TeacherProfileData = {
  firstName: "Tiago",
  lastName: "Luchtenberg",
  email: "tiagoluchtenberg@gmail.com",
  avatarUrl: "https://avatars.githubusercontent.com/u/15871684?v=4",
  whatsapp: "",
  biography: "",
  subject: "",
  cost: 20,
  schedule: [{ week_day: "", from: "", to: "" }],
}

export function getTeacherProfile(): TeacherProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TEACHER
    return { ...DEFAULT_TEACHER, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_TEACHER
  }
}

export function saveTeacherProfile(data: Partial<TeacherProfileData>): void {
  const current = getTeacherProfile()
  const updated = { ...current, ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}