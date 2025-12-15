import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';

@Component({
  selector: 'app-organize-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ContentLoaderComponent],
  templateUrl: './organize-plans.component.html',
  styleUrls: ['./organize-plans.component.scss']
})
export class OrganizePlansComponent implements OnInit {
  projects: any[] = [];
  showModal = false;
  isSubmitting = false;
  isLoading = true;
  newProjectName = '';

  selectedProject: any = null; // For editing
  modalMode: 'create' | 'edit' = 'create';

  shareEmail = '';
  isSharing = false;

  // Pagination State
  currentPage = 1;
  itemsPerPage = 9; // Display 9 items per page (3x3 grid)
  totalItems = 0;
  totalPages = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(page: number = 1) {
    this.currentPage = page;
    this.isLoading = true;
    const userId = localStorage.getItem('user_id') || '1';

    const url = `${environment.apiUrl}/get_projects.php?user_id=${userId}&page=${this.currentPage}&limit=${this.itemsPerPage}`;

    this.http.get<any>(url)
      .subscribe({
        next: (res) => {
          this.projects = res.records || [];
          if (res.pagination) {
            this.totalItems = res.pagination.total_items;
            this.totalPages = res.pagination.total_pages;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadProjects(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadProjects(this.currentPage - 1);
    }
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  closeModal() {
    this.showModal = false;
    this.selectedProject = null;
  }

  saveProject() {
    if (this.modalMode === 'create') {
      this.createProject();
    } else {
      this.updateProject();
    }
  }

  createProject() {
    if (!this.newProjectName.trim()) return;
    this.isSubmitting = true;

    const userId = localStorage.getItem('user_id') || '1';
    const payload = {
      name: this.newProjectName,
      user_id: userId
    };

    this.http.post(`${environment.apiUrl}/create_project.php`, payload)
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res.success) {
            this.loadProjects();
            this.closeModal();
          } else {
            alert('Error: ' + res.message);
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error(err);
          const msg = err.error?.message || err.error?.error || err.statusText || 'Unknown error';
          alert('Failed to create project: ' + msg);

          if (msg.includes('Invalid User ID')) {
            localStorage.clear();
            window.location.href = '/login';
          }
        }
      });
  }

  updateProject() {
    if (!this.selectedProject || !this.newProjectName.trim()) return;
    this.isSubmitting = true;

    const payload = {
      id: this.selectedProject.id,
      name: this.newProjectName,
      description: this.selectedProject.description || ''
    };

    this.http.post(`${environment.apiUrl}/update_project.php`, payload)
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res.success) {
            this.loadProjects();
            this.closeModal();
          } else {
            alert('Error calling update: ' + (res.error || res.message));
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error(err);
          alert('Failed to update project');
        }
      });
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedProject = null;
    this.newProjectName = '';
    this.shareEmail = '';
    this.showModal = true;
  }

  openEditModal(project: any) {
    this.modalMode = 'edit';
    this.selectedProject = project;
    this.newProjectName = project.name;
    this.shareEmail = '';
    this.showModal = true;
  }

  shareProject() {
    if (!this.selectedProject || !this.shareEmail) return;
    this.isSharing = true;

    this.http.post(`${environment.apiUrl}/share_project.php`, {
      project_id: this.selectedProject.id,
      email: this.shareEmail
    }).subscribe({
      next: (res: any) => {
        this.isSharing = false;
        if (res.success) {
          alert(res.message);
          this.shareEmail = '';
        } else {
          alert(res.message || 'Failed to share');
        }
      },
      error: (err) => {
        this.isSharing = false;
        alert(err.error?.error || 'Error sharing project');
      }
    });
  }

  // ... existing deleteProject etc ...

  deleteProject() {
    if (!this.selectedProject) return;
    if (this.selectedProject.role !== 'owner') {
      alert('only the owner can delete this project.');
      return;
    }
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.http.post(`${environment.apiUrl}/delete_project.php`, { id: this.selectedProject.id })
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.loadProjects();
            this.closeModal();
          }
        },
        error: (err) => console.error(err)
      });
  }

  createExampleProjects() {
    const examples = ['My First Trilogy', 'Blog Series 2025', 'Sci-Fi Short Stories'];
    const userId = localStorage.getItem('user_id') || '1';

    let completed = 0;
    examples.forEach(name => {
      this.http.post(`${environment.apiUrl}/create_project.php`, { name, user_id: userId })
        .subscribe(() => {
          completed++;
          if (completed === examples.length) this.loadProjects();
        });
    });
  }
}
