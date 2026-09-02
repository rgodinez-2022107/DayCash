import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService, IncomeCategory, Goal } from '../../core/income/income.service';

interface NewGoalDraft {
  title: string;
  description: string;
  contribution: number;
  target: number;
}

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
  editingGoal: 'savings' | 'budget' | 'emergency' | 'custom' | null = null;
  editingCustomIndex: number | null = null;

  // Estado del formulario de nueva meta
  showNewGoalForm = false;
  newGoalDraft: NewGoalDraft = { title: '', description: '', contribution: 0, target: 0 };

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

  // ===== Gestión del estado de edición =====
  toggleEdit(goal: 'savings' | 'budget' | 'emergency'): void {
    this.editingGoal = this.editingGoal === goal ? null : goal;
  }

  // Convierte un valor de input a número (usado en templates)
  toNumber(value: unknown): number {
    return Number(value) || 0;
  }

  // ===== Presupuesto por Categorías (nombres y montos editables) =====
  updateCategoryName(name: string, index: number): void {
    this.income.updateCategory(index, { name: name ?? '' });
  }
  updateCategorySpent(spent: number, index: number): void {
    this.income.updateCategory(index, { spent: spent ?? 0 });
  }
  updateCategoryBudget(budget: number, index: number): void {
    this.income.updateCategory(index, { budget: budget ?? 0 });
  }
  addCategory(): void {
    this.income.addCategory({ name: 'Nueva categoría', spent: 0, budget: 0 });
  }
  removeCategory(index: number): void {
    this.income.removeCategory(index);
  }

  // ===== Formulario de nueva meta =====
  toggleNewGoalForm(): void {
    this.showNewGoalForm = !this.showNewGoalForm;
  }

  createNewGoal(): void {
    const title = this.newGoalDraft.title.trim();
    if (!title) return;
    this.income.addCustomGoal({
      title,
      description: this.newGoalDraft.description.trim(),
      contribution: this.newGoalDraft.contribution ?? 0,
      target: this.newGoalDraft.target ?? 0,
    });
    this.newGoalDraft = { title: '', description: '', contribution: 0, target: 0 };
    this.showNewGoalForm = false;
  }

  // ===== Metas personalizadas =====
  toggleEditCustom(index: number): void {
    if (this.editingCustomIndex === index) {
      this.editingCustomIndex = null;
    } else {
      this.editingCustomIndex = index;
    }
  }

  isCustomEditing(index: number): boolean {
    return this.editingCustomIndex === index;
  }

  updateCustomTitle(title: string, index: number): void {
    this.income.updateCustomGoal(index, { title: title ?? '' });
  }
  updateCustomDescription(desc: string, index: number): void {
    this.income.updateCustomGoal(index, { description: desc ?? '' });
  }
  updateCustomContribution(value: number, index: number): void {
    this.income.updateCustomGoal(index, { contribution: value ?? 0 });
  }
  updateCustomTarget(value: number, index: number): void {
    this.income.updateCustomGoal(index, { target: value ?? 0 });
  }
  removeCustomGoal(index: number): void {
    this.income.removeCustomGoal(index);
    if (this.editingCustomIndex === index) {
      this.editingCustomIndex = null;
    }
  }

  customGoalProgress(goal: Goal): number {
    return this.income.customGoalProgress(goal);
  }

  trackIndex(index: number): number {
    return index;
  }

  trackGoal(_index: number, goal: Goal): string {
    return goal.title;
  }

  onClose(): void {
    this.close.emit();
  }
}