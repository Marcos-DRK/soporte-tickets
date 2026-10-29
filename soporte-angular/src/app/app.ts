import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecera } from './components/cabecera/cabecera';
import { Menu } from './components/menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecera, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}