import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { ElementFinder } from 'protractor';
import { promiseOf } from '../../promiseOf';
import { withAnswerOf } from '../withAnswerOf';

export class SelectedValue implements Question<Promise<string>> {
  static of = (target: Question<ElementFinder> | ElementFinder) => new SelectedValue(target);

  answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
    return promiseOf(withAnswerOf(actor, this.target, element => element.$('option:checked').getAttribute('value')));
  }

  constructor(private target: Question<ElementFinder> | ElementFinder) {
  }

  toString = () => `the selected value of ${this.target}`;
}

export class SelectedValues implements Question<Promise<string[]>> {
  static of(target: Question<ElementFinder> | ElementFinder) {
    return new SelectedValues(target);
  }

  answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string[]> {
    return promiseOf(withAnswerOf(actor, this.target, element => element.$$('option')
        .filter(option => option.isSelected())
        .map(values => values.getAttribute('value'))));
  }

  constructor(private target: Question<ElementFinder> | ElementFinder) {
  }

  toString = () => `the selected values of ${this.target}`;
}
