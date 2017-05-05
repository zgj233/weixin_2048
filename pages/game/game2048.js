// pages/game/game2048.js

Page({
  data: {
    items: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    touch_start_x: null,
    touch_end_x: null,
    touch_start_y: null,
    touch_end_y: null,
    touch_move_x: null,
    touch_move_y: null,

    rn:4, //总行数
    cn:4, //总列数
    RUNNING: 1,
    GAMEOVER: 0,
    score: 0, //分数
    state:null //状态 1 可以继续游戏 0 GameOver
  },

  touchStart(e) {
    this.setData({
      touch_start_x: e.touches[0].clientX,
      touch_start_y: e.touches[0].clientY
    })
  },

  touchEnd(e) {
    var self = this;
    self.setData({
      touch_end_x: e.changedTouches[0].clientX,
      touch_end_y: e.changedTouches[0].clientY
    });

    var x = self.data.touch_end_x - self.data.touch_start_x;  // x 轴移动的距离
    var y = self.data.touch_end_y - self.data.touch_start_y;  // y 轴移动的距离

    if (Math.abs(x) - Math.abs(y) > 10) {   //判断为水平方向的滑动
      if (x > 15) {
        console.log('向右');
        moveRight(self);
      }
      else if (x < -15) {
        console.log('向左');
        moveLeft(self);
      }
    }
    else if (Math.abs(y) - Math.abs(x) > 10) {   //判断为垂直方向的滑动
      if (y > 15) {
        console.log('向下');
        moveUp(self);
      }
      else if (y < -15) {
        console.log('向上');
        moveDown(self);
      }
    }


  },


  onload: function () {

  },
  onReady: function () {
    var self = this;
    GameStart(self);
  },
})

