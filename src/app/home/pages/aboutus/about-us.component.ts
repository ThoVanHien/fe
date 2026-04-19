import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html'
})
export class AboutUsComponent {
  readonly skills = [
    'TOEIC Grammar',
    'Part 5',
    'Part 6',
    'Part 7',
    'Listening Review',
    'Shadowing',
    'Vocabulary',
    'Error Logs',
    'Mock Tests',
    'Study Planning'
  ];

  readonly timeline = [
    {
      year: '2024',
      title: 'Grammar foundations',
      text: 'Grouped the most common TOEIC grammar traps into short, repeatable practice rules.'
    },
    {
      year: '2025',
      title: 'Review loops',
      text: 'Added listening replay, reading evidence, and vocabulary review flows around real mistake patterns.'
    },
    {
      year: '2026',
      title: 'Learning portal',
      text: 'Turned the method into structured paths, guides, and an admin workspace for new lessons.'
    }
  ];
}
