import { Component, OnInit } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { DataItem } from "../dataItem";
import { DataItemService } from "../dataItem.service";
import { ListViewEventData } from "nativescript-ui-listview";
import { isIOS } from "tns-core-modules/ui/page/page";

@Component({
    moduleId: module.id,
    selector: "tk-listview-item-reorder",
    providers: [DataItemService],
    templateUrl: "listview-item-reorder.component.html",
    styleUrls: ["listview-item-reorder.component.css"]
})
// >> angular-listview-reorder-component
export class ListViewItemReorderComponent implements OnInit {
    private _dataItems: ObservableArray<DataItem>;
    private platform = isIOS ? "IOS" : "Android";

    constructor(private _dataItemService: DataItemService) {}

    get dataItems(): ObservableArray<DataItem> {
        return this._dataItems;
    }

    ngOnInit() {
        this._dataItems = new ObservableArray(
            this._dataItemService.getPersonDataItems()
        );
    }

    public onItemReordered(args: ListViewEventData) {
        console.log(
            "Item reordered. Old index: " +
                args.index +
                " " +
                "new index: " +
                args.data.targetIndex
        );
    }

    reorderStarting(args) {
        console.log(`On ${this.platform} reorder starting called`);
    }

    reorderStarted(args) {
        console.log(`On ${this.platform} reorder started called`);
    }
    reordered(args) {
        console.log(`On ${this.platform} reordered called`);
    }
    hold(args) {
        console.log(`On ${this.platform} item hold called`);
    }
}
// << angular-listview-reorder-component
