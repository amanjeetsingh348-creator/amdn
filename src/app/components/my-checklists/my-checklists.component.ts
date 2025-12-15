import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';

interface ChecklistItem {
    id: number;
    text: string;
    is_done: boolean;
    sort_order: number;
}

interface Checklist {
    id: number;
    name: string;
    created_at: string;
    item_count: number;
    completed_count: number;
    items?: ChecklistItem[];
}

@Component({
    selector: 'app-my-checklists',
    standalone: true,
    imports: [CommonModule, RouterLink, ContentLoaderComponent],
    templateUrl: './my-checklists.component.html',
    styleUrls: ['./my-checklists.component.scss']
})
export class MyChecklistsComponent implements OnInit {
    checklists: Checklist[] = [];
    isLoading = true;

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalItems = 0;
    totalPages = 1;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadChecklists();
    }

    loadChecklists() {
        this.isLoading = true;
        const userId = localStorage.getItem('user_id');

        if (!userId) {
            this.isLoading = false;
            return;
        }

        const url = `${environment.apiUrl}/get_checklists.php?user_id=${userId}&page=${this.currentPage}&limit=${this.itemsPerPage}`;

        this.http.get<any>(url)
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.checklists = res.checklists;

                        if (res.pagination) {
                            this.totalItems = res.pagination.total_items;
                            this.totalPages = res.pagination.total_pages;
                        } else {
                            // Fallback
                            this.totalItems = this.checklists.length;
                            this.totalPages = 1;
                        }
                    }
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error loading checklists:', err);
                    this.isLoading = false;
                }
            });
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadChecklists();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadChecklists();
        }
    }

    onPageSizeChange(event: any) {
        this.itemsPerPage = Number(event.target.value);
        this.currentPage = 1;
        this.loadChecklists();
    }

    getCompletionPercentage(list: Checklist): number {
        if (!list.item_count || list.item_count === 0) return 0;
        return Math.round((list.completed_count / list.item_count) * 100);
    }

    deleteChecklist(id: number) {
        if (!confirm('Are you sure you want to delete this checklist?')) return;

        this.http.post(`${environment.apiUrl}/delete_checklist.php`, { id }) // Assuming this endpoint exists or needs creation
            .subscribe({
                next: () => {
                    this.checklists = this.checklists.filter(c => c.id !== id);
                },
                error: (err) => console.error('Error deleting checklist:', err)
            });
    }
}
