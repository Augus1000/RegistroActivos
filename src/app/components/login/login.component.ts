import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup;
  public showLoginError: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    public config: ConfigService,
    private authService: AuthService,
    private route: Router
  ) {
    // Creo el formgroup

    this.formLogin = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', Validators.required)
    })
    this.showLoginError = false;
  }

  ngOnInit() {
  }

  /**
   * Compruebo si el login es correcto
   */
  checkLogin() {

    // Cojo el email y el pass
    let email = this.formLogin.get('email').value
    let pass = this.formLogin.get('pass').value

    // Nos logueamos
    this.authService.login(email, pass).then(state => {

      console.log(state);

      this.route.navigate(['/resume'])

    }, error => {
      console.error(error);
      this.showLoginError = true;
    })

  }

   }


