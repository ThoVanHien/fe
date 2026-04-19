import { Component } from '@angular/core';
import { CanLeavePage } from '../../guards/pending-changes.guard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements CanLeavePage {
  name = 'Nguyen An';
  role = 'Frontend Developer';
  note = 'Tôi đang học Angular Router qua một demo chạy được.';

  private savedName = this.name;
  private savedRole = this.role;
  private savedNote = this.note;

  get dirty(): boolean {
    return this.name !== this.savedName ||
      this.role !== this.savedRole ||
      this.note !== this.savedNote;
  }

  save(): void {
    this.savedName = this.name;
    this.savedRole = this.role;
    this.savedNote = this.note;
  }

  reset(): void {
    this.name = this.savedName;
    this.role = this.savedRole;
    this.note = this.savedNote;
  }

  canDeactivate(): boolean {
    if (!this.dirty) {
      return true;
    }

    return window.confirm('Bạn có thay đổi chưa lưu. Rời trang này chứ?');
  }
}
