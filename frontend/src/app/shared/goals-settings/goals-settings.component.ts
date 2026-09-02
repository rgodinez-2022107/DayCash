import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService, IncomeCategory } from '../../core/income/income.service';

@Component({
  selector: 'app-goals-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals-settings.component.html',
  styleUrls: ['./goals-settings.component.scss'],
})
export class GoalsSettingsComponent {
  @Output() close = new EventEmitter<void>();

  constructor(public income: IncomeService) {}

  // Aporte y total del Fondo de Ahorro para Metas
  get savingsContribution(): number {
    return this.income.savingsGoal().contribution;
  }
  set savingsContribution(value: number) {
    this.income.savingsGoal.update((g) => ({ ...g, contribution: value ?? 0 }));
  }
  get savingsTarget(): number {
    return this.income.savingsGoal().target;
  }
  set savingsTarget(value: number) {
    this.income.savingsGoal.update((g) => ({ ...g, target: value ?? 0 }));
  }

  // Aporte y total del Fondo de Emergencia
  get emergencyContribution(): number {
    return this.income.emergencyGoal().contribution;
  }
  set emergencyContribution(value: number) {
    this.income.emergencyGoal.update((g) => ({ ...g, contribution: value ?? 0 }));
  }
  get emergencyTarget(): number {
    return this.income.emergencyGoal().target;
  }
  set emergencyTarget(value: number) {
    this.income.emergencyGoal.update((g) => ({ ...g, target: value ?? 0 }));
  }

  trackCategory(_index: number, category: IncomeCategory): string {
    return category.name;
  }

  onClose(): void {
    this.close.emit();
  }
}