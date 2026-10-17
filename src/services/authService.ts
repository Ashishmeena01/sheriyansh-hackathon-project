/**
 * Auth service stub - reserved for teammate's backend authentication.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

export const authService = {
  getCurrentUser(): UserProfile {
    // Current role defaults or local session storage for hackathon demo
    const saved = localStorage.getItem('proctorvision_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      id: 'teacher-1',
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@university.edu',
      role: 'teacher'
    };
  },

  setCurrentRole(role: 'teacher' | 'student', name?: string): UserProfile {
    const user: UserProfile = {
      id: role === 'teacher' ? 'teacher-1' : 'std-demo-1',
      name: name || (role === 'teacher' ? 'Dr. Sarah Jenkins' : 'Jordan Lee'),
      email: role === 'teacher' ? 's.jenkins@university.edu' : 'jordan.lee@university.edu',
      role
    };
    localStorage.setItem('proctorvision_current_user', JSON.stringify(user));
    return user;
  }
};
