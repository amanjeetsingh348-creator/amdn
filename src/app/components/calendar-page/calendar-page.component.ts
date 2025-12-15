import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { CalendarGridComponent } from './calendar-grid/calendar-grid.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, CalendarHeaderComponent, CalendarGridComponent, RouterModule],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit {
  currentDate: Date = new Date();
  targets: { [key: string]: number } = {};

  // View State
  viewMode: 'daily-total' | 'progress-vs-plan' = 'daily-total';
  timeFilter: 'future' | 'all' = 'all';

  get monthName(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  ngOnInit() {
    this.fetchPlanDays();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.fetchPlanDays();
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.fetchPlanDays();
  }

  setViewMode(mode: 'daily-total' | 'progress-vs-plan') {
    this.viewMode = mode;
    // Logic to update grid view would go here or be handled by passing input to grid
    console.log('View Mode changed to:', mode);
  }

  setTimeFilter(filter: 'future' | 'all') {
    this.timeFilter = filter;
    // Logic to filter dates would go here
    console.log('Time Filter changed to:', filter);
  }

  async fetchPlanDays() {
    const userId = localStorage.getItem('user_id');
    console.log('Fetching calendar data for User ID:', userId);

    if (!userId) {
      console.warn('No User ID found in localStorage');
      return;
    }

    try {
      // Use environment.apiUrl
      const url = `${environment.apiUrl}/get_plan_days.php?user_id=${userId}`;
      console.log('Fetching from:', url);
      const response = await fetch(url);

      if (!response.ok) {
        console.error('Failed to fetch calendar data:', response.status, response.statusText);
        return;
      }

      const result = await response.json();
      console.log('Calendar API Response:', result);

      if (result.success && Array.isArray(result.data)) {
        this.targets = result.data.reduce((acc: any, item: any) => {
          acc[item.date] = parseInt(item.total_target, 10);
          return acc;
        }, {});
        console.log('Processed Targets:', this.targets);
      } else {
        console.warn('Calendar API returned unsuccessful or invalid data:', result);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  }
}
