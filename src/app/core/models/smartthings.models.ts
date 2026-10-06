import { IconName } from '../../shared/ui/icon/icon.component';

export type NavigationId = 'home' | 'devices' | 'life' | 'routines' | 'menu';
export type Room =
  'All rooms' | 'Reception' | 'Workspace' | 'Meeting room' | 'Hallway';
export interface Device {
  id: string;
  name: string;
  room: Exclude<Room, 'All rooms'>;
  icon: IconName;
  kind: 'light' | 'temperature' | 'humidity' | 'contact';
  value: string;
  detail: string;
  active: boolean;
  controllable: boolean;
  favorite: boolean;
  accent: 'yellow' | 'blue' | 'mint' | 'purple';
}
export interface Routine {
  id: string;
  name: string;
  description: string;
  icon: IconName;
}
