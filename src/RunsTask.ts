import { AnswersQuestions, PerformsActivities, Task, UsesAbilities } from '@serenity-js/core';

export class RunsTask implements Task {

    static thatReturnsRejectedPromise = () => new RunsTask();

    performAs(actor: PerformsActivities & UsesAbilities & AnswersQuestions): Promise<void> {
        return Promise.reject('should exit gracefully');
    }

    toString() {
        return '#actor encounters a rejected promise';
    }

}
