import { Component, inject, signal } from '@angular/core';
import { BackKpiService } from '../../../../services/backend-helpers/kpi/back-kpi.service';
import { CommonModule, DatePipe } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-social-fees-dashboard',
  imports: [FormsModule, GoogleChartsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './social-fees-dashboard.component.html',
  styleUrl: './social-fees-dashboard.component.css'
})
export class SocialFeesDashboardComponent {
private kpiService = inject(BackKpiService);
  private datePipe = inject(DatePipe);

  fromDate!: string;
  toDate!: string;

  // Señales para los datos de los gráficos
  revenuePerPeriodChartData = signal<any>({
    type: 'ColumnChart',
    data: [],
    columns: ['Período', 'Cantidad'],
    options: {
      title: 'Distribución de Ingresos',
      legend: { position: 'none' },
      animation: { duration: 500, easing: 'out' }
    }
  });

  totalRevenueChartData = signal<any>({
    type: 'Gauge',
    data: [['Ingresos', 0]],
    options: {
      title: 'Ingresos',
      width: 400,
      height: 300,
      max: 3500000,
      min: 0,
      greenFrom: 2000001,
      greenTo:   3500000,
      yellowFrom: 1000001,
      yellowTo:   2000000,
      redFrom: 0,
      redTo: 1000000,
      minorTicks: 5
    }
  });

  debtorsChartData = signal<any>({
    type: 'PieChart',
    data: [],
    columns: ['Condición', 'Cantidad'],
    options: {
      pieHole: 0.4,
      is3D: true,
      animation: { duration: 500, easing: 'out' },
        chartArea: {
        width: '100%',
        height: '100%'
      }
    }
    
  });

  ngOnInit() {
    this.setDefaultDates();
    this.updateCharts();
  }

  private setDefaultDates() {
    const from = new Date();
    from.setFullYear(from.getFullYear() - 5);
    this.fromDate = this.formatDate(from);
    this.toDate = this.formatDate(new Date());
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  updateCharts() {
    // Actualizar gráfico de edades
    this.kpiService.kpiFeeSocialGetRevenuePerPeriod(this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          const chartData = data.map(item => [item.period, item.revenue]);
          this.revenuePerPeriodChartData.update(prev => ({ ...prev, data: chartData }));
        },
        error: (err) => console.error('Error loading age distribution', err)
      });

    // Actualizar total de usuarios
    this.kpiService.kpiFeeSocialGetRevenueAmount(this.fromDate, this.toDate)
      .subscribe({
        next: (total) => {
          this.totalRevenueChartData.update(prev => ({
            ...prev,
            data: [['Ingresos', total]]
          }));
        },
        error: (err) => console.error('Error loading total users', err)
      });

    // Actualizar distribución por género
    this.kpiService.kpiFeeSocialGetDebtorsAndUpToDateQuantities(this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          this.debtorsChartData.update(prev => ({
            ...prev,
            data: [
              ['Deudores', data.debtorsAmount],
              ['Al día', data.upToDateAmount]
            ]
          }));
        },
        error: (err) => console.error('Error loading gender distribution', err)
      });
  }
}
