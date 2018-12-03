import { NgModule } from '@angular/core';
import { CoverPathPipe } from './cover-path/cover-path';
import { SplitPipe } from './split/split';
import { NumberTransitionPipe } from './number-transition/number-transition';
import { ReplacePipe } from './replace/replace';
import { TrustHtmlPipe } from './trust-html/trust-html';
import {CoverHeadImpPathPipe} from "./cover-path/cover-headImpPath";
import {KeywordMarkUpPipe} from "./cover-path/keyword_Mark_up";
import {LimitLengthPipe} from "./string-Pipe/limit-Length";
import { PersonPathPipe } from './person-path/person-path';
import {SurveyStatisticsPipe} from "./survey-statistics-Pipe/survey-statistics-Pipe";
import {LimitTitleLengthPipe} from "./string-Pipe/limit-title-Length";
import {LimitTimeLengthPipe} from "./string-Pipe/limit-time-Length";
import {OptionTextPipe} from "./option-text/option-text";
import {WeekPipe} from "./week-Pipe/week";
import {DateDifferencePipe} from "./date-difference-Pipe/date-difference";
import {SigninTypePipe} from "./signin-type/signin-type";
import {UserStatusPipe} from "./user-status-Pipe/user-status-Pipe";
import {TestPipe} from "./testPipe/testPipe";
@NgModule({
  declarations:
    [
      CoverPathPipe,
      CoverHeadImpPathPipe,
      SplitPipe,
      NumberTransitionPipe,
      ReplacePipe,
      TrustHtmlPipe,
      KeywordMarkUpPipe,
      LimitLengthPipe,
      SurveyStatisticsPipe,
      PersonPathPipe,
      LimitTitleLengthPipe,
      LimitTimeLengthPipe,
      OptionTextPipe,
      WeekPipe,
      DateDifferencePipe,
      SigninTypePipe,
      UserStatusPipe,
      TestPipe
    ],
  imports: [],
  exports:
    [
      CoverPathPipe,
      CoverHeadImpPathPipe,
      SplitPipe,
      NumberTransitionPipe,
      ReplacePipe,
      TrustHtmlPipe,
      KeywordMarkUpPipe,
      LimitLengthPipe,
      SurveyStatisticsPipe,
      PersonPathPipe,
      LimitTitleLengthPipe,
      LimitTimeLengthPipe,
      OptionTextPipe,
      WeekPipe,
      DateDifferencePipe,
      SigninTypePipe,
      UserStatusPipe,
      TestPipe
    ]
})
export class PipesModule {}
