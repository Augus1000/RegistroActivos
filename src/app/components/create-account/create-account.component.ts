import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { confirmPassword } from '../../validators/validators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  public formCreateAccount: FormGroup;
  public showCreateUserError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) {
    // Creo el formgroup
    this.formCreateAccount = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', Validators.required),
      confirmPass: new FormControl('', Validators.required)
    })
    // Añado el validador de confirmar password al formgroup
    this.formCreateAccount.setValidators(confirmPassword);

    this.showCreateUserError = false;

  }

  /**
   * Obtiene el formcontrol de email
   */
  get email(){
    return this.formCreateAccount.get('email')
  }

  
  /**
   * Obtiene el formcontrol de pass
   */
  get pass(){
    return this.formCreateAccount.get('pass')
  }

  /**
   * Obtiene el formcontrol de confirmPass
   */
  get confirmPass(){
    return this.formCreateAccount.get('confirmPass')
  }

  ngOnInit() {
  }

  addUser() {

    // Recojo email y pass
    let email = this.formCreateAccount.get('email').value
    let pass = this.formCreateAccount.get('pass').value

    // Creo una nueva cuenta
    this.authService.createAccount(email, pass).then(state => {
      console.log(state);
      // Redirijo a resume
      this.route.navigate(['/resume'])
    }).catch(error => {
      console.error(error);
      this.showCreateUserError = true;

    })

  }

}
