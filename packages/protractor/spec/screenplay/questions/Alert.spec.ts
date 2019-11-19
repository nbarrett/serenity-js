import { stage } from '@integration/testing-tools';
import { Ensure, equals } from '@serenity-js/assertions';
import { by } from 'protractor';
import { Click, Navigate } from '../../../src/screenplay/interactions';
import { Alert, Target } from '../../../src/screenplay/questions';
import { pageFromTemplate } from '../../fixtures';
import { UIActors } from '../../UIActors';

describe('Alert', () => {

    const Nick = stage(new UIActors()).actor('Nick');
    const alertTargets = {
        trigger: Target.the('alert trigger').located(by.id('alert-demo-trigger')),
        textResult: Target.the('text of the alert clicking result').located(by.id('alert-demo-result')),
    };

    /** @test {Attribute} */
    it('allows the actor to determine that alert visibility is false', () => Nick.attemptsTo(
        Navigate.to(pageFromTemplate(`
        <html lang="en" />
    `)),
        Ensure.that(Alert.visibility(), equals(false)),
    ));

    it('allows the actor to determine that alert visibility is false', () => Nick.attemptsTo(
        Navigate.to(pageFromTemplate(`
    <!DOCTYPE html>
        <html>
            <body>
                <p>Test page for <a href="./Alert.spec.ts">alert visibility unit test</a></p>
                <button id="alert-demo-trigger" onclick="myFunction()">Trigger Alert</button>
                <p id="alert-demo-result"></p>
                <script>
                    function myFunction() {
                        var resultText;
                        var response = confirm("Press OK or Cancel");
                        if (response) {
                            resultText = "You pressed OK!";
                        } else {
                            resultText = "You pressed Cancel!";
                        }
                        document.getElementById("alert-demo-result").innerHTML = resultText;
                    }
                </script>

            </body>
        </html>
`)),
        Click.on(alertTargets.trigger),
        Ensure.that(Alert.visibility(), equals(true)),
    ));

});
