import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  constructor(private fs: AngularFirestore, private storage: AngularFireStorage) { }

  getAllGoods() {
    return this.fs.collection('goods').snapshotChanges()
  }

  addNewGood(name: string, price: Number,color: string, size: string, image: File) {
    return new Promise((resolve) => {
      let ref = this.storage.ref('goods/' + image.name)
      ref.put(image).then(() => {
        ref.getDownloadURL().subscribe(photoUrl => {
          this.fs.collection('goods').add({
            name,
            price,
            color,
            size,
            photoUrl
          }).then(() => resolve('hello'))
        })
      })
    })
  }

  delete(id) {
    return this.fs.doc(`goods/${id}`).delete()
  }
  update(id,name,price,color,size) {
    return this.fs.doc(`goods/${id}`).update({
      name,price,color,size
    })
  }
}
