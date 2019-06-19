import { Component, OnInit, Input } from '@angular/core';
import { ListItem } from '../../models/list-item.model';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

    @Input() public title!: string;
    @Input() public items!: ListItem[];

    constructor() { }

    ngOnInit() {
    }

}
