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

        rn: 4, //总行数
        cn: 4, //总列数
        score: 0, //分数
        state: null, //状态 1 可以继续游戏 0 GameOver
        /*色块背景样式*/
        n2: "#eee3da",
        n4: "#ede0c8",
        n8: "#f2b179",
        n16: "#f59563",
        n32: "#f67c5f",
        n64: "#f65e3b",
        n128: "#edcf72",
        n256: "#edcc61",
        n512: "#9c0",
        n1024: "#33b5e5",
        n2048: "#09c",
        n4096: "#a6c",
        n8192: "#93c"
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
                moveDown(self);
            }
            else if (y < -15) {
                console.log('向上');
                moveUp(self);
            }
        }

    },
    gameStart: function(){
      var self = this;
      GameStart(self);
    },

    onload: function () {

    },
    onReady: function () {
        var self = this;
        GameStart(self);
    }
})

function GameStart(self) {//游戏开始
    self.setData({
        state: 1
    });
    self.setData({
        items: [              //初始化二维数组
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    });
    self.setData({
        score: 0              //重置分数为0
    });

    //在两个随机位置生成2或4
    randomNum(self);
    randomNum(self);
    //将数据更新到页面
    updateView(self);


}

function isFull(self) {//判断当前数组是否已满
    var rowEl = self.data.rn;
    var colEl = self.data.cn;
    for (var row = 0; row < rowEl; row++) {//遍历二维数组
        for (var col = 0; col < colEl; col++) {
            // 只要发现当前元素==0
            if (self.data.items[row][col] == 0) {
                return false;
            }
        }
    }
    //(如果循环正常退出)
    return true;
}

function isGameOver(self) {
    if (!isFull(self)) {
        return false;
    }
    else {//否则
        var rowEl = self.data.rn;
        var colEl = self.data.cn;

        //从左上角第一个元素开始，遍历二维数组
        for (var row = 0; row < rowEl; row++) {
            for (var col = 0; col < colEl; col++) {
                //如果当前元素不是最右侧元素
                if (col < colEl - 1) {
                    // 如果当前元素==右侧元素
                    if (self.data.items[row][col] == self.data.items[row][col + 1]) {
                        return false;
                    }
                }
                //如果当前元素不是最下方元素
                if (row < rowEl - 1) {
                    // 如果当前元素==下方元素
                    if (self.data.items[row][col] == self.data.items[row + 1][col]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

function randomNum(self) {//在随机空位置生成一个数
    if (!isFull(self)) {//如果*不*满，才{
        var arr = self.data.items;    //临时数组
        var rowEl = self.data.rn;
        var colEl = self.data.cn;


        while (true) {//循环true
            var row = parseInt(Math.random() * rowEl);
            var col = parseInt(Math.random() * colEl);
            //如果data[row][col]==0
            if (arr[row][col] == 0) {
                arr[row][col] = Math.random() < 0.5 ? 2 : 4;
                self.setData({
                    items: arr
                });

                break;//退出循环
            }
        }
    }
}

function updateView(self) {
    //判断并修改游戏状态为GAMEOVER
    if (isGameOver(self)) {
        self.setData({
            state: 0
        });
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
    }
    return -1;//(循环正常退出，就)返回-1
}

/*判断并左移*指定行*中的每个元素*/
function moveLeftInRow(self, row) {
    var arr = self.data.items;
    var myScore = self.data.score;
    var nextc;      // 获得当前元素下一个不为0的元素的下标nextc

    //col从0开始，遍历row行中的每个元素，<cn-1结束
    for (var col = 0; col < self.data.cn - 1; col++) {
        nextc = getRightNext(self, row, col);
        if (nextc == -1) {               // 如果nextc==-1，(说明后边没有!=0的元素了)
            break;
        } else {// 否则
            //  如果当前位置==0,
            if (arr[row][col] == 0) {
                //   将下一个位置的值，当入当前位置
                arr[row][col] = arr[row][nextc];
                //   下一个位置设置为0
                arr[row][nextc] = 0;

                self.setData({
                    items: arr
                });

                col--;//让col退一格，重复检查一次
            }
            else if (arr[row][col] == arr[row][nextc]) {
                //  否则，如果当前位置==nextc的位置
                //   将当前位置*=2;
                arr[row][col] *= 2;
                //   下一个位置设置为0;
                arr[row][nextc] = 0;
                //   将当前位置的值，累加到score上
                myScore += arr[row][col];

                self.setData({
                    items: arr,
                    score: myScore
                })
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
        moveLeftInRow(self, row);
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
        moveRightInRow(self, row);
    }
    var newStr = self.data.items.toString();
    if (oldStr != newStr) {
        randomNum(self);
        updateView(self);
    }
}
/*判断并右移*指定行*中的每个元素*/
function moveRightInRow(self, row) {
    //col从cn-1开始，到>0结束
    var arr = self.data.items;
    var myScore = self.data.score;
    var nextc;

    for (var col = self.data.cn - 1; col > 0; col--) {
        nextc = getLeftNext(self, row, col);
        if (nextc == -1) {
            break;
        } else {

            if (arr[row][col] == 0) {
                arr[row][col] = arr[row][nextc];
                arr[row][nextc] = 0;

                self.setData({
                    items: arr
                });
                col++;
            }
            else if (arr[row][col] == arr[row][nextc]) {
                arr[row][col] *= 2;
                arr[row][nextc] = 0;
                myScore += arr[row][col];

                self.setData({
                    score: myScore,
                    items: arr
                })
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
    }
    return -1;
}

/*获得任意位置下方不为0的位置*/
function getDownNext(self, row, col) {
    //nextr从row+1开始，到<this.rn结束
    for (var nextr = row + 1; nextr < self.data.rn; nextr++) {
        if (self.data.items[nextr][col] != 0) {
            return nextr;
        }
    }
    return -1;
}

/*判断并上移*指定列*中的每个元素*/
function moveUpInCol(self, col) {
    //row从0开始，到<rn-1，遍历每行元素
    var arr = self.data.items;
    var myScore = self.data.score;
    var nextr;

    for (var row = 0; row < self.data.rn - 1; row++) {
        // 先获得当前位置下方不为0的行nextr
        nextr = getDownNext(self, row, col);
        if (nextr == -1) {
            break; // 如果nextr==-1
        } else {// 否则
            //  如果当前位置等于0
            if (arr[row][col] == 0) {
                arr[row][col] = arr[nextr][col];         //   将当前位置替换为nextr位置的元素
                arr[nextr][col] = 0;        //   将nextr位置设置为0

                self.setData({
                    items: arr
                });
                row--;//退一行，再循环时保持原位
            } else if (arr[row][col] == arr[nextr][col]) { //  否则，如果当前位置等于nextr位置
                arr[row][col] *= 2;     //   将当前位置*=2
                arr[nextr][col] = 0;    //   将nextr位置设置为0
                myScore += arr[row][col];   //   将当前位置的值累加到score属性上
                self.setData({
                    items: arr,
                    score: myScore
                });
            }
        }
    }
}

/*上移所有列*/
function moveUp(self) {
    var oldStr = self.data.items.toString();
    //遍历所有列
    for (var col = 0; col < self.data.cn; moveUpInCol(self, col++));
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
    var arr = self.data.items;
    var myScore = self.data.score;
    var nextr;

    //row从this.rn-1，到>0结束，row--
    for (var row = self.data.rn - 1; row > 0; row--) {
        nextr = getUpNext(self, row, col);
        if (nextr == -1) {
            break;
        } else {
            if (arr[row][col] == 0) {
                arr[row][col] = arr[nextr][col];
                arr[nextr][col] = 0;
                row++;

                self.setData({
                    items: arr
                })
            } else if (arr[row][col] == arr[nextr][col]) {
                arr[row][col] *= 2;
                arr[nextr][col] = 0;
                myScore += arr[row][col];

                self.setData({
                    items: arr,
                    score: myScore
                })
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
    }
    return -1;
}