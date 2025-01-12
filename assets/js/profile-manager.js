class ProfileManager {
    static async updateProfile(profileData) {
        try {
            const response = await fetch('/api/students/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    static async loadProfile(studentId) {
        try {
            const response = await fetch(`/api/students/${studentId}`);
            return await response.json();
        } catch (error) {
            console.error('Error loading profile:', error);
            throw error;
        }
    }
} 