import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private route: Router
  ) { }

  canActivate() {

    // Si estoy logueado, vuelvo al resumen
    if (this.authService.isAuthenticated()) {
      console.log("Estas logueado");
      this.route.navigate(['/resume'])
      return false;
    }

    return true;
  }

}
