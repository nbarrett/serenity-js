import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { ElementFinder } from 'protractor';
import { promiseOf } from '../../promiseOf';
import { withAnswerOf } from '../withAnswerOf';

export class SelectedVisibleText implements Question<Promise<string>> {
    static of(target: Question<ElementFinder> | ElementFinder) {
        return new SelectedVisibleText(target);
    }

    answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
        return promiseOf(withAnswerOf(actor, this.target, element => element.$('option:checked').getText()));
    }

    constructor(private target: Question<ElementFinder> | ElementFinder) {
    }

    toString = () => `the selected visible text of ${this.target}`;
}

export class SelectedVisibleTextItems implements Question<Promise<string[]>> {
    static of(target: Question<ElementFinder> | ElementFinder) {
        return new SelectedVisibleTextItems(target);
    }

    answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string[]> {
        return promiseOf(withAnswerOf(actor, this.target, element => element.$$('option')
            .filter(option => option.isSelected())
            .map(elements => elements.getText())));
    }

    constructor(private target: Question<ElementFinder> | ElementFinder) {
    }

    toString = () => `the selected visible text items of ${this.target}`;
}
