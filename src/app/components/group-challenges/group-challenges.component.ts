import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

import { ContentLoaderComponent } from '../content-loader/content-loader.component';

@Component({
  selector: 'app-group-challenges',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ContentLoaderComponent],
  templateUrl: './group-challenges.component.html',
  styleUrls: ['./group-challenges.component.scss']
})
export class GroupChallengesComponent implements OnInit {
  showModal = false;
  isSubmitting = false;
  loading = true; // Default to true
  activeChallenges: any[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;

  newChallenge = {
    name: '',
    description: '',
    goal_type: 'word_count',
    goal_amount: 50000,
    start_date: '',
    end_date: '',
    is_public: true
  };

  inviteCodeInput: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadActiveChallenges();
  }

  loadActiveChallenges() {
    this.loading = true;
    const userId = localStorage.getItem('user_id') || '0';

    const url = `${environment.apiUrl}/get_challenges.php?user_id=${userId}&page=${this.currentPage}&limit=${this.itemsPerPage}`;

    this.http.get<any>(url)
      .subscribe({
        next: (response) => {
          this.activeChallenges = response.challenges || [];

          if (response.pagination) {
            this.totalItems = response.pagination.total_items;
            this.totalPages = response.pagination.total_pages;
          } else {
            // Fallback
            this.totalItems = this.activeChallenges.length;
            this.totalPages = 1;
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading challenges:', err);
          this.activeChallenges = [];
          this.loading = false;
        }
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadActiveChallenges();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadActiveChallenges();
    }
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = Number(event.target.value);
    this.currentPage = 1;
    this.loadActiveChallenges();
  }

  openModal() {
    this.showModal = true;
    const today = new Date();
    this.newChallenge.start_date = today.toISOString().split('T')[0];
  }

  closeModal() {
    this.showModal = false;
  }

  joinByCode() {
    if (!this.inviteCodeInput) return;
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Please login.');
      return;
    }

    this.http.post(`${environment.apiUrl}/join_challenge.php`, {
      user_id: userId,
      invite_code: this.inviteCodeInput
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Successfully joined!');
          // Redirect to standard dashboard or specific challenge?
          // If backend returns challenge_id, better. But joinByCode backend currently doesn't return ID explicitly in success message, but uses it.
          // I should update join_challenge.php to return id or just reload.
          // Let's reload for now.
          this.inviteCodeInput = '';
          this.loadActiveChallenges();
        } else {
          alert(res.message);
        }
      },
      error: (err) => alert(err.error?.message || 'Error joining.')
    });
  }

  joinChallenge(challengeId: number) {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Please login to join challenges.');
      return;
    }

    this.http.post(`${environment.apiUrl}/join_challenge.php`, {
      user_id: userId,
      challenge_id: challengeId
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Successfully joined the challenge!');
          // Redirect to detail
          this.router.navigate(['/challenge', challengeId]);
        } else {
          alert('Failed: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Join error:', err);
        alert(err.error?.message || 'Error joining challenge.');
      }
    });
  }

  // ... (modals)

  createChallenge() {
    this.isSubmitting = true;
    if (!this.newChallenge.name || !this.newChallenge.start_date || !this.newChallenge.end_date) {
      alert('Please fill in required fields');
      this.isSubmitting = false;
      return;
    }

    const userId = localStorage.getItem('user_id') || '1';
    const payload = { ...this.newChallenge, creator_id: userId };

    this.http.post(`${environment.apiUrl}/create_challenge.php`, payload)
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res.success) {
            alert('Challenge Created Successfully! ' + (res.invite_code ? 'Invite Code: ' + res.invite_code : ''));
            this.closeModal();
            // Redirect to new dashboard
            this.router.navigate(['/challenge', res.id]);
          }
        },
        error: (err) => {
          // ... (error handling)
          this.isSubmitting = false;
          alert('Error creating challenge.');
        }
      });
  }
}