function GameStart(self) {//游戏开始
  console.log(self);
  
  
  self.data.state = self.data.RUNNING;
  self.data.items = [//初始化二维数组
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  self.data.score = 0; //重置分数为0
    //在两个随机位置生成2或4
  randomNum(self);
  randomNum(self);
  //将数据更新到页面
  updateView(self);
}

function isFull(self) {//判断当前数组是否已满
  for (var row = 0; row < self.data.rn; row++) {//遍历二维数组
    for (var col = 0; col < self.data.cn; col++) {
      // 只要发现当前元素==0
      if (self.data.items[row][col] == 0) {
        return false;
      }
    }
  }
  //(如果循环正常退出)
  return true;
}

function isGameOver(self){
  if (!isFull(self)) {
    return false;
  } else {//否则
    //从左上角第一个元素开始，遍历二维数组
    for (var row = 0; row < self.data.rn; row++) {
      for (var col = 0; col < self.data.cn; col++) {
        //如果当前元素不是最右侧元素
        if (col < self.data.cn - 1) {
          // 如果当前元素==右侧元素
          if (self.data.items[row][col] == self.data.items[row][col + 1]) {
            return false;
          }
        }
        //如果当前元素不是最下方元素
        if (row < self.data.rn - 1) {
          // 如果当前元素==下方元素
          if (self.data.items[row][col] == self.data.items[row + 1][col]) {
            return false;
          }
        }
      }
    } return true;
  }
}

function randomNum(self) {//在随机空位置生成一个数
  if (!isFull(self)) {//如果*不*满，才{
    while (true) {//循环true
      //0-3随机生成一个行号row
      var row = parseInt(Math.random() * self.data.rn);
      //0-3随机生成一个列号col
      var col = parseInt(Math.random() * self.data.cn);
      //如果data[row][col]==0
      if (self.data.items[row][col] == 0) {
        // Math.random():<0.5 >=0.5
        //     2  4
        // 随机生成一个数<0.5?2:4，
        // 放入data[row][col]
        self.data.items[row][col] = Math.random() < 0.5 ? 2 : 4;
        break;//退出循环
      }
    }
  }
}

function updateView(self) {
  //判断并修改游戏状态为GAMEOVER
  if (isGameOver()) {
    self.data.state = self.data.GAMEOVER;
  }
}

function getRightNext(self, row, col) {
  //循环变量:nextc——>指下一个元素的列下标
  //从col+1开始,遍历row行中剩余元素，<cn结束
  for (var nextc = col + 1; nextc < self.data.cn; nextc++) {
    // 如果遍历到的元素!=0
    if (self.data.items[row][nextc] != 0) {
      //  就返回nextc
      return nextc;
    }
  } return -1;//(循环正常退出，就)返回-1
}

/*判断并左移*指定行*中的每个元素*/
function moveLeftInRow(self,row) {
  //col从0开始，遍历row行中的每个元素，<cn-1结束
  for (var col = 0; col < self.datacn - 1; col++) {
    // 获得当前元素下一个不为0的元素的下标nextc
    var nextc = getRightNext(self, row, col);
    // 如果nextc==-1，(说明后边没有!=0的元素了)
    if (nextc == -1) {
      break;
    } else {// 否则
      //  如果当前位置==0,
      if (self.data.items[row][col] == 0) {
        //   将下一个位置的值，当入当前位置
        self.data.items[row][col] = self.data.items[row][nextc];
        //   下一个位置设置为0
        self.data.items[row][nextc] = 0;
        col--;//让col退一格，重复检查一次
      } else if (self.data.items[row][col] == self.data.items[row][nextc]) {
        //  否则，如果当前位置==nextc的位置
        //   将当前位置*=2;
        self.data.items[row][col] *= 2;
        //   下一个位置设置为0;
        self.data.items[row][nextc] = 0;
        //   将当前位置的值，累加到score上
        self.data.score += self.data.items[row][col];
      }
    }
  }
}

/*移动所有行*/
function moveLeft(self) {
  var oldStr = self.data.items.toString();
  //循环遍历每一行
  for (var row = 0; row < self.data.rn; row++) {
    // 调用moveLeftInRow方法，传入当前行号row
    moveLeftInRow(self,row);
  }//(循环结束后)
  var newStr = self.data.items.toString();
  if (oldStr != newStr) {
    //调用randomNum()，随机生成一个数
    randomNum(self);
    //调用updateView()，更行页面
    updateView(self);
  }
}

function moveRight(self) {
  var oldStr = self.data.items.toString();
  for (var row = 0; row < self.data.rn; row++) {
    moveRightInRow(self,row);
  }
  var newStr = self.data.items.toString();
  if (oldStr != newStr) {
    randomNum(self);
    updateView(self);
  }
}
/*判断并右移*指定行*中的每个元素*/
function moveRightInRow(self,row) {
  //col从cn-1开始，到>0结束
  for (var col = self.data.cn - 1; col > 0; col--) {
    var nextc = getLeftNext(self,row, col);
    if (nextc == -1) {
      break;
    } else {
      if (self.data.items[row][col] == 0) {
        self.data.items[row][col] =
            self.data.items[row][nextc];
        self.data.items[row][nextc] = 0;
        col++;
      } else if (self.data.items[row][col] ==
          self.data.items[row][nextc]) {
        self.data.items[row][col] *= 2;
        self.data.items[row][nextc] = 0;
        self.data.score += self.data.items[row][col];
      }
    }
  }
}
/*找当前位置左侧，下一个不为0的数*/
function getLeftNext(self, row, col) {
  //nextc从col-1开始，遍历row行中剩余元素，>=0结束
  for (var nextc = col - 1; nextc >= 0; nextc--) {
    // 遍历过程中，同getRightNext
    if (self.data.items[row][nextc] != 0) {
      return nextc;
    }
  } return -1;
}

/*获得任意位置下方不为0的位置*/
function getDownNext(self, row, col) {
  //nextr从row+1开始，到<this.rn结束
  for (var nextr = row + 1; nextr < self.data.rn; nextr++) {
    if (self.data.items[nextr][col] != 0) {
      return nextr;
    }
  } return -1;
}

/*判断并上移*指定列*中的每个元素*/
function moveUpInCol(self,col) {
  //row从0开始，到<rn-1，遍历每行元素
  for (var row = 0; row < self.data.rn - 1; row++) {
    // 先获得当前位置下方不为0的行nextr
    var nextr = getDownNext(self, row, col);
    if (nextr == -1) {
      break; // 如果nextr==-1
    } else {// 否则
      //  如果当前位置等于0
      if (this.data.items[row][col] == 0) {
        //   将当前位置替换为nextr位置的元素
        self.data.items[row][col] = self.data.items[nextr][col];
        //   将nextr位置设置为0
        self.data.items[nextr][col] = 0;
        row--;//退一行，再循环时保持原位
      } else if (self.data.items[row][col] ==
          self.data.items[nextr][col]) {
        //  否则，如果当前位置等于nextr位置
        //   将当前位置*=2
        self.data.items[row][col] *= 2;
        //   将nextr位置设置为0
        self.data.items[nextr][col] = 0;
        //   将当前位置的值累加到score属性上
        self.data.score += self.data.items[row][col];
      }
    }
  }
}

/*上移所有列*/
function moveUp(self) {
  var oldStr = self.data.items.toString();
  //遍历所有列
  for (var col = 0; col < self.data.cn; moveUpInCol(self,col++));
  var newStr = self.data.items.toString();
  if (oldStr != newStr) {
    randomNum(self);
    updateView(self);
  }
}

/*下移所有列*/
function moveDown(self) {
  var oldStr = self.data.items.toString();
  for (var col = 0; col < self.data.cn; moveDownInCol(self, col++));
  var newStr = self.data.items.toString();
  if (oldStr != newStr) {
    randomNum(self);
    updateView(self);
  }
}

function moveDownInCol(self, col) {
  //row从this.rn-1，到>0结束，row--
  for (var row = self.data.rn - 1; row > 0; row--) {
    var nextr = getUpNext(self, row, col);
    if (nextr == -1) {
      break;
    } else {
      if (self.data.items[row][col] == 0) {
        self.data.items[row][col] =
            self.data.items[nextr][col];
        self.data.items[nextr][col] = 0;
        row++;
      } else if (self.data.items[row][col] ==
          self.data.items[nextr][col]) {
        self.data.items[row][col] *= 2;
        self.data.items[nextr][col] = 0;
        self.data.score += self.data.items[row][col];
      }
    }
  }
}

/*获得任意位置上方不为0的位置*/
function getUpNext(self, row, col) {
  for (var nextr = row - 1; nextr >= 0; nextr--) {
    if (self.data.items[nextr][col] != 0) {
      return nextr;
    }
  } return -1;
}