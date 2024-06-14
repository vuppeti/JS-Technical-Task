import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/photos');
    req.flush([]);
    expect(component).toBeTruthy();
  });

  it('should fetch grid items on init', () => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, url: `https://placeholder.com/image${i + 1}.jpg`, title: `Image ${i + 1}` }));

    fixture.detectChanges();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/photos');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(component.gridItems.length).toBe(15);
    expect(component.gridItems).toEqual(mockData.slice(0, 15));
  });

  it('should handle error when fetching grid items', () => {
    const mockError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });
    const consoleSpy = spyOn(console, 'error');

    fixture.detectChanges();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/photos');
    expect(req.request.method).toBe('GET');
    req.flush(null, mockError);

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      status: 500,
      statusText: 'Internal Server Error'
    }));
    expect(component.gridItems).toBeUndefined();
  });

  it('should render a grid container', () => {
    const mockData = [
      { id: 1, url: 'https://placeholder.com/image1.jpg', title: 'Image 1' },
      { id: 2, url: 'https://placeholder.com/image2.jpg', title: 'Image 2' },
      { id: 3, url: 'https://placeholder.com/image3.jpg', title: 'Image 3' },
    ];
    fixture.detectChanges();
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/photos');
    req.flush(mockData);
    const gridContainer = fixture.nativeElement.querySelector('.grid-container');
    expect(gridContainer).toBeTruthy();
  });

  it('should render grid items with images and titles', () => {
    const mockData = [
      { id: 1, url: 'https://placeholder.com/image1.jpg', title: 'Image 1' },
      { id: 2, url: 'https://placeholder.com/image2.jpg', title: 'Image 2' },
      { id: 3, url: 'https://placeholder.com/image3.jpg', title: 'Image 3' },
    ];

    fixture.detectChanges();
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/photos');
    req.flush(mockData);

    const gridItems = fixture.nativeElement.querySelectorAll('.grid-item');

    expect(gridItems.length).toBe(3);

    gridItems.forEach((item: Element, index: number) => {
      const img = item.querySelector('img') as HTMLImageElement;
      const title = item.querySelector('h3') as HTMLHeadingElement;

      expect(img.src).toBe(mockData[index].url);
      expect(img.alt).toBe(mockData[index].title);
      expect(title.textContent).toBe(mockData[index].title);
    });
  });
});
