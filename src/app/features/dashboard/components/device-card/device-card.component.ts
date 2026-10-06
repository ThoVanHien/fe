import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device } from '../../../../core/models/smartthings.models';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-device-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './device-card.component.html',
  styleUrl: './device-card.component.scss',
})
export class DeviceCardComponent {
  @Input({ required: true }) device!: Device;
  @Output() toggle = new EventEmitter<string>();
}
