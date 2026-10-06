import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationId } from '../../core/models/smartthings.models';
import { IconComponent, IconName } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  @Input() active: NavigationId = 'home';
  @Output() navigate = new EventEmitter<NavigationId>();
  readonly items: { id: NavigationId; label: string; icon: IconName }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'devices', label: 'Devices', icon: 'devices' },
    { id: 'life', label: 'Life', icon: 'life' },
    { id: 'routines', label: 'Routines', icon: 'routines' },
    { id: 'menu', label: 'Menu', icon: 'menu' },
  ];
}
