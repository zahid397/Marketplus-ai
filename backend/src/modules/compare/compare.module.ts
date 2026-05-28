import { Module } from '@nestjs/common'
import { CompareController } from './compare.controller'
import { CompareService } from './compare.service'
import { AnalyzeModule } from '../analyze/analyze.module'

@Module({ imports: [AnalyzeModule], controllers: [CompareController], providers: [CompareService] })
export class CompareModule {}
