import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class ColorService {
    colorList =
    [ 'rgba(95, 99, 71, 0.2)',
      'rgba(30, 160, 14, 0.2)',
      'rgba(184, 19, 124, 0.2)',
      'rgba(111, 78, 14, 0.2)',
      'rgba(25, 99, 92, 0.2)',
      'rgba(200, 50, 14, 0.2)',
      'rgba(145, 99, 255, 0.2)',
      'rgba(115, 20, 114, 0.2)',
      'rgba(18, 16, 140, 0.2)',
      'rgba(76, 99, 7, 0.2)',
      'rgba(25, 160, 14, 0.2)',
      'rgba(46, 99, 33, 0.2)',
      'rgba(182, 16, 100, 0.2)',
      'rgba(3, 45, 71, 0.2)',
      'rgba(103, 160, 14, 0.2)',
      
      
    
    ];
    constructor() { }

    getColorFor(index: number): string {
        return this.colorList[index % this.colorList.length];
    }

}
