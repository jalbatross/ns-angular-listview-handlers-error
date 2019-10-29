import { ActivatedRoute } from "@angular/router";
import { Directive } from "@angular/core";
import { EventData } from "tns-core-modules/data/observable";
import { ad } from "tns-core-modules/utils/utils";
import { NavigationButton } from "tns-core-modules/ui/action-bar";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { android as androidApplication} from "tns-core-modules/application";

@Directive({
    selector: "[tkToggleNavButton]"
})

export class TKToggleNavButtonDirective {
    constructor(route: ActivatedRoute, page: Page, private routerExtensions: RouterExtensions) {
        let navigationButton = this.createNavigationButton();
        page.actionBar.navigationButton = navigationButton;
    }

    createNavigationButton(): NavigationButton {
        let navigationButton = new NavigationButton();
        navigationButton.visibility = "visible";

        if (androidApplication) {
            navigationButton.android.systemIcon = "ic_menu_back";
            navigationButton.on("tap", (args: EventData) => {
                ad.dismissSoftInput();
                this.routerExtensions.backToPreviousPage();
            });
        } else {
            navigationButton.text = "Back";
        }

        return navigationButton;
    }
}
