import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, take } from 'rxjs';
import { BackUserService } from '../services/backend-helpers/user/back-user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private userService = inject(BackUserService);
  private router = inject(Router);

   canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    return this.userService.currentRoleValid$.pipe(
      take(1),
      map(currentRole => {
        const hasRequiredRole = currentRole && requiredRoles.includes(currentRole);
        
        if (hasRequiredRole) {
          return true;
        }
        
        return this.router.createUrlTree(['/']);
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/']));
      })
    );
  }
}