// pages/imgs/picture.js
Page({
  data:{
    scrollLeft: 0
  },
  tap(e){
    console.log('ss');
    this.setData({
      scrollLeft: this.data.scrollLeft + 200
    })
  }
})