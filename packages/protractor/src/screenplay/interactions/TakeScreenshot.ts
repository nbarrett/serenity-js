import { Answerable, AnswersQuestions, CollectsArtifacts, Interaction, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';
import { Name, Photo } from '@serenity-js/core/lib/model';
import { BrowseTheWeb } from '../abilities';

export class TakeScreenshot extends Interaction {
    static of(name: Answerable<string>): Interaction {
        return new TakeScreenshot(name);
    }

    constructor(private readonly name: Answerable<string>) {
        super();
    }

    performAs(actor: UsesAbilities & AnswersQuestions & CollectsArtifacts): PromiseLike<void> {

        const ignoreBrowserNotAvailableForPhotosButReportAnyOther = (error: Error) => {
            // todo: this needs further investigation; sometimes webdriver session dies before we can take a screenshot
            if (~error.message.indexOf('does not have a valid session ID') || ~error.message.indexOf('Session ID is null')) {
                // tslint:disable-next-line:no-console
                console.warn(`[TakeScreenshot] Looks like there was a problem with taking a photo of ${ actor }: `, error.message);
                return undefined;
            } else if (/unexpected alert open/.test(error.message)) {
                // tslint:disable-next-line:no-console
                console.warn(`[TakeScreenshot] skipping photo attempt for ${ actor } following : `, error.message);
                return undefined;
            }

            throw error;
        };

        return Promise.all([
            BrowseTheWeb.as(actor).takeScreenshot(),
            actor.answer(this.name),
        ]).then(([ screenshot, name ]) => actor.collect(
            Photo.fromBase64(screenshot),
            new Name(name),
        )).catch(ignoreBrowserNotAvailableForPhotosButReportAnyOther);
    }

    toString(): string {
        return formatted `#actor takes a screenshot of ${this.name}`;
    }
}
