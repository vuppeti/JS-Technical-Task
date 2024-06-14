import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TechTaskJS';
  apiUrl = 'https://jsonplaceholder.typicode.com/photos';
  http = inject(HttpClient);
  gridItems: any;

  constructor() { }

  ngOnInit(): void {
    this.http.get<any>(this.apiUrl).subscribe(response => {
      this.gridItems = response.slice(0, 15);
      
    }, error => {
      console.error(error);
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}
