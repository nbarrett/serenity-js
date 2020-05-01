import { actorCalled, engage } from '@serenity-js/core';
import { Navigate, UseAngular } from '@serenity-js/protractor';
import 'jasmine';
import { Actors } from '../src';
import { RunsTask } from '../src/RunsTask';

describe('serenity-js.org website', () => {

    beforeEach(() => engage(new Actors()));

    it(`tells people what they're reading @wip`, () =>
        actorCalled('Jasmine').attemptsTo(
            UseAngular.disableSynchronisation(),
            Navigate.to('https://serenity-js.org'),
            RunsTask.thatReturnsRejectedPromise(),
        ));
});
