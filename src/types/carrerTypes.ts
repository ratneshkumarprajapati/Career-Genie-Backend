// types.ts
export interface CareerTimeTravelRequest {
  currentRole: string;
  experienceYears: number;
  location: string;
  timelineSteps: {
    yearOffset: number;
    goal: string; // e.g., "Learn Backend", "Do Master's", "Become PM"
  }[];
}

export interface TimeTravelNode {
  title: string;
  yearOffset: number;
  description: string;
  skillsRequired: string[];
  estimatedSalary: string;
  transitionReason: string;
}

export interface TimeTravelResponse {
  startingPoint: string;
  steps: TimeTravelNode[];
}

export interface CareerFinderRequest {
    educationLevel: string;
    skills: string[];
    interests: string[];
    preferredIndustries: string[];
    location: string;
    workStyle: string;
    experienceYears: number;
}