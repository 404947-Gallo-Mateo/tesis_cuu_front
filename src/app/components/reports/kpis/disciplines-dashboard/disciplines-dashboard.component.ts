import { Component, inject, Input, signal } from '@angular/core';
import { BackKpiService } from '../../../../services/backend-helpers/kpi/back-kpi.service';
import { CommonModule, DatePipe } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule } from '@angular/forms';
import { DisciplineSummaryDTO } from '../../../../models/backend/DisciplineSummaryDTO';

@Component({
  selector: 'app-disciplines-dashboard',
  imports: [FormsModule, GoogleChartsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './disciplines-dashboard.component.html',
  styleUrl: './disciplines-dashboard.component.css'
})
export class DisciplinesDashboardComponent {

  @Input() disciplines: DisciplineSummaryDTO[] = [];

  private kpiService = inject(BackKpiService);
  private datePipe = inject(DatePipe);

  fromDate!: string;
  toDate!: string;
  disciplineId!: string;

  ageDistributionChartData = signal<any>({
    type: 'ColumnChart',
    data: [],
    columns: ['Edad', 'Cantidad'],
    options: {
      legend: { position: 'none' },
      animation: { duration: 500, easing: 'out' }
    }
  });

  totalInscriptionsChartData = signal<any>({
    type: 'Gauge',
    data: [['Inscripciones', 0]],
    options: {
      width: 400,
      height: 300,
      max: 100,
      min: 0,
      greenFrom: 0,
      greenTo:   100,
      minorTicks: 5
    }
  });

  gendersDistributionChartData = signal<any>({
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
    this.kpiService.kpiDisciplineGetAgeDistribution(this.disciplineId, this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          const chartData = data.map(item => [item.age, item.count]);
          this.ageDistributionChartData.update(prev => ({ ...prev, data: chartData }));
        },
        error: (err) => console.error('Error loading age distribution', err)
      });

    this.kpiService.kpiDisciplineGetInscriptionsQuantity(this.disciplineId, this.fromDate, this.toDate)
      .subscribe({
        next: (total) => {
          this.totalInscriptionsChartData.update(prev => ({
            ...prev,
            data: [['Inscripciones', total]]
          }));
        },
        error: (err) => console.error('Error loading total inscriptions', err)
      });

    this.kpiService.kpiDisciplineGetInscriptionsQuantityForeachGender(this.disciplineId, this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          //console.log("kpiDisciplineGetInscriptionsQuantityForeachGender: ", data);
          this.gendersDistributionChartData.update(prev => ({
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
