import { Injectable, signal } from '@angular/core';

export interface IncomeCategory {
  name: string;
  spent: number;
  budget: number;
}

export interface Goal {
  contribution: number;
  target: number;
}

@Injectable({ providedIn: 'root' })
export class IncomeService {
  // Ingreso fijo mensual
  readonly fixedIncome = signal<number>(15000);

  // Ingreso variable
  readonly variableHours = signal<number>(0);
  readonly variableRate = signal<number>(100);

  // Subtotal variable (horas * tarifa), calculado
  get variableSubtotal(): number {
    return this.variableHours() * this.variableRate();
  }

  // Ingreso mensual total = fijo + variable
  get monthlyTotal(): number {
    return this.fixedIncome() + this.variableSubtotal;
  }

  // Metas y fondos: cada meta tiene aporte (contribución) y total objetivo
  readonly savingsGoal = signal<Goal>({ contribution: 0, target: 0 });

  readonly budgetCategories = signal<IncomeCategory[]>([
    { name: 'Groceries', spent: 0, budget: 0 },
    { name: 'Transport', spent: 0, budget: 0 },
    { name: 'Dining', spent: 0, budget: 0 },
  ]);

  readonly emergencyGoal = signal<Goal>({ contribution: 0, target: 0 });

  // Progresos derivados
  goalProgress(contribution: number, target: number): number {
    if (target <= 0) return 0;
    return Math.min(100, Math.round((contribution / target) * 100));
  }

  get savingsProgress(): number {
    return this.goalProgress(this.savingsGoal().contribution, this.savingsGoal().target);
  }

  get emergencyProgress(): number {
    return this.goalProgress(this.emergencyGoal().contribution, this.emergencyGoal().target);
  }

  categoryProgress(category: IncomeCategory): number {
    return this.goalProgress(category.spent, category.budget);
  }

  // Utilidad de formato moneda (Quetzales guatemaltecos)
  formatMoney(value: number): string {
    return value.toLocaleString('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2,
    });
  }
}