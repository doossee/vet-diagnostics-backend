import { Module } from '@nestjs/common';
import { DiseaseModule } from './disease/disease.module';
import { DiseaseCategoryModule } from './disease-category/disease-category.module';
import { ProphylaxisModule } from './prophylaxis/prophylaxis.module';
import { ProphylaxisItemModule } from './prophylaxis-item/prophylaxis-item.module';
import { ProphylaxisDetailModule } from './prophylaxis-detail/prophylaxis-detail.module';

@Module({
  imports: [
    DiseaseModule,
    DiseaseCategoryModule,
    ProphylaxisModule,
    ProphylaxisItemModule,
    ProphylaxisDetailModule,
  ],
})
export class MedicalModule {}
