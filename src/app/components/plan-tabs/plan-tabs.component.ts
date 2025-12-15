import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-plan-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './plan-tabs.component.html',
    styleUrls: ['./plan-tabs.component.scss']
})
export class PlanTabsComponent {
    tabs = ['Overview', 'Details', 'Settings'];
    activeTab = 'Overview';

    selectTab(tab: string) {
        this.activeTab = tab;
    }
}
