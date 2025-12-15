import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Plan {
    id: number;
    plan_name: string;
    goal_amount: number;
    current_progress: number;
    progress_percentage: number;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isCollapsed = false;
    isProgressExpanded = false; // Track if Latest Progress is expanded
    activePlans: Plan[] = []; // Store active plans
    activePlansCount = 0; // Count of active plans
    activeChallengesCount = 0; // Count of active challenges
    totalProjectsCount = 0; // Count of total organization plans

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkScreenSize();
    }

    constructor(private router: Router, private http: HttpClient) {
        this.checkScreenSize();
    }

    ngOnInit() {
        this.loadActivePlans();
        this.loadActiveChallenges();
        this.loadTotalPlans();
    }

    // Load active plans from API
    loadActivePlans() {
        const userId = localStorage.getItem('user_id') || '1'; // Default to 1 if not found for testing
        // if (!userId) return; // Allow default to 1 so something shows up

        this.http.get<any>(`${environment.apiUrl}/get_plans.php?user_id=${userId}`)
            .subscribe({
                next: (response) => {
                    // Response is { records: [...] }
                    const plans = response.records || [];

                    // Filter active plans and calculate progress
                    this.activePlans = plans
                        .filter((plan: any) => plan.status === 'In Progress' || !plan.status) // API returns 'In Progress' or 'Ended'
                        .map((plan: any) => ({
                            id: plan.id,
                            plan_name: plan.plan_name,
                            goal_amount: plan.goal_amount || 0,
                            current_progress: plan.completed_amount || 0,
                            progress_percentage: this.calculateProgress(
                                plan.completed_amount || 0,
                                plan.goal_amount || 0
                            )
                        }))
                        .slice(0, 5); // Limit to 5 most recent

                    this.activePlansCount = this.activePlans.length;
                },
                error: (err) => {
                    console.error('Error loading active plans:', err);
                    this.activePlansCount = 0;
                }
            });
    }

    loadActiveChallenges() {
        const userId = localStorage.getItem('user_id') || '0';
        this.http.get<any>(`${environment.apiUrl}/get_challenges.php?user_id=${userId}`)
            .subscribe({
                next: (response) => {
                    if (response.success && response.challenges) {
                        this.activeChallengesCount = response.challenges.length;
                    }
                },
                error: (err) => {
                    console.error('Error loading active challenges count:', err);
                }
            });
    }

    loadTotalPlans() {
        const userId = localStorage.getItem('user_id') || '1';
        // We set limit=1 just to get the pagination metadata which contains 'total_items'
        this.http.get<any>(`${environment.apiUrl}/get_projects.php?user_id=${userId}&limit=1`)
            .subscribe({
                next: (res) => {
                    if (res.pagination) {
                        this.totalProjectsCount = res.pagination.total_items;
                    } else if (res.records) {
                        // Fallback if pagination missing for some reason
                        this.totalProjectsCount = res.records.length;
                    }
                },
                error: (err) => console.error('Error loading projects count', err)
            });
    }

    // Calculate progress percentage
    calculateProgress(current: number, goal: number): number {
        if (!goal || goal === 0) return 0;
        return Math.min(Math.round((current / goal) * 100), 100);
    }

    // Toggle Latest Progress expansion
    toggleProgressSection() {
        this.isProgressExpanded = !this.isProgressExpanded;
    }

    checkScreenSize() {
        if (typeof window !== 'undefined') {
            // On mobile, default to collapsed (hidden)
            if (window.innerWidth < 768) {
                this.isCollapsed = true;
            } else {
                this.isCollapsed = false;
            }
        }
    }

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
    }

    // Close sidebar on mobile when nav item is clicked
    onNavItemClick() {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            this.isCollapsed = true;
        }
    }

    logout() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
    }
}
