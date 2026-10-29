import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { TicketsService } from '../../services/tickets';

@Component({
  selector: 'app-tickets',
  imports: [DatePipe, RouterLink],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {
  // signal(): al cambiar su valor con set(), Angular actualiza la pantalla
  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  error = signal('');

  constructor(
    private ticketsService: TicketsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando.set(true);
    this.error.set('');

    this.ticketsService.obtenerTickets().subscribe({
      next: (datos) => {
        this.tickets.set(datos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.error.set('No fue posible obtener los tickets. Revise que la API esté funcionando.');
        this.cargando.set(false);
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/editar-ticket', id]);
  }

  eliminar(id: number): void {
    if (!confirm('¿Desea eliminar este ticket?')) return;

    this.ticketsService.eliminarTicket(id).subscribe({
      next: () => this.cargarTickets(),
      error: (error) => {
        console.error(error);
        alert('No fue posible eliminar el ticket.');
      }
    });
  }

  // Clase CSS según el estado (color de la insignia)
  claseEstado(estado: string): string {
    if (estado === 'Abierto') return 'estado-abierto';
    if (estado === 'En proceso') return 'estado-en-proceso';
    if (estado === 'Resuelto') return 'estado-resuelto';
    return 'estado-cerrado';
  }

  // Clase CSS según la prioridad (color de la insignia)
  clasePrioridad(prioridad: string): string {
    if (prioridad === 'Baja') return 'prioridad-baja';
    if (prioridad === 'Media') return 'prioridad-media';
    if (prioridad === 'Alta') return 'prioridad-alta';
    return 'prioridad-critica';
  }
}
