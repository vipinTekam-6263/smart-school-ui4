import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StateAdminService } from './state-admin.service';
import { environment } from '@env/environment';

describe('StateAdminService', () => {
  let service: StateAdminService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiBaseUrl}/state-admins`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ✅ important
      providers: [StateAdminService]
    });

    service = TestBed.inject(StateAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ✅ ensure no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // 🔥 TEST: get all state admins
  it('should fetch state admins list', () => {
    service.getAllStateAdmins(0, 10).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');

    req.flush({ content: [] }); // mock response
  });

  // 🔥 TEST: count API
  it('should fetch state admin count', () => {
    service.countStateAdmins().subscribe(res => {
      expect(res).toBe(5);
    });

    const req = httpMock.expectOne(`${baseUrl}/count`);
    expect(req.request.method).toBe('GET');

    req.flush(5);
  });

  // 🔥 TEST: delete API
  it('should delete state admin', () => {
    service.deleteStateAdmin(1).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

});