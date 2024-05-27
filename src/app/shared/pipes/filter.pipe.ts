import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tranfrompipe'
})
export class TranFrommTypePipe implements PipeTransform {
  transform(val: any): any {
    if(!val) return '';

    if (typeof(val) == 'number') {
      const decimalPipe = new DecimalPipe("en-US");
      val = decimalPipe.transform(val);
  
      return val;
    } 
   
    return val;
   }
}