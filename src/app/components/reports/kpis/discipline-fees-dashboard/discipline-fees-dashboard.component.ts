import { Component, inject, Input, signal } from '@angular/core';
import { BackKpiService } from '../../../../services/backend-helpers/kpi/back-kpi.service';
import { CommonModule, DatePipe } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule } from '@angular/forms';
import { DisciplineSummaryDTO } from '../../../../models/backend/DisciplineSummaryDTO';

@Component({
  selector: 'app-discipline-fees-dashboard',
  imports: [FormsModule, GoogleChartsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './discipline-fees-dashboard.component.html',
  styleUrl: './discipline-fees-dashboard.component.css'
})
export class DisciplineFeesDashboardComponent {

  @Input() disciplines: DisciplineSummaryDTO[] = [];

  private kpiService = inject(BackKpiService);
  private datePipe = inject(DatePipe);

  fromDate!: string;
  toDate!: string;
  disciplineId!: string;

  // Señales para los datos de los gráficos
  revenuePerPeriodChartData = signal<any>({
    type: 'ColumnChart',
    data: [],
    columns: ['Período', 'Cantidad'],
    options: {
      title: 'Distribución de Ingresos',
      legend: { position: 'none' },
      animation: { duration: 500, easing: 'out' },
      hAxis: {
        title: 'Período',  // Nombre para el eje X
        titleTextStyle: {
          italic: false,
          bold: true
        }
      },
      vAxis: {
        title: 'Monto ($)',  // Nombre para el eje Y
        titleTextStyle: {
          italic: false,
          bold: true
        },
        format: '$#,##0'  // Opcional: formato de moneda para los valores del eje Y
      }
    }
  });

  totalRevenueChartData = signal<any>({
    type: 'Gauge',
    data: [['Ingresos', 0]],
    options: {
      title: 'Ingresos',
      width: 400,
      height: 300,
      max: 1000000,
      min: 0,
      greenFrom: 0,
      greenTo:   1000000,
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
    //console.log("this.disciplines: ", this.disciplines);
    this.setDefaultDates();
    this.disciplineId = this.disciplines.at(0)?.id || "";
    this.updateCharts();
  }

  private setDefaultDates() {
    const from = new Date();
    from.setFullYear(from.getFullYear() - 1);
    this.fromDate = this.formatDate(from);
    this.toDate = this.formatDate(new Date());
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  updateCharts() {
    //console.log("disciplineId", this.disciplineId);

    this.kpiService.kpiFeeDisciplineGetRevenuePerPeriod(this.disciplineId, this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          const chartData = data.map(item => [item.period, item.revenue]);
          this.revenuePerPeriodChartData.update(prev => ({ ...prev, data: chartData }));
        },
        error: (err) => console.error('Error loading revenue per period distribution', err)
      });

    this.kpiService.kpiFeeDisciplineGetRevenueAmount(this.disciplineId, this.fromDate, this.toDate)
      .subscribe({
        next: (total) => {
          this.totalRevenueChartData.update(prev => ({
            ...prev,
            data: [['Ingresos', total]]
          }));
        },
        error: (err) => console.error('Error loading total revenue', err)
      });

    this.kpiService.kpiFeeDisciplineGetDebtorsAndUpToDateQuantities(this.disciplineId, this.fromDate, this.toDate)
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
        error: (err) => console.error('Error loading debtors distribution', err)
      });
  }

}
