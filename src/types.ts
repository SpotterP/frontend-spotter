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

export interface Workout {
  _id: string;
  name: string;
  description?: string;
  dayOfWeek: DayOfWeek;
  // En el listado llegan como ids; en el detalle, completos.
  exercises: Array<string | Exercise>;
}

export interface PageInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface WorkoutsPage {
  workouts: Workout[];
  pagination: PageInfo;
}
