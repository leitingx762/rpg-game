/*
Object.assign(main, {
    width: document.body.clientWidth,
    height: 0.96 * document.documentElement.clientHeight
})
*/

let start = null

function render(obj, x, y) {
  return new Promise((ok, err) => {
    const img = new Image()
    img.onload = () =>
      ok(backctx.drawImage(img, x || obj.x || 0, y || obj.y || 0))
    img.src = `./img/${obj.src || obj}`
    setTimeout(() => {
      err(new Error(`${img.src} 加载失败`))
    }, 2000)
  }).catch(msg => window.console.error("喵", msg))
}

function mainStart() {
  cancelAnimationFrame(start) //——_—— 防止多次requestAnimationFrame
  mainctx.clearRect(0, 0, main.width, main.height)
  mainctx.fillStyle = "#ffffff"
  //ctx.drawImage(Hero.img[Hero.state], Hero.x, Hero.y)
  // renderQueue.sort((a, b) => a.y - b.y) //排序
  if (Hero.hp) {
    for (const a of renderQueue) {
      a.action()
    }
  }
  for (const a of renderQueue) {
    mainctx.drawImage(a.img[state[a.state]], a.x, a.y)
    mainctx.fillText(a.hp, a.x + 28, a.y - 10)
  }
  mainctx.beginPath()
  mainctx.arc(Hero.x + 32, Hero.y + 32, 35, 0, 6.28)
  mainctx.stroke()
  if (!(/hide/).test(document.querySelector(".modal").className)) {
    return
  }
  if (!Hero.hp) {
    stop()
    return runing = 0
  }
  runing = 1
  return start = requestAnimationFrame(mainStart)
}

// eslint-disable-next-line no-unused-vars
function stop() {
  // await new Promise(ok => ok(mainStop()))
  // mainStop() //await 之后再执行一次 解决 confirm导致cancelAnimationFrame失效的(神奇)BUG。。。
  if (Hero.hp <= 0) {
    modal.open()
    modal.confirm(true, "_(:3ゝ∠)_大侠你凉了呢", "胜败乃兵家常事\n读档吗？", () => location.reload(), () => {
      modal.confirm(false)
      modal.menu(true)
    })
  }
  Massage("stoped")
  return mainStop()
}

function mainStop() {
  runing = 0
  return cancelAnimationFrame(start)
}

function pause() {
  modal.menu(true)
  modal.open()
  mainStop()
  return sel(".modal").addEventListener = ("keydown", e => {
    console.log("23333", e.key)
    if (e.key == "Escape") {
      modal.menu(false)
      modal.close()
    }
  })
}

function resume() {
  modal.menu(false)
  modal.close()
  mainStart()
}

window.onload = async function (flag = 0) {
  modal.close()
  modal.menu(false)
  portal.x = 0.99 * document.documentElement.clientWidth - 233
  portal.y = 0.99 * document.documentElement.clientHeight - 350
  renderQueue = [];
  [main.width, main.height] = [back.width, back.height] = [
    0.99 * document.documentElement.clientWidth,
    0.985 * document.documentElement.clientHeight
  ]
  Hero.init() //初始化英雄
  if (flag == "dungeon") {
    //副本场景初始化怪物
    const slime = {
      $hp: 60,
      speed: 2,
      atk: 10,
      def: 0,
      cd: 2000,
      src: "slime"
    }
    Monster.prototype.img = Array.from({
        //怪物贴图挂在原型里，省资源
        length: 5
      },
      (v, i) => {
        const img = new Image()
        img.src = `./img/${slime.src}${i}.png`
        return img
      }
    )
    renderQueue = Array.from({
        length: 10
      },
      () => new Monster(slime).init()
    )
    await render("dungeon.jpg") //副本背景
  } else {
    await render("background.jpg") //主城背景
    render("NPC1.png", 10, back.height*0.6) //药店
    render("NPC2.png", 10, back.height * 0.8) //装备店
  }
  render(portal) //传送门
  renderQueue.unshift(Hero)
  start = requestAnimationFrame(mainStart) //启动画布
}
sel("#option").onclick = pause

sel(".menu .btn")[0].onclick = resume

sel(".menu .btn")[1].onclick = () => {
  Hero.save()
  modal.menu(false)
  modal.msg(true, "进度已保存~")
  setTimeout(() => {
    modal.close()
    modal.msg(false)
    mainStart()
  }, 1500)
}

sel(".menu .btn")[2].onclick = window.onload

sel(".menu .btn")[3].onclick = () => {
  modal.menu(false)
  modal.confirm(true, "删除存档？", "注意：这将丢失所有进度，确定吗？", () => {
    localStorage.clear()
    modal.confirm(false)
    modal.msg(true, "存档已删除！")
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}