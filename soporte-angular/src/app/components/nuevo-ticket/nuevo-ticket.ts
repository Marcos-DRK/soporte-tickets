import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketsService } from '../../services/tickets';

@Component({
  selector: 'app-nuevo-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-ticket.html',
  styleUrl: './nuevo-ticket.css'
})
export class NuevoTicket {
  error = signal('');

  categorias = ['Hardware', 'Software', 'Red', 'Cuentas y accesos', 'Otro'];
  prioridades = ['Baja', 'Media', 'Alta', 'Crítica'];

  formulario = new FormGroup({
    asunto: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    solicitante: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    prioridad: new FormControl('Media', { nonNullable: true, validators: [Validators.required] }),
    estado: new FormControl('Abierto', { nonNullable: true }) // todo ticket nuevo parte "Abierto"
  });

  constructor(
    private ticketsService: TicketsService,
    private router: Router
  ) {}

  guardar(): void {
    this.error.set('');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.ticketsService.crearTicket(this.formulario.getRawValue()).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (error) => {
        console.error(error);
        this.error.set('No fue posible registrar el ticket.');
      }
    });
  }
}