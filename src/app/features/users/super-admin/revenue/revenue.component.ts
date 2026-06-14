import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueService } from '../services/revenue.service';
import { MessageService } from 'app/shared/message.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {

  totalRevenue: number = 0;
  loading: boolean = false;
isFiltered: boolean = false;
filterMessage: string = '';
  showFilter: boolean = false;
fromDate: string = '';
toDate: string = '';
  constructor(
    private revenueService: RevenueService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
      console.log('🔥 Revenue Component Loaded');
    this.loadRevenue();
  }

  loadRevenue() {
    this.loading = true;

    this.revenueService.getTotalRevenue().subscribe({
      next: (res) => {
              console.log("TOTAL:", res);
        this.totalRevenue = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.showError('Failed to load revenue');
      }
    });
  }


  
viewReport() {

  console.log('View Report clicked');

  if (!this.fromDate || !this.toDate) {
    this.messageService.showError('Please select From & To date first');
    return;
  }

  this.revenueService.getFilteredRevenue(this.fromDate, this.toDate)
    .subscribe({
      next: (res) => {
        console.log("REPORT DATA:", res);
        this.totalRevenue = res;
        this.messageService.showSuccess('Report loaded');
      },
      error: () => {
        this.messageService.showError('Failed to load report');
      }
    });
}
openFilter() {
   console.log('🔥 FILTER CLICK WORKING');
  this.showFilter = !this.showFilter;
}
applyFilter() {
    console.log('Apply clicked'); // 🔥 ye add karo
  if (!this.fromDate || !this.toDate) {
    this.messageService.showError('Select both dates');
    return;
  }

  this.revenueService.getFilteredRevenue(this.fromDate, this.toDate)
    .subscribe({
      next: (res) => {
                console.log("FILTER RESPONSE:", res);  // 🔥 यहाँ
         this.totalRevenue = res;

          this.isFiltered = true;
        this.filterMessage = `Filtered: ${this.fromDate} → ${this.toDate}`;
        this.messageService.showSuccess('Filter applied');
      },
      error: () => {
        this.messageService.showError('Error fetching data');
      }
    });
}

}