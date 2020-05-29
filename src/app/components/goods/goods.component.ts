import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GoodsService } from 'src/app/services/goods.service';
import { Good } from 'src/app/interfaces/good.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class GoodsComponent implements OnInit {

  goods: Good[] = []
  goodsObservable: Subscription

  @ViewChild('image') image: ElementRef

  constructor(private gs: GoodsService) { }
  ngOnInit() {
    this.goodsObservable = this.gs.getAllGoods().subscribe(data => {
      this.goods = data.map(element => {
        return {
          id: element.payload.doc.id,
          name: element.payload.doc.data()['name'],
          price: element.payload.doc.data()['price'],
          color: element.payload.doc.data()['color'],
          size: element.payload.doc.data()['size'],
          photoUrl: element.payload.doc.data()['photoUrl'],
        }
      })
    })
  }

  ngOnDestroy() {
    this.goodsObservable.unsubscribe()
  }

  addNewGood(form: NgForm) {
    let name = (<Good>form.value).name,
        color = (<Good>form.value).color,
        size = (<Good>form.value).size,
        price = (<Good>form.value).price,
        image = (<HTMLInputElement>this.image.nativeElement).files[0];
    this.gs.addNewGood(name, price ,color , size,image).then(msg => console.log(msg))
  }
  delete(index) {
    this.gs.delete(this.goods[index].id)
  }
  save(index) {
    this.gs.update(this.goods[index].id, this.goods[index].name, this.goods[index].price,this.goods[index].color,this.goods[index].size,)
  }


}
