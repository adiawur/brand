import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { LucideAngularModule } from 'lucide-angular';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-home',
  imports: [Footer, LucideAngularModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
