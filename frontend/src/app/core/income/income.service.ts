import { Injectable, signal } from '@angular/core';

export interface IncomeCategory {
  name: string;
  spent: number;
  budget: number;
}

@Injectable({ providedIn: 'root' })
export class IncomeService {
  // Ingreso fijo mensual
  readonly fixedIncome = signal<number>(35000);

  // Ingreso variable
  readonly variableHours = signal<number>(20);
  readonly variableRate = signal<number>(225);

  // Subtotal variable (horas * tarifa), calculado
  get variableSubtotal(): number {
    return this.variableHours() * this.variableRate();
  }

  // Ingreso mensual total = fijo + variable
  get monthlyTotal(): number {
    return this.fixedIncome() + this.variableSubtotal;
  }

  // Metas y fondos
  readonly savingsGoalCurrent = signal<number>(12500);
  readonly savingsGoalTarget = signal<number>(18400);

  readonly budgetCategories = signal<IncomeCategory[]>([
    { name: 'Groceries', spent: 3200, budget: 5000 },
    { name: 'Transport', spent: 1500, budget: 2400 },
    { name: 'Dining', spent: 2100, budget: 3000 },
  ]);

  readonly emergencyCurrent = signal<number>(46000);
  readonly emergencyTarget = signal<number>(50000);

  // Progresos derivados
  get savingsProgress(): number {
    return Math.min(100, Math.round((this.savingsGoalCurrent() / this.savingsGoalTarget()) * 100));
  }

  get emergencyProgress(): number {
    return Math.min(100, Math.round((this.emergencyCurrent() / this.emergencyTarget()) * 100));
  }

  categoryProgress(category: IncomeCategory): number {
    return Math.min(100, Math.round((category.spent / category.budget) * 100));
  }

  // Utilidad de formato moneda
  formatMoney(value: number): string {
    return value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });
  }
}