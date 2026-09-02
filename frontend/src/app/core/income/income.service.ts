import { Injectable, signal } from '@angular/core';

export interface IncomeCategory {
  name: string;
  spent: number;
  budget: number;
}

export interface Goal {
  title: string;
  description: string;
  contribution: number;
  target: number;
}

export interface IncomeTransaction {
  amount: number;
  note: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class IncomeService {
  // Ingreso fijo mensual
  readonly fixedIncome = signal<number>(15000);

  // Ingreso variable
  readonly variableHours = signal<number>(0);
  readonly variableRate = signal<number>(100);

  // Comentario/nota del registro de ingreso (opcional)
  readonly incomeNote = signal<string>('');

  // Subtotal variable (horas * tarifa), calculado
  get variableSubtotal(): number {
    return this.variableHours() * this.variableRate();
  }

  // Ingreso mensual total = fijo + variable
  get monthlyTotal(): number {
    return this.fixedIncome() + this.variableSubtotal;
  }

  // Metas y fondos: cada meta tiene título, descripción, aporte y total
  readonly savingsGoal = signal<Goal>({
    title: 'Fondo de Ahorro para Metas',
    description: 'Ahorro orientado a tus objetivos',
    contribution: 0,
    target: 0,
  });

  readonly budgetCategories = signal<IncomeCategory[]>([
    { name: 'Groceries', spent: 0, budget: 0 },
    { name: 'Transport', spent: 0, budget: 0 },
    { name: 'Dining', spent: 0, budget: 0 },
  ]);

  readonly emergencyGoal = signal<Goal>({
    title: 'Fondo de Emergencia',
    description: 'Colchón de seguridad financiera',
    contribution: 0,
    target: 0,
  });

  // Historial de transacciones de ingresos registradas (con comentario opcional)
  readonly incomeTransactions = signal<IncomeTransaction[]>([]);

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

  // Redefinir una meta completa (título, descripción, aporte y total)
  updateGoal(signalName: 'savingsGoal' | 'emergencyGoal', patch: Partial<Goal>): void {
    if (signalName === 'savingsGoal') {
      this.savingsGoal.update((g) => ({ ...g, ...patch }));
    } else {
      this.emergencyGoal.update((g) => ({ ...g, ...patch }));
    }
  }

  // Registrar un ingreso y agregarlo al historial con su comentario
  addIncomeTransaction(amount: number, note: string): void {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    this.incomeTransactions.update((list) => [{ amount, note, date }, ...list]);
    this.incomeNote.set('');
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