import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class ColorService {
    colorList =
    [ 'rgba(255, 99, 71, 0.2)',
      'rgba(30, 160, 14, 0.2)',
      'rgba(184, 19, 71, 0.2)',
      'rgba(111, 78, 14, 0.2)',
      'rgba(25, 99, 92, 0.2)',
      'rgba(200, 50, 14, 0.2)',
      'rgba(25, 99, 71, 0.2)',
      'rgba(115, 240, 14, 0.2)',
      'rgba(182, 16, 140, 0.2)',
      'rgba(76, 99, 7, 0.2)',
      'rgba(25, 160, 14, 0.2)',
      'rgba(46, 99, 71, 0.2)',
      'rgba(182, 160, 22, 0.2)',
      'rgba(83, 45, 71, 0.2)',
      'rgba(103, 160, 14, 0.2)',
      
      
    
    ];
    constructor() { }

    getColorFor(index: number): string {
        return this.colorList[index % this.colorList.length];
    }

}
