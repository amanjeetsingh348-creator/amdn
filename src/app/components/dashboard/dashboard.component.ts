import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  plans: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    let userId = localStorage.getItem('user_id');
    const userType = localStorage.getItem('user_type');

    if (!userId || userId === 'guest') {
      // Default to user 2 for testing/demo purposes if no user logged in
      userId = '2';
    }

    this.http.get<any>(`${environment.apiUrl}/get_plans.php?user_id=${userId}`)
      .subscribe({
        next: (res) => {
          this.plans = res.records || [];
        },
        error: (err) => console.error(err)
      });
  }
}
