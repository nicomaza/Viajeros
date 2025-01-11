import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, Routes } from '@angular/router';
import { UserService } from '../services/user.service';
import { passwordValidator } from '../validators/password.validator';
import { NewUserDto } from '../models/NewUserDto';
import Swal from 'sweetalert2';
import { RegisterComprobationDto } from '../models/RegisterComprobationDto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  terms:boolean = false;
  registerForm: FormGroup;
  NewUserDto = new NewUserDto();
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
      passwordConfirm: ['', [Validators.required]],
      phone: ['', Validators.required]
    });
  }

  checkPasswords() {
    const password = this.registerForm.get('password')?.value;
    const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;
    return password === passwordConfirm;
  }

  /*loadNewUser() {
    if (!this.checkPasswords()) {
      console.error('Las contraseñas no coinciden.');
      return;
    }
  
    const newUserData = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      phone: Number(this.registerForm.get('phone')?.value) // Asegúrate de que sea un número
    };
  
    console.log(newUserData);
  
    this.userService.registerNewUser(newUserData).subscribe(
      (response) => {
        console.log('Usuario registrado con éxito:', response);
  
        // Mostrar Swal y luego redirigir después de un pequeño retraso
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registrado",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          // Redirigir después de que Swal se cierre
          this.router.navigate(['/home']);
        });
  
      }, (error) => {
        const registerComprobationDto: RegisterComprobationDto = error.error;
        console.log('Error de registro:', error);
  
        if (registerComprobationDto.mailAlreadyExist) {
          Swal.fire({
            icon: "error",
            title: "Correo ya existente",
            footer: '<a href="/passRecovery">¿Olvidaste tu contraseña?</a>'
          });
        } else if (registerComprobationDto.phoneAlreadyExist) {
          Swal.fire({
            icon: "error",
            title: "Telefono ya existente",
            footer: '<a href="/passRecovery">¿Olvidaste tu contraseña?</a>'
          });
        }
      }
    );
  }
  */

  loadNewUser() {
    if (!this.checkPasswords()) {
      console.error('Las contraseñas no coinciden.');
      return;
    }
  
    // Mostrar Swal con términos y condiciones
    Swal.fire({
      title: 'Términos y Condiciones',
      html:  `<div style="text-align: left; max-height: 300px; overflow-y: auto;">
      <h3>TÉRMINOS Y CONDICIONES DE LA APLICACIÓN MÓVIL “VIAJEROS.COM”</h3>

    <h4>1. Términos y Condiciones y su Aceptación</h4>
    <p>1.1. Los presentes términos y condiciones (en adelante los Términos y Condiciones) regulan el uso de la
        Aplicación Móvil denominada VIAJEROS.COM (en adelante, la Aplicación) que MAZA SISTEMAS S.A.S. (en adelante
        “MAZA SISTEMAS”) pone a disposición de sus clientes en las tiendas de Aplicaciones móviles. Para la utilización
        de la Aplicación, es condición necesaria y excluyente, la lectura y aceptación previa y sin reservas de los
        presentes Términos y Condiciones.</p>
    <p>1.2. La utilización de la Aplicación le otorgará la condición de Usuario/s a todo aquel que realice la descarga
        en su dispositivo móvil.</p>
    <p>1.3. El Usuario manifiesta, en tal sentido, haber leído, entendido y aceptado los presentes Términos y
        Condiciones, puestos a su disposición, en todo momento, con carácter previo a la utilización de la Aplicación.
    </p>
    <p>1.4. La utilización de la Aplicación conlleva, asimismo, la aceptación por parte del Usuario de cuantos avisos,
        reglamentos de uso e instrucciones actualmente en vigencia y los que fueren puestos en su conocimiento por parte
        de MAZA SISTEMAS con posterioridad a la aceptación de los presentes Términos y Condiciones.</p>
    <p>1.5. Las infracciones por parte de los Usuarios a estos Términos y Condiciones darán derecho a MAZA SISTEMAS a
        suspender o cancelar la Aplicación.</p>

    <h2>2. Objeto</h2>
    <p>2.1. Los presentes Términos y Condiciones regulan la prestación de la Aplicación por parte de MAZA SISTEMAS y la
        utilización de la misma por parte de los Usuarios. MAZA SISTEMAS se reserva el derecho a modificar en forma
        unilateral, en cualquier momento y sin previo aviso, la presentación, configuración, Términos y Condiciones de
        la Aplicación.</p>

    <h2>3. La Aplicación</h2>
    <p>3.1. “VIAJEROS.COM” es una aplicación que permite al Usuario compartir gastos de viajes entre distintos puntos
        del territorio de la República Argentina, hacer pagos de señas de viajes futuros, reintegros de pagos en caso de
        corresponder, chatear entre usuarios y simular costos de viaje.</p>

    <h2>4. Condiciones de Acceso y Utilización de la Aplicación</h2>
    <p>4.1. La Aplicación es válida únicamente en todo el territorio de la República Argentina, para clientes de MAZA
        SISTEMAS y que cuenten con dispositivos móviles con sistema operativo Android con versión mínima de 5.0 y iOS
        con versión mínima 10.3.</p>
    <p>4.2. El Usuario podrá eliminar la Aplicación cuando lo desee y volver a descargarla en otro momento.</p>
    <p>4.3. MAZA SISTEMAS podrá dar de baja la Aplicación sin previo aviso si observare que el Usuario no respeta los
        presentes términos y condiciones y/o las que se le informen en el futuro y/o ante el incumplimiento de las
        Políticas de Uso Aceptable (PUA) informadas en nuestra web: <a href="http://www.viajeros.com"
            target="_blank">www.viajeros.com</a></p>
    <p>4.5. La Aplicación contará con la siguiente modalidad de acceso: ejecutando el icono una vez descargada la
        Aplicación en la terminal móvil.</p>
    <p>4.6. El Usuario declara, con el uso de la Aplicación, que es mayor de edad.</p>
    <p>4.7. El Usuario acepta y reconoce que MAZA SISTEMAS no será responsable contractual o extracontractualmente, por
        ningún daño o perjuicio, directo o indirecto, derivado de la utilización de la Aplicación.</p>

    <h2>5. Precio</h2>
    <p>5.1. El uso de la Aplicación posee un costo de descarga (kb consumidos) y de consumos (tráfico). Cada vez que el
        Usuario ingrese a la Aplicación corresponderá un consumo de datos requeridos para actualizar los contenidos de
        la Aplicación.</p>

    <h2>6. Uso Correcto de la Aplicación</h2>
    <p>6.1. El Usuario se compromete a utilizar la Aplicación de forma correcta y diligente. Asimismo, a respetar la
        ley, la moral, las buenas costumbres y el orden público mediante el uso de la Aplicación.</p>

    <h2>7. Disponibilidad, modificación, actualización y cancelación de la Aplicación</h2>
    <p>7.1. MAZA SISTEMAS se reserva el derecho a modificar, en forma unilateral, en cualquier momento y sin previo
        aviso, la Aplicación, sus Términos y Condiciones y las normas que los complementan.</p>

    <h2>8. Responsabilidad</h2>
    <p>8.1. El Usuario acepta que el uso de la Aplicación se realiza bajo su propia, exclusiva y única responsabilidad.
    </p>

    <h2>9. Propiedad Intelectual</h2>
    <p>MAZA SISTEMAS no concede ninguna licencia o autorización de uso de ninguna clase sobre sus derechos de propiedad
        industrial e intelectual o sobre cualquier otra propiedad o derechos relacionados con la Aplicación.</p>

    <h2>10. Ley Aplicable y Jurisdicción</h2>
    <p>10.1. La prestación y el uso de la Aplicación regulado mediante las presentes Términos y Condiciones se regirán
        por la ley argentina.</p>
    <p>10.2. Para el caso de dudas o divergencias para la aplicación de las presentes Términos y Condiciones
        corresponderá la jurisdicción de los Tribunales en lo Comercial sitos en la Ciudad de Córdoba, con expresa
        renuncia a cualquier otro fuero o jurisdicción que pudiera corresponder.</p>
    </div>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario acepta, continua con el registro
        const newUserData = {
          name: this.registerForm.get('name')?.value,
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value,
          phone: Number(this.registerForm.get('phone')?.value)
        };
  
        console.log(newUserData);
  
        this.userService.registerNewUser(newUserData).subscribe(
          (response) => {
            console.log('Usuario registrado con éxito:', response);
            
            // Mostrar éxito y redirigir
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Registrado",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/home']);
            });
  
          }, (error) => {
            const registerComprobationDto: RegisterComprobationDto = error.error;
            console.log('Error de registro:', error);
  
            if (registerComprobationDto.mailAlreadyExist) {
              Swal.fire({
                icon: "error",
                title: "Correo ya existente",
                footer: '<a href="/passRecovery">¿Olvidaste tu contraseña?</a>'
              });
            } else if (registerComprobationDto.phoneAlreadyExist) {
              Swal.fire({
                icon: "error",
                title: "Teléfono ya existente",
                footer: '<a href="/passRecovery">¿Olvidaste tu contraseña?</a>'
              });
            }
          }
        );
      } else {
        console.log('El usuario no aceptó los términos y condiciones.');
      }
    });
  }
  
}
