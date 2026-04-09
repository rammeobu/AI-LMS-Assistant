export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  is_onboarded: boolean;
  major: string | null;
  status: string | null;
  interest_role: string | null;
  skills: string[] | null;
  updated_at: string;
}

export type UserUpdateInput = Partial<Omit<UserProfile, 'id' | 'email' | 'updated_at'>>;
