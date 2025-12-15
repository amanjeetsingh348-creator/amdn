import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';

@Component({
    selector: 'app-challenge-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ContentLoaderComponent],
    templateUrl: './challenge-detail.component.html',
    styleUrls: ['./challenge-detail.component.scss']
})
export class ChallengeDetailComponent implements OnInit {
    challenge: any = null;
    participants: any[] = [];
    userLogs: any[] = [];
    userProgress = 0;
    isLoading = true;
    todayWords: number | null = null;
    currentUserId: any;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router
    ) { }

    ngOnInit() {
        this.currentUserId = localStorage.getItem('user_id');
        if (!this.currentUserId) {
            this.router.navigate(['/login']);
            return;
        }

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadChallengeDetails(id);
            }
        });
    }

    loadChallengeDetails(id: string) {
        this.isLoading = true;
        this.http.get<any>(`${environment.apiUrl}/get_challenge_details.php?id=${id}&user_id=${this.currentUserId}`)
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.challenge = res.challenge;
                        this.participants = res.participants;
                        this.userLogs = res.userLogs;
                        this.userProgress = res.user_progress;
                    }
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                    alert('Failed to load challenge details.');
                }
            });
    }

    addProgress() {
        if (!this.todayWords || this.todayWords <= 0) return;

        const payload = {
            challenge_id: this.challenge.id,
            user_id: this.currentUserId,
            word_count: this.todayWords,
            date: new Date().toISOString().split('T')[0]
        };

        this.http.post<any>(`${environment.apiUrl}/add_challenge_progress.php`, payload)
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        alert('Progress added successfully!');
                        this.todayWords = null;
                        // Reload data to reflect changes
                        this.loadChallengeDetails(this.challenge.id);
                        // Also update user progress locally to see immediate effect if needed
                        this.userProgress = res.new_total || this.userProgress + payload.word_count;
                    } else {
                        alert('Failed to update progress: ' + (res.message || 'Unknown error'));
                    }
                },
                error: (err) => {
                    console.error(err);
                    alert('Error updating progress.');
                }
            });
    }

    getPercent(current: number, total: number): number {
        if (!total || total === 0) return 0;
        const pct = Math.round((current / total) * 100);
        return pct > 100 ? 100 : pct;
    }

    copyCode() {
        if (this.challenge && this.challenge.invite_code) {
            navigator.clipboard.writeText(this.challenge.invite_code).then(() => {
                alert('Invite code copied to clipboard!');
            });
        }
    }
}
