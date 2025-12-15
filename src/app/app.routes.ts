import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreatePlanComponent } from './components/create-plan/create-plan.component'; // Import CreatePlanComponent
import { PlanEditorComponent } from './components/plan-editor/plan-editor.component';
import { PlanDetailComponent } from './components/plan-detail/plan-detail.component';
import { CommunityComponent } from './components/community/community.component';
import { GroupChallengesComponent } from './components/group-challenges/group-challenges.component';
import { CalendarPageComponent } from './components/calendar-page/calendar-page.component';
import { StatsComponent } from './components/stats/stats.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HomePublicComponent } from './components/home-public/home-public.component';
import { authGuard } from './guards/auth.guard';

import { PlanListComponent } from './components/plan-list/plan-list.component';
import { ChecklistPageComponent } from './components/checklist-page/checklist-page.component';
import { CreateChecklistComponent } from './components/create-checklist/create-checklist.component';
import { OrganizePlansComponent } from './components/organize-plans/organize-plans.component';
import { MyChecklistsComponent } from './components/my-checklists/my-checklists.component';
import { ProfileComponent } from './components/profile/profile.component';

// New Components
import { HelpDocsComponent } from './components/help-docs/help-docs.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { CreditsComponent } from './components/credits/credits.component';
import { HelpComponent } from './components/help/help.component';

import { ChallengeDetailComponent } from './components/challenge-detail/challenge-detail.component';

export const routes: Routes = [
    { path: '', component: HomePublicComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Legal & Support Pages (Public)
    { path: 'privacy', component: PrivacyComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'feedback', component: FeedbackComponent },
    { path: 'credits', component: CreditsComponent },
    { path: 'credits', component: CreditsComponent },
    { path: 'help', component: HelpComponent }, // Switched to user's HelpComponent

    // Protected Routes
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'plans', component: PlanListComponent, canActivate: [authGuard] },
    { path: 'create-plan', component: CreatePlanComponent, canActivate: [authGuard] }, // Updated to use CreatePlanComponent
    { path: 'create-checklist', component: CreateChecklistComponent, canActivate: [authGuard] },
    { path: 'my-checklists', component: MyChecklistsComponent, canActivate: [authGuard] },
    { path: 'plan-editor/:id', component: PlanEditorComponent, canActivate: [authGuard] },
    { path: 'checklist/:id', component: ChecklistPageComponent, canActivate: [authGuard] },
    { path: 'organize', component: OrganizePlansComponent, canActivate: [authGuard] },
    { path: 'plan/:id', component: PlanDetailComponent, canActivate: [authGuard] },
    { path: 'community', component: CommunityComponent, canActivate: [authGuard] },
    { path: 'challenges', component: GroupChallengesComponent, canActivate: [authGuard] },
    { path: 'challenge/:id', component: ChallengeDetailComponent, canActivate: [authGuard] },
    { path: 'calendar', component: CalendarPageComponent, canActivate: [authGuard] },
    { path: 'stats', component: StatsComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];

