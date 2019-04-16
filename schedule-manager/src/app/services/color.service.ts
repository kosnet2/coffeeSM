import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class ColorService {
    colorList =
    [ '#FF5733',
      '#BB8FCE',
      '#F4D03F',
      '#C0392B',
      '#E74C3C',
      '#E8DAEF',
      '#7D6608',
      '#7B7D7D',
      '#566573',
      '#D5DBDB',
      '#154360',
      '#D5D8DC',
      '#9A7D0A',
      '#CCD1D1',
      '#17202A',
      '#641E16'
    ];
    constructor() { }

    getColorFor(index: number): string {
        return this.colorList[index % this.colorList.length];
    }

}
