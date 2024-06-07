const obj = {
  name: 'Alice',
  showThis: function() {
    console.log(this);
  }
};
obj.showThis(); // 输出 obj 对象
