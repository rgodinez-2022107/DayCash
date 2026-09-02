import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { IncomeService } from '../../core/income/income.service';
import { IncomeSettingsComponent } from '../../shared/income-settings/income-settings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IncomeSettingsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  userEmail: string | null;
  userName: string = 'Usuario';

  showIncomeSettings = false;
  balanceTrend: string = '+12.5%';

  recentActivities = [
    { title: 'Nómina Q2', date: 'Hoy, 09:00 AM', amount: '+$45,000', type: 'income' },
    { title: 'AWS Hosting', date: 'Ayer', amount: '-$1,200', type: 'expense' },
    { title: 'Suscripción SaaS', date: '12 Oct', amount: '-$850', type: 'expense' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public income: IncomeService
  ) {
    this.userEmail = this.authService.getCurrentUserEmail();
    if (this.userEmail) {
      this.userName = this.userEmail.split('@')[0];
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  }

  get totalBalance(): string {
    return this.income.formatMoney(this.income.monthlyTotal);
  }

  get fixedIncomeProgress(): number {
    return Math.min(100, this.income.savingsProgress);
  }

  get variableIncomeProgress(): number {
    if (this.income.monthlyTotal <= 0) return 0;
    const variableShare = (this.income.variableSubtotal / this.income.monthlyTotal) * 100;
    return Math.round(variableShare);
  }

  openIncomeSettings(): void {
    this.showIncomeSettings = true;
  }

  closeIncomeSettings(): void {
    this.showIncomeSettings = false;
  }

  addTransaction(): void {
    console.log('Abrir modal de nueva transacción');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}