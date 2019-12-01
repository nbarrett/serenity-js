import { stage } from '@integration/testing-tools';
import { contain, Ensure, equals } from '@serenity-js/assertions';
import { by } from 'protractor';
import { Navigate, Select, SelectedVisibleText, SelectedVisibleTextItems, Target } from '../../../src';
import { pageFromTemplate } from '../../fixtures';
import { UIActors } from '../../UIActors';

describe('SelectedVisibleText', () => {

    const Nick = stage(new UIActors()).actor('Nick');

    class SingleCountry {
        static Selector = Target.the('country selector').located(by.id('single-option'));
    }

    /** @test {SelectedVisibleText} */
    const pageWithSingleSelect = `
    <html>
        <body>
        <form>
            <fieldset name="options">
                <legend>Working with single option</legend>
                <label for="single-option">
                    Country
                    <select id="single-option">
                        <option label="United Kingdom" value="GB" selected="selected">United Kingdom</option>
                        <option label="Poland" value="PL" selected="selected">Poland</option>
                        <option label="Germany" value="DE" selected="selected">Germany</option>
                        <option label="France" value="FR">France</option>
                    </select>
                </label>
            </fieldset>
        </form>
        </body>
    </html>`;
    /** @test {SelectedVisibleText.of} */
    it('of by means of visible text', () => Nick.attemptsTo(
        Navigate.to(pageFromTemplate(pageWithSingleSelect)),
        Select.theVisibleText('France').from(SingleCountry.Selector),
        Ensure.that(SelectedVisibleText.of(SingleCountry.Selector), equals('France'))));

});

describe('SelectedVisibleTextItems', () => {

    const Nick = stage(new UIActors()).actor('Nick');

    class MultiCountry {
        static Selector = Target.the('country selector').located(by.id('multiple-options'));
    }

    /** @test {SelectedVisibleText} */
    const pageWithMultipleSelects = `
    <html>
        <body>
        <form>
            <fieldset name="options">
                <legend>Working with options</legend>
                <label for="multiple-options">
                    Country
                    <select multiple="" id="multiple-options">
                        <option label="United Kingdom" value="GB">United Kingdom</option>
                        <option label="Poland" value="PL">Poland</option>
                        <option label="Germany" value="DE">Germany</option>
                        <option label="France" value="FR">France</option>
                    </select>
                </label>
            </fieldset>
        </form>
        </body>
    </html>`;
    /** @test {SelectedVisibleText.of} */
    it('of by means of visible text', () => Nick.attemptsTo(
        Navigate.to(pageFromTemplate(pageWithMultipleSelects)),
        Select.theVisibleText('Poland', 'France').from(MultiCountry.Selector),
        Ensure.that(SelectedVisibleTextItems.of(MultiCountry.Selector), equals(['Poland', 'France']))));

});
