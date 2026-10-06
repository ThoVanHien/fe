import { Component, Input } from '@angular/core';

export type IconName =
  | 'home'
  | 'devices'
  | 'life'
  | 'routines'
  | 'menu'
  | 'chevron'
  | 'plus'
  | 'bulb'
  | 'temperature'
  | 'humidity'
  | 'door'
  | 'window'
  | 'shield'
  | 'lock'
  | 'unlock'
  | 'power'
  | 'arrow'
  | 'sun'
  | 'settings'
  | 'check'
  | 'sparkles';

const PATHS: Record<IconName, string> = {
  home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  devices: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  life: 'M5 3h14v18H5zM8 7h8M8 11h8M8 15h4',
  routines: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM10 8l6 4-6 4Z',
  menu: 'M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01',
  chevron: 'm9 5 7 7-7 7',
  plus: 'M12 5v14M5 12h14',
  bulb: 'M9 18h6M9 21h6M8 14a6 6 0 1 1 8 0l-1 2H9Z',
  temperature: 'M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0ZM12 8v10',
  humidity: 'M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12ZM9 16a3 3 0 0 0 3 3',
  door: 'M5 21V3h14v18M2 21h20M14 12h.01',
  window: 'M3 4h18v16H3zM3 8h18M12 8v12',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6ZM8 12l3 3 5-6',
  lock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
  unlock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0M12 14v3',
  power: 'M12 2v10M6 5a9 9 0 1 0 12 0',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1',
  settings:
    'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z',
  check: 'm5 12 4 4L19 6',
  sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="path" /></svg>',
  styles: [
    ':host { display: inline-flex; width: 24px; height: 24px; flex-shrink: 0; } svg { width: 100%; height: 100%; }',
  ],
})
export class IconComponent {
  @Input() name: IconName = 'home';
  get path(): string {
    return PATHS[this.name];
  }
}
