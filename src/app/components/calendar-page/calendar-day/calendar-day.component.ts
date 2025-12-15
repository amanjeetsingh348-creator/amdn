import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="day-cell" 
         [class.other-month]="!isCurrentMonth" 
         [class.today]="isToday"
         [class.selected]="isSelected">
      <span class="day-number">{{ dayNumber }}</span>
      
      <div class="content-area">
        <div class="target-badge" *ngIf="target > 0">
          {{ target | number }} words
        </div>
      </div>
    </div>
  `,
  styles: [`
    .day-cell {
      background: #fff;
      border-right: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      height: 120px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #fafafa;
      }

      &.other-month {
        background-color: #fcfcfc;
        
        .day-number {
          color: #ccc;
        }
      }

      &.today {
        background-color: #e6f7ff; /* Light blue */
      }

      &.selected {
        background-color: #fffbe6; /* Soft yellow */
      }
    }

    .day-number {
      font-size: 0.85rem;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end; 
      gap: 2px;
    }

    .target-badge {
      font-size: 0.75rem;
      color: #3b82f6;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      border-radius: 4px;
      padding: 2px 6px;
      text-align: center;
      width: 100%;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .day-cell {
        height: 80px;
      }
    }
  `]
})
export class CalendarDayComponent {
  @Input() dayNumber: number = 1;
  @Input() isCurrentMonth: boolean = true;
  @Input() isToday: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() target: number = 0;
}
