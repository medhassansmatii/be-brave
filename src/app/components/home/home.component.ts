import { Component, OnInit, OnDestroy } from '@angular/core';
import { Good } from 'src/app/interfaces/good.interface';
import { GoodsService } from 'src/app/services/goods.service';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit, OnDestroy {

  goods: Good[] = []
  goodsObservable: Subscription
  add: number = -1

  constructor(private gs: GoodsService, private cs: CartService, private as: AuthService, private router: Router ,config: NgbModalConfig, private modalService: NgbModal) {
        // customize default values of modals used by this component tree
        config.backdrop = 'static';
        config.keyboard = false;
     
   }

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

  addToCart(index: number) {
    if(this.as.userId) this.add = +index;
    else this.router.navigate(['/login']);
  }

  buy(amount: number) {
    let selectedGood = this.goods[this.add]
    let data = {
      name: selectedGood.name,
      amount: +amount,
      price: selectedGood.price,
      color: selectedGood.color,
      size: selectedGood.size
    }
    this.cs.addToCart(data).then(() => this.add = -1)
  }
  open(content) {
    this.modalService.open(content);
  }

}
