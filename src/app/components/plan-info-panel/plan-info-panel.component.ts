import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-plan-info-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './plan-info-panel.component.html',
    styleUrls: ['./plan-info-panel.component.scss']
})
export class PlanInfoPanelComponent {
    title = '';
    totalWords = 0;
    strategy = '';
    startDate: string = '';
    endDate: string = '';
    activity = '';
    content = '';
    description = '';
}
