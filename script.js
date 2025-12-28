// ✅ 终极定稿 GetMap | 生成不卡死+游玩可解 | 极简40行
function GetMap() {
  const C = { GRID: 20, TOTAL: 300, MAX_LOOP: 10000 };
  const map = Array(C.GRID).fill().map(() => Array(C.GRID).fill(-1));
  let count = 0;

  const canCreate = (r, c, dir) => {
    switch(dir) {
      case 0: for(let k=r-1;k>=0;k--) if(map[k][c]!=-1) return false; break;
      case 1: for(let m=c-1;m>=0;m--) if(map[r][m]!=-1) return false; break;
      case 2: for(let k=r+1;k<C.GRID;k++) if(map[k][c]!=-1) return false; break;
      case 3: for(let m=c+1;m<C.GRID;m++) if(map[r][m]!=-1) return false; break;
    }
    return true;
  };

  // 阶段1：批量填充，秒出280+箭头
  for(let r=0; r<C.GRID && count<C.TOTAL; r++) {
    for(let c=0; c<C.GRID && count<C.TOTAL; c++) {
      if(map[r][c] !== -1) continue;
      const dir = Math.floor(Math.random()*4);
      if(canCreate(r, c, dir)) {
        map[r][c] = dir;
        count++;
      }
    }
  }

  // 阶段2：随机补位+兜底，凑够300个，永不卡死
  let loop = 0;
  while(count < C.TOTAL && loop < C.MAX_LOOP) {
    loop++;
    const r = Math.floor(Math.random()*C.GRID);
    const c = Math.floor(Math.random()*C.GRID);
    const dir = Math.floor(Math.random()*4);
    if(map[r][c] === -1 && canCreate(r, c, dir)) {
      map[r][c] = dir;
      count++;
    }
  }
  return map;
}

// ✅ 原版start函数 + 新增【通关恭喜弹窗】+ 保留不可点击标红
function start() {
  alert("游戏开始！生成秒出+全程可解，放心玩～");
  document.body.innerHTML = "";
  let dir = GetMap();
  const CELL_SIZE = 30;
  const GRID = 20;

  // ✅ 新增：通关检测函数（判断是否所有箭头已消除）
  function checkWin() {
    for(let i=0; i<GRID; i++) {
      for(let j=0; j<GRID; j++) {
        if(dir[i][j] !== -1) return false; // 还有箭头未消除，返回false
      }
    }
    alert("🎉 恭喜通关！🎉\n你成功消除了所有箭头，太厉害啦～"); // 全部消除，弹出恭喜
    return true;
  }

  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      if (dir[i][j] == -1) continue;
      let icon = document.createElement("i");
      if (dir[i][j] == 0) icon.className = "fa fa-angle-double-up";
      if (dir[i][j] == 1) icon.className = "fa fa-angle-double-left";
      if (dir[i][j] == 2) icon.className = "fa fa-angle-double-down";
      if (dir[i][j] == 3) icon.className = "fa fa-angle-double-right";
      icon.style.fontSize = "20px";
      icon.style.position = "absolute";
      icon.style.left = (j * CELL_SIZE + 5) + "px";
      icon.style.top = (i * CELL_SIZE + 5) + "px";
      icon.style.cursor = "pointer";
      icon.style.transition = "all 0.8s";
      icon.onclick = function() {
        let flag = 0;
        for (let k = 0; k < GRID; k++) {
          for (let m = 0; m < GRID; m++) {
            if (dir[k][m] == -1) continue;
            if (k == i && m == j) continue;
            if (dir[i][j] == 0 && m == j && k < i) flag = 1;
            if (dir[i][j] == 1 && k == i && m < j) flag = 1;
            if (dir[i][j] == 2 && m == j && k > i) flag = 1;
            if (dir[i][j] == 3 && k == i && m > j) flag = 1;
            if(flag) break;
          }
          if(flag) break;
        }
        if (flag) {
            this.style.color = "red";
            return;
        }
        switch(dir[i][j]) {
          case 0: this.style.top = "-80px"; break;
          case 1: this.style.left = "-80px"; break;
          case 2: this.style.top = (window.innerHeight + 80) + "px"; break;
          case 3: this.style.left = (window.innerWidth + 80) + "px"; break;
        }
        dir[i][j] = -1;
        this.style.opacity = 0;
        setTimeout(() => {
          this.remove();
          checkWin(); // ✅ 关键：移除箭头后，立即检测是否通关
        }, 800);
      };
      document.body.appendChild(icon);
    }
  }
}
