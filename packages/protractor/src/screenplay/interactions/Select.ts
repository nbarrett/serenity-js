import { AnswersQuestions, Question } from '@serenity-js/core';
import { Interaction, UsesAbilities } from '@serenity-js/core/lib/screenplay';
import { by, ElementFinder, protractor } from 'protractor';
import { promiseOf } from '../../promiseOf';
import { withAnswerOf } from '../withAnswerOf';

export class Select {
    static theValue(value: string) {
        return {from: (target: Question<ElementFinder> | ElementFinder): Interaction => new SelectOption(value, target)};
    }

    static theValues(...values: string[]) {
        return {from: (target: Question<ElementFinder> | ElementFinder): Interaction => new SelectOptions(values, target)};
    }

    static theVisibleText(...values: string[]) {
        return {from: (target: Question<ElementFinder> | ElementFinder): Interaction => new SelectVisibleText(values, target)};
    }
}

class SelectOption implements Interaction {
    performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        return promiseOf(withAnswerOf(actor, this.target, element => element
            .element(by.css(`option[value=${this.value}]`)))
            .click());
    }

    constructor(private value: string, private target: Question<ElementFinder> | ElementFinder) {
    }

    toString = () => `#actor selects "${this.value}" from ${this.target}`;
}

class SelectOptions implements Interaction {
    performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {

        const hasRequiredValue = (option: ElementFinder) => option.getAttribute('value').then(value => !!~this.values.indexOf(value)),
            isAlreadySelected = (option: ElementFinder) => option.isSelected(),
            ensureOnlyOneApplies = (list: boolean[]) => list.filter(_ => _ === true).length === 1,
            select = (option: ElementFinder) => option.click();

        const optionsToClick = (option: ElementFinder) => protractor.promise.all([
            hasRequiredValue(option),
            isAlreadySelected(option),
        ])
            .then(ensureOnlyOneApplies);

        return promiseOf(withAnswerOf(actor, this.target, element => element.all(by.css('option'))
            .filter(optionsToClick)
            .each(select)));
    }

    constructor(private values: string[], private target: Question<ElementFinder> | ElementFinder) {
    }

    toString = () => `#actor selects "${this.values}" from ${this.target}`;
}

class SelectVisibleText implements Interaction {
    performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {

        const hasRequiredText = (option: ElementFinder) => option.getText().then(value => !!~this.values.indexOf(value)),
            isAlreadySelected = (option: ElementFinder) => option.isSelected(),
            ensureOnlyOneApplies = (list: boolean[]) => list.filter(_ => _ === true).length === 1,
            select = (option: ElementFinder) => option.click();

        const optionsToClick = (option: ElementFinder) => protractor.promise.all([
            hasRequiredText(option),
            isAlreadySelected(option),
        ])
            .then(ensureOnlyOneApplies);

        return promiseOf(withAnswerOf(actor, this.target, element => element.all(by.css('option'))
            .filter(optionsToClick)
            .each(select)));
    }

    constructor(private values: string[], private target: Question<ElementFinder> | ElementFinder) {
    }

    toString = () => `#actor selects "${this.values}" from ${this.target}`;
}
