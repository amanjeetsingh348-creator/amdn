import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ContentLoaderComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    isLoading = true;
    isEditing = false;
    isSaving = false;

    // User data
    user = {
        id: '',
        username: '',
        email: '',
        bio: '',
        created_at: '',
        initials: ''
    };

    // Edit form
    editForm = {
        username: '',
        email: '',
        bio: ''
    };

    errorMessage = '';
    successMessage = '';

    // Stats
    totalPlans = 0;
    totalWords = 0;
    memberSince = '';

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() {
        this.loadUserProfile();
        this.loadUserStats();
    }

    loadUserProfile() {
        this.isLoading = true;
        const userId = localStorage.getItem('user_id');

        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        this.http.get<any>(`${environment.apiUrl}/get_user.php?user_id=${userId}`)
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    if (response.success && response.data) {
                        this.user = {
                            id: response.data.id,
                            username: response.data.username,
                            email: response.data.email,
                            bio: response.data.bio || '',
                            created_at: response.data.created_at,
                            initials: this.getInitials(response.data.username)
                        };
                        this.memberSince = this.formatMemberSince(response.data.created_at);
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.errorMessage = 'Failed to load profile';
                }
            });
    }

    loadUserStats() {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        // Load plans to get total count and aggregate total words
        this.http.get<any>(`${environment.apiUrl}/get_plans.php?user_id=${userId}`)
            .subscribe({
                next: (res) => {
                    const plans = res.records || [];
                    this.totalPlans = plans.length;

                    // Calculate total words logged across all plans
                    // get_plans.php returns 'completed_amount' for each plan
                    this.totalWords = plans.reduce((acc: number, plan: any) => {
                        return acc + (Number(plan.completed_amount) || 0);
                    }, 0);
                },
                error: (err) => {
                    console.error('Error loading stats', err);
                    this.totalPlans = 0;
                    this.totalWords = 0;
                }
            });
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    formatMemberSince(date: string): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    startEditing() {
        this.isEditing = true;
        this.editForm = {
            username: this.user.username,
            email: this.user.email,
            bio: this.user.bio
        };
        this.errorMessage = '';
        this.successMessage = '';
    }

    cancelEditing() {
        this.isEditing = false;
        this.errorMessage = '';
        this.successMessage = '';
    }

    saveProfile() {
        this.errorMessage = '';
        this.successMessage = '';

        // Validation
        if (!this.editForm.username.trim()) {
            this.errorMessage = 'Username is required';
            return;
        }

        if (!this.editForm.email.trim()) {
            this.errorMessage = 'Email is required';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.editForm.email)) {
            this.errorMessage = 'Please enter a valid email address';
            return;
        }

        this.isSaving = true;

        const payload = {
            user_id: this.user.id,
            username: this.editForm.username,
            email: this.editForm.email,
            bio: this.editForm.bio
        };

        this.http.post(`${environment.apiUrl}/update_profile.php`, payload)
            .subscribe({
                next: (res: any) => {
                    this.isSaving = false;
                    if (res.success) {
                        this.user.username = res.user.username;
                        this.user.email = res.user.email;
                        this.user.bio = res.user.bio;
                        this.user.initials = this.getInitials(res.user.username);

                        // Update localStorage
                        localStorage.setItem('username', res.user.username);
                        localStorage.setItem('email', res.user.email);

                        this.successMessage = 'Profile updated successfully!';
                        this.isEditing = false;
                    } else {
                        this.errorMessage = res.error || 'Failed to update profile';
                    }
                },
                error: (err) => {
                    this.isSaving = false;
                    this.errorMessage = err.error?.error || 'An error occurred';
                }
            });
    }

    goToSettings() {
        this.router.navigate(['/settings']);
    }
}
