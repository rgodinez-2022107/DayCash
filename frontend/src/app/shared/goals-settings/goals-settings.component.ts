import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../core/income/income.service';

@Component({
  selector: 'app-goals-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals-settings.component.html',
  styleUrls: ['./goals-settings.component.scss'],
})
export class GoalsSettingsComponent {
  @Output() close = new EventEmitter<void>();

  // Meta que está en modo edición (null = ninguna)
  editingGoal: 'savings' | 'budget' | 'emergency' | null = null;

  constructor(public income: IncomeService) {}

  // ===== Fondo de Ahorro para Metas =====
  get savingsTitle(): string {
    return this.income.savingsGoal().title;
  }
  set savingsTitle(value: string) {
    this.income.updateGoal('savingsGoal', { title: value ?? '' });
  }
  get savingsDescription(): string {
    return this.income.savingsGoal().description;
  }
  set savingsDescription(value: string) {
    this.income.updateGoal('savingsGoal', { description: value ?? '' });
  }
  get savingsContribution(): number {
    return this.income.savingsGoal().contribution;
  }
  set savingsContribution(value: number) {
    this.income.updateGoal('savingsGoal', { contribution: value ?? 0 });
  }
  get savingsTarget(): number {
    return this.income.savingsGoal().target;
  }
  set savingsTarget(value: number) {
    this.income.updateGoal('savingsGoal', { target: value ?? 0 });
  }

  // ===== Fondo de Emergencia =====
  get emergencyTitle(): string {
    return this.income.emergencyGoal().title;
  }
  set emergencyTitle(value: string) {
    this.income.updateGoal('emergencyGoal', { title: value ?? '' });
  }
  get emergencyDescription(): string {
    return this.income.emergencyGoal().description;
  }
  set emergencyDescription(value: string) {
    this.income.updateGoal('emergencyGoal', { description: value ?? '' });
  }
  get emergencyContribution(): number {
    return this.income.emergencyGoal().contribution;
  }
  set emergencyContribution(value: number) {
    this.income.updateGoal('emergencyGoal', { contribution: value ?? 0 });
  }
  get emergencyTarget(): number {
    return this.income.emergencyGoal().target;
  }
  set emergencyTarget(value: number) {
    this.income.updateGoal('emergencyGoal', { target: value ?? 0 });
  }

  // ===== Presupuesto por Categorías (nombre editable) =====
  updateCategoryName(name: string, index: number): void {
    this.income.budgetCategories.update((categories) =>
      categories.map((c, i) => (i === index ? { ...c, name: name ?? '' } : c))
    );
  }

  toggleEdit(goal: 'savings' | 'budget' | 'emergency'): void {
    this.editingGoal = this.editingGoal === goal ? null : goal;
  }

  trackIndex(index: number): number {
    return index;
  }

  onClose(): void {
    this.close.emit();
  }
}