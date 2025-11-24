import { Module } from '@nestjs/common';
import { BloodExamModule } from './blood-exam/blood-exam.module';
import { ClinicalExamModule } from './clinical-exam/clinical-exam.module';
import { FecesExamModule } from './feces-exam/feces-exam.module';
import { MucosaExamModule } from './mucosa-exam/mucosa-exam.module';
import { UrineExamModule } from './urine-exam/urine-exam.module';
import { UrineColorModule } from './urine-color/urine-color.module';
import { UrineSmellModule } from './urine-smell/urine-smell.module';
import { UrineClarityModule } from './urine-clarity/urine-clarity.module';
import { UrineConsistencyModule } from './urine-consistency/urine-consistency.module';
import { FecesColorModule } from './feces-color/feces-color.module';
import { FecesSmellModule } from './feces-smell/feces-smell.module';
import { FecesConsistencyModule } from './feces-consistency/feces-consistency.module';
import { FecesFormModule } from './feces-form/feces-form.module';
import { MucosaAppearanceModule } from './mucosa-appearance/mucosa-appearance.module';

@Module({
  imports: [
    BloodExamModule,
    ClinicalExamModule,
    FecesExamModule,
    MucosaExamModule,
    UrineExamModule,
    UrineColorModule,
    UrineSmellModule,
    UrineClarityModule,
    UrineConsistencyModule,
    FecesColorModule,
    FecesSmellModule,
    FecesConsistencyModule,
    FecesFormModule,
    MucosaAppearanceModule,
  ],
})
export class DiagnosticsModule {}
