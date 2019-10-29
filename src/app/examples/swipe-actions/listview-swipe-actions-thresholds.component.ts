import { Component, OnInit, ViewChild } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { DataItem } from "../dataItem";
import { DataItemService } from "../dataItem.service";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { View } from "tns-core-modules/ui/core/view";
import { layout } from "tns-core-modules/utils/utils";

@Component({
    moduleId: module.id,
    selector: "tk-listview-swipe-actions-thresholds",
    providers: [DataItemService],
    templateUrl: "listview-swipe-actions-thresholds.component.html",
    styleUrls: ["listview-swipe-actions-thresholds.component.css"]
})
export class ListViewSwipeActionsThresholdsComponent implements OnInit {
    private _dataItems: ObservableArray<DataItem>;
    private leftThresholdPassed = false;
    private rightThresholdPassed = false;

    constructor(private _dataItemService: DataItemService) {
    }

    get dataItems(): ObservableArray<DataItem> {
        return this._dataItems;
    }

    @ViewChild("myListView", { read: RadListViewComponent, static: false }) myListViewComponent: RadListViewComponent;

    ngOnInit() {
        this._dataItems = new ObservableArray(this._dataItemService.getPostDataItems());
    }

    // >> angular-listview-swipe-action-thresholds
    public onCellSwiping(args: ListViewEventData) {
        const swipeLimits = args.data.swipeLimits;
        const swipeView = args['swipeView'];
        const mainView = args['mainView'];
        const leftItem = swipeView.getViewById('mark-view');
        const rightItem = swipeView.getViewById('delete-view');

        if (args.data.x > swipeView.getMeasuredWidth() / 4 && !this.leftThresholdPassed) {
            console.log("Notify perform left action");
            const markLabel = leftItem.getViewById('mark-text');
            this.leftThresholdPassed = true;
        } else if (args.data.x < -swipeView.getMeasuredWidth() / 4 && !this.rightThresholdPassed) {
            const deleteLabel = rightItem.getViewById('delete-text');
            console.log("Notify perform right action");
            this.rightThresholdPassed = true;
        }
        if (args.data.x > 0) {
            const leftDimensions = View.measureChild(
                leftItem.parent,
                leftItem,
                layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
                layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY));
            View.layoutChild(leftItem.parent, leftItem, 0, 0, leftDimensions.measuredWidth, leftDimensions.measuredHeight);
        } else {
            const rightDimensions = View.measureChild(
                rightItem.parent,
                rightItem,
                layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
                layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY));

            View.layoutChild(rightItem.parent, rightItem, mainView.getMeasuredWidth() - rightDimensions.measuredWidth, 0, mainView.getMeasuredWidth(), rightDimensions.measuredHeight);
        }
    }
    // << angular-listview-swipe-action-thresholds

    // >> angular-listview-swipe-action-thresholds-limits
    public onSwipeCellStarted(args: ListViewEventData) {
        const swipeLimits = args.data.swipeLimits;
        const swipeView = args['object'];
        const leftItem = swipeView.getViewById('mark-view');
        const rightItem = swipeView.getViewById('delete-view');
        swipeLimits.left = swipeLimits.right = args.data.x > 0 ? swipeView.getMeasuredWidth() / 2 : swipeView.getMeasuredWidth() / 2;
        swipeLimits.threshold = swipeView.getMeasuredWidth();
    }
    // << angular-listview-swipe-action-thresholds-limits

    // >> angular-listview-swipe-actions-execute
    public onSwipeCellFinished(args: ListViewEventData) {
        const swipeView = args['object'];
        const leftItem = swipeView.getViewById('mark-view');
        const rightItem = swipeView.getViewById('delete-view');
        if (this.leftThresholdPassed) {
            console.log("Perform left action");
        } else if (this.rightThresholdPassed) {
            console.log("Perform right action");
        }
        this.leftThresholdPassed = false;
        this.rightThresholdPassed = false;
    }
    // << angular-listview-swipe-actions-execute

    public onLeftSwipeClick(args: ListViewEventData) {
        console.log("Left swipe click");
        this.myListViewComponent.listView.notifySwipeToExecuteFinished();
    }

    public onRightSwipeClick(args) {
        console.log("Right swipe click");
        this.dataItems.splice(this.dataItems.indexOf(args.object.bindingContext), 1);
    }
}
