import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../core/income/income.service';

@Component({
  selector: 'app-income-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income-settings.component.html',
  styleUrls: ['./income-settings.component.scss'],
})
export class IncomeSettingsComponent {
  @Output() close = new EventEmitter<void>();

  constructor(public income: IncomeService) {}

  onClose(): void {
    this.close.emit();
  }
}