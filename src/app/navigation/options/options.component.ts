import { Component, OnInit, OnDestroy, Injectable, ViewChild } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ActivatedRoute } from '@angular/router';
import * as frameModule from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { OptionsService } from "../../navigation/options/options.service";

@Component({
    moduleId: module.id,
    selector: "tk-options",
    templateUrl: "options.component.html",
    styleUrls: ["options.component.css"]
})
@Injectable()
export class OptionsComponent implements OnInit, OnDestroy {
    private _dataItems: ObservableArray<string>;
    private _sub: any;
    private _selectedIndex: number = -1;

    constructor(private _page: Page, private _route: ActivatedRoute, private _optionsService: OptionsService) {
        this._dataItems = new ObservableArray<string>();
    }

    @ViewChild("optionsListView", { read: RadListViewComponent, static: false }) optionsListView: RadListViewComponent;

    ngOnInit() {
        this._sub = this._route.queryParams.subscribe(
            (params: any) => {
                const items = params['items'];
                this._selectedIndex = +params['selectedIndex'];
                if (items) {
                    const splitItems = items.toString().split(',');
                    this._dataItems = new ObservableArray<string>(splitItems);
                    this.tryUpdateListViewSelection();
                }
            }
        );
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    public onLoaded() {
        this.tryUpdateListViewSelection();
    }

    private tryUpdateListViewSelection() {
        if (this._selectedIndex >= 0 && this.optionsListView && this.optionsListView.nativeElement) {
            this.optionsListView.nativeElement.selectItemAt(this._selectedIndex);
        }
    }

    get dataItems(): ObservableArray<string> {
        return this._dataItems;
    }


    public onItemTap(args) {
        const selectedItems = this.optionsListView.nativeElement.getSelectedItems() as Array<string>;
        this._optionsService.paramValue = selectedItems[0];
        frameModule.topmost().goBack();
    }
}