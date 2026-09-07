import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth-service";

export function createCredentialsFormGroup(authService: AuthService): FormGroup {
    return new FormGroup({
        userName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, authService.passwordMatchValidator('password')])
    });
}