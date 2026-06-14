import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-notification',
    imports: [CommonModule],
    standalone:true,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnChanges, OnDestroy {

  @Input() notifications: string[] = []; // Parent se notifications receive
  visibleNotifications: string[] = [];
  private scrollInterval: any;
  private displayCount = 3; // ek time me kitne notifications dikhaye

  constructor() { }

  ngOnInit(): void {
    this.initVisible();
    this.startScrolling();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['notifications']) {
      this.initVisible();
    }
  }

  ngOnDestroy() {
    if (this.scrollInterval) clearInterval(this.scrollInterval);
  }

  initVisible() {
    this.visibleNotifications = this.notifications.slice(0, this.displayCount);
  }

  startScrolling() {
    if (this.scrollInterval) clearInterval(this.scrollInterval);

    this.scrollInterval = setInterval(() => {
      if (this.notifications.length > 0) {
        const first = this.notifications.shift();
        if (first) {
          this.notifications.push(first);
          this.initVisible();
        }
      }
    }, 3000); // 3 sec me scroll
  }
}