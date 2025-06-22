import { Component, inject, signal } from '@angular/core';
import { BackKpiService } from '../../../../services/backend-helpers/kpi/back-kpi.service';
import { CommonModule, DatePipe } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule } from '@angular/forms';
import { max } from 'rxjs';

@Component({
  selector: 'app-users-dashboard',
  imports: [FormsModule, GoogleChartsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.css'
})
export class UsersDashboardComponent {
private kpiService = inject(BackKpiService);
  private datePipe = inject(DatePipe);

  fromDate!: string;
  toDate!: string;

  // Señales para los datos de los gráficos
  ageChartData = signal<any>({
    type: 'ColumnChart',
    data: [],
    columns: ['Edad', 'Cantidad'],
    options: {
      title: 'Distribución por Edades',
      legend: { position: 'none' },
      animation: { duration: 500, easing: 'out' }
    }
  });

  totalUsersChartData = signal<any>({
    type: 'Gauge',
    data: [['Usuarios', 0]],
    options: {
      title: 'Total de Usuarios',
      width: 400,
      height: 300,
      max: 2000,
      min: 0,
      greenFrom: 0,
      greenTo: 1500,
      yellowFrom: 1501,
      yellowTo: 1750,
      redFrom: 1751,
      redTo: 2000,
      minorTicks: 5
    }
  });

  genderChartData = signal<any>({
    type: 'PieChart',
    data: [],
    columns: ['Género', 'Cantidad'],
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
    this.kpiService.kpiUserGetAgeDistribution(this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          const chartData = data.map(item => [item.age, item.count]);
          this.ageChartData.update(prev => ({ ...prev, data: chartData }));
        },
        error: (err) => console.error('Error loading age distribution', err)
      });

    // Actualizar total de usuarios
    this.kpiService.kpiUserGetQuantity(this.fromDate, this.toDate)
      .subscribe({
        next: (total) => {
          this.totalUsersChartData.update(prev => ({
            ...prev,
            data: [['Usuarios', total]]
          }));
        },
        error: (err) => console.error('Error loading total users', err)
      });

    // Actualizar distribución por género
    this.kpiService.kpiUserGetQuantityForeachGender(this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          this.genderChartData.update(prev => ({
            ...prev,
            data: [
              ['Masculino', data.maleQuantity],
              ['Femenino', data.femaleQuantity]
            ]
          }));
        },
        error: (err) => console.error('Error loading gender distribution', err)
      });
  }
}
