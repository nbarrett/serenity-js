import { cucumberEventProtocolAdapter } from './CucumberEventProtocolAdapter';
import { Dependencies } from './Dependencies';

export = function (dependencies: Dependencies) {

    dependencies.cucumber.defineSupportCode(({ After, AfterAll }) => {
        After(function () {
            dependencies.notifier.currentScenarioFinishes();

            return dependencies.serenity.waitForNextCue();
        });

        AfterAll(function () {
            dependencies.notifier.testRunFinished();
        });
    });

    return cucumberEventProtocolAdapter(dependencies);
};
