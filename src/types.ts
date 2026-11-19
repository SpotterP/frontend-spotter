export type UserRole = 'ADMIN' | 'USER';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface Exercise {
  _id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface WorkoutExercise {
  exercise: Exercise | string;
  sets: number;
  reps: number;
}

export interface Workout {
  _id: string;
  name: string;
  description?: string;
  days: DayOfWeek[];
  exercises: WorkoutExercise[];
}
