import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
    const router = inject(Router);
    const userId = localStorage.getItem('user_id');

    if (userId) {
        return true;
    }

    return router.parseUrl('/login');
};
