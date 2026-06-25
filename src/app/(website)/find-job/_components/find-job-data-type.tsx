// src/components/find-job-data-type.ts
export interface ScheduleTypes {
  day: string[];
  time: string[];
}

// For API format
export interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
  time?: string;
}

// For internal state with selection
export interface ScheduleItem {
  day: string;
  selected: boolean;
  startTime: string;
  endTime: string;
  time: string;
}

export interface FindJobDataTypes {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: string;
  categoryId: string;
  subscriptionId?: string;
  country: string;
  city: string;
  gender: string;
  hourRate: number;
  days: ScheduleTypes;
  termsAccepted?: boolean;
}
