import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-header">
      <button class="nav-btn prev" (click)="prev.emit()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      
      <h2 class="month-title">{{ monthName }}</h2>
      
      <button class="nav-btn next" (click)="next.emit()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  `,
  styles: [`
    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 32px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
    }

    .month-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 24px;
      letter-spacing: -0.5px;
    }

    .nav-btn {
      background: transparent;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #666;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f9f9f9;
        border-color: #d0d0d0;
        color: #333;
      }
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  `]
})
export class CalendarHeaderComponent {
  @Input() monthName: string = '';
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
}
