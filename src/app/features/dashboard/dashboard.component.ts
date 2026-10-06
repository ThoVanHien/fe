import { Component } from '@angular/core';
import {
  Device,
  NavigationId,
  Room,
} from '../../core/models/smartthings.models';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { NavigationComponent } from '../../layout/navigation/navigation.component';
import { DeviceCardComponent } from './components/device-card/device-card.component';
import { DEVICES, ROOMS, ROUTINES } from './data/dashboard.mock';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IconComponent, NavigationComponent, DeviceCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard-panels.scss'],
})
export class DashboardComponent {
  active: NavigationId = 'home';
  room: Room = 'All rooms';
  security = 'Disarmed';
  message = '';
  readonly rooms = ROOMS;
  readonly routines = ROUTINES;
  readonly securityModes = ['Armed Away', 'Armed Stay', 'Disarmed'];
  devices: Device[] = DEVICES.map((device) => ({ ...device }));

  get title(): string {
    return {
      home: 'A little smarter. A lot more comfortable.',
      devices: 'Every device. One place.',
      life: 'Peace of mind, around the office.',
      routines: 'Make the everyday effortless.',
      menu: 'Your workspace, your way.',
    }[this.active];
  }
  get visibleDevices(): Device[] {
    return this.devices.filter(
      (device) =>
        (this.active !== 'home' || device.favorite) &&
        (this.room === 'All rooms' || device.room === this.room) &&
        (this.active !== 'life' || !device.controllable),
    );
  }
  get lightsOn(): number {
    return this.devices.filter(
      (device) => device.kind === 'light' && device.active,
    ).length;
  }
  navigate(id: NavigationId): void {
    this.active = id;
    this.room = 'All rooms';
    this.message = '';
  }
  toggleDevice(id: string): void {
    this.devices = this.devices.map((device) =>
      device.id === id && device.controllable
        ? {
            ...device,
            active: !device.active,
            value: device.active ? 'Off' : 'On',
            detail: device.active ? 'Ready when you are' : 'Brightness · 80%',
          }
        : device,
    );
    this.message =
      'Device updated in demo. No command was sent to SmartThings.';
  }
  toggleFavorite(id: string): void {
    this.devices = this.devices.map((device) =>
      device.id === id ? { ...device, favorite: !device.favorite } : device,
    );
  }
  runRoutine(id: string): void {
    this.devices = this.devices.map((device) => {
      if (
        !device.controllable ||
        (id === 'meeting' && device.room !== 'Meeting room')
      )
        return device;
      const active = id !== 'leave';
      return {
        ...device,
        active,
        value: active ? 'On' : 'Off',
        detail: active ? 'Brightness · 80%' : 'Ready when you are',
      };
    });
    this.message = `${this.routines.find((routine) => routine.id === id)?.name} ran in demo. No command was sent to SmartThings.`;
  }
  setSecurity(mode: string): void {
    this.security = mode;
    this.message = `Demo security mode: ${mode}. No command was sent to SmartThings.`;
  }
}
