import { UserProfile } from './UserProfile';

export default class UserProfileManager {
    private static profileData: UserProfile | null = null;
    private static profileSource: 'cache' | 'server' | null = null;


    static setProfileData(data: UserProfile, source: 'cache' | 'server' = 'server'): void {
        this.profileData = data;
        this.profileSource = source;
    }

    static getProfileData(): UserProfile | null {
        return this.profileData;
    }

    static getProfileSource(): 'cache' | 'server' | null {
        return this.profileSource;
    }

    static isProfileTrusted(): boolean {
        return this.profileSource === 'server';
    }
}
