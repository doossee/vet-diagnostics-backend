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
import { MedicalSessionModule } from './medical-session/medical-session.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AnomalyDetectionModule } from './anomaly-detection/anomaly-detection.module';
import { BodyPositionModule } from './body-position/body-position.module';
import { BodyTypeModule } from './body-type/body-type.module';
import { ConstitutionModule } from './constitution/constitution.module';
import { DownTypeModule } from './down-type/down-type.module';
import { FeatherTypeModule } from './feather-type/feather-type.module';
import { HairTypeModule } from './hair-type/hair-type.module';
import { LymphConsistencyModule } from './lymph-consistency/lymph-consistency.module';
import { LymphMobilityModule } from './lymph-mobility/lymph-mobility.module';
import { LymphPainModule } from './lymph-pain/lymph-pain.module';
import { LymphShapeModule } from './lymph-shape/lymph-shape.module';
import { LymphSizeModule } from './lymph-size/lymph-size.module';
import { LymphSurfaceModule } from './lymph-surface/lymph-surface.module';
import { LymphTempModule } from './lymph-temp/lymph-temp.module';
import { MucosaTypeModule } from './mucosa-type/mucosa-type.module';
import { ObesityTypeModule } from './obesity-type/obesity-type.module';
import { SkinColorModule } from './skin-color/skin-color.module';
import { SkinElasticityModule } from './skin-elasticity/skin-elasticity.module';
import { SkinHumidityModule } from './skin-humidity/skin-humidity.module';
import { SkinPainModule } from './skin-pain/skin-pain.module';
import { SkinSensitivityModule } from './skin-sensitivity/skin-sensitivity.module';
import { SkinSmellModule } from './skin-smell/skin-smell.module';
import { SkinSurfaceModule } from './skin-surface/skin-surface.module';
import { SkinTempModule } from './skin-temp/skin-temp.module';
import { TemperamentModule } from './temperament/temperament.module';
import { WoolTypeModule } from './wool-type/wool-type.module';
import { RumenFluidStateModule } from './rumen-fluid-state/rumen-fluid-state.module';
import { StatisticsModule } from './statistics/statistics.module';

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
    MedicalSessionModule,
    FeedbackModule,
    AnomalyDetectionModule,
    BodyPositionModule,
    BodyTypeModule,
    ConstitutionModule,
    DownTypeModule,
    FeatherTypeModule,
    HairTypeModule,
    LymphConsistencyModule,
    LymphMobilityModule,
    LymphPainModule,
    LymphShapeModule,
    LymphSizeModule,
    LymphSurfaceModule,
    LymphTempModule,
    MucosaTypeModule,
    ObesityTypeModule,
    SkinColorModule,
    SkinElasticityModule,
    SkinHumidityModule,
    SkinPainModule,
    SkinSensitivityModule,
    SkinSmellModule,
    SkinSurfaceModule,
    SkinTempModule,
    TemperamentModule,
    WoolTypeModule,
    RumenFluidStateModule,
    StatisticsModule,
  ],
})
export class DiagnosticsModule {}
