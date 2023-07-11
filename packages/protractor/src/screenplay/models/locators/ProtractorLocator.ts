import type { PageElement, RootLocator, Selector } from '@serenity-js/web';
import { Locator } from '@serenity-js/web';
import type * as protractor from 'protractor';

import { unpromisedWebElement } from '../../unpromisedWebElement';
import type { ProtractorErrorHandler } from '../ProtractorErrorHandler';
import { ProtractorPageElement } from '../ProtractorPageElement';
import type { ProtractorRootLocator } from './ProtractorRootLocator';
import { ProtractorSelectors } from './ProtractorSelectors';

/**
 * Protractor-specific implementation of {@apilink Locator}.
 *
 * @group Models
 */
export class ProtractorLocator extends Locator<protractor.ElementFinder, protractor.Locator> {

    constructor(
        parent: RootLocator<protractor.ElementFinder>,
        selector: Selector,
        private readonly errorHandler: ProtractorErrorHandler,
    ) {
        super(parent, selector);
    }

    protected nativeSelector(): protractor.Locator {
        return ProtractorSelectors.locatorFrom(this.selector);
    }

    async isPresent(): Promise<boolean> {
        try {
            const element = await this.resolveNativeElement();
            return Boolean(element);
        }
        catch {
            return false;
        }
    }

    async nativeElement(): Promise<protractor.ElementFinder> {
        try {
            return await this.resolveNativeElement();
        }
        catch (error) {
            return await this.errorHandler.executeIfHandled(error, () => this.resolveNativeElement());
        }
    }

    private async resolveNativeElement(): Promise<protractor.ElementFinder> {
        const parent = await this.parent.nativeElement();
        const result = await unpromisedWebElement(parent.element(this.nativeSelector()));

        // checks if the element can be interacted with; in particular, throws unexpected alert present if there is one
        await result.isPresent();

        return result;
    }

    async allNativeElements(): Promise<Array<protractor.ElementFinder>> {
        const parent = await this.parent.nativeElement();
        return parent.all(this.nativeSelector()) as unknown as Array<protractor.ElementFinder>;
    }

    of(parent: ProtractorLocator): Locator<protractor.ElementFinder, protractor.Locator> {
        return new ProtractorLocator(parent, this.selector, this.errorHandler);
    }

    locate(child: ProtractorLocator): Locator<protractor.ElementFinder, any> {
        return new ProtractorLocator(this, child.selector, this.errorHandler);
    }

    element(): PageElement<protractor.ElementFinder> {
        return new ProtractorPageElement(this);
    }

    async allElements(): Promise<Array<PageElement<protractor.ElementFinder>>> {
        const elements      = await this.allNativeElements();

        return Promise.all(elements.map(childElement =>
            new ProtractorPageElement(
                new ProtractorExistingElementLocator(
                    this.parent as ProtractorRootLocator,
                    this.selector,
                    this.errorHandler,
                    unpromisedWebElement(childElement)
                )
            )
        ));
    }
}

/**
 * @internal
 */
export class ProtractorExistingElementLocator extends ProtractorLocator {
    constructor(
        parent: ProtractorRootLocator,
        selector: Selector,
        errorHandler: ProtractorErrorHandler,
        private readonly existingNativeElement: protractor.ElementFinder,
    ) {
        super(parent, selector, errorHandler);
    }

    async nativeElement(): Promise<protractor.ElementFinder> {
        return this.existingNativeElement;
    }

    async allNativeElements(): Promise<Array<protractor.ElementFinder>> {
        return [ this.existingNativeElement ];
    }
}
