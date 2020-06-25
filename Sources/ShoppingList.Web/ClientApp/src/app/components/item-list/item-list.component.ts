import { Component, OnInit, Input } from '@angular/core';
import { ShoppingItem } from '../../models/shopping-item.model';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

    @Input() public title!: string;
    @Input() public items!: ShoppingItem[];

    constructor() { }

    ngOnInit() {
    }

}
