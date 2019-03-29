/*
Object.assign(main, {
    width: document.body.clientWidth,
    height: 0.96 * document.body.clientHeight
})
*/
//初始化图片队列
let start, cityback, dungeon, npc1, npc2
//懵逼了。。先用着，不管了
function renders(obj, x, y) { //旧版
    return new Promise((ok, err) => {
        const img = new Image()
        img.onload = () =>
            ok(backctx.drawImage(img, x || obj.x || 0, y || obj.y || 0))
        img.src = `./img/${obj.src || obj}`
        setTimeout(() => {
            err(`${img.src} 加载超时，转入后台`)
        }, 5000)
    }).catch(msg => window.console.error("喵", msg))
}

function render(obj, x, y) {
    if (obj) {
        backctx.drawImage(obj, x || 0, y || 0)
    }
}

function Render(img, x, y) {
    mainctx.drawImage(img.src, img.sx, img.sy, offsetX, offsetY, x - offsetX / 2, y - offsetY / 2, offsetX, offsetY)
}

function mainStart() {
    if (runing) {
        cancelAnimationFrame(start) //——_—— 防止多次requestAnimationFrame
        mainctx.clearRect(0, 0, main.width, main.height)
        mainctx.fillStyle = "#ffffff"
        //ctx.drawImage(Hero.img[Hero.state], Hero.x, Hero.y)
        // renderQueue.sort((a, b) => a.y - b.y) //排序
        if (runing && Hero.hp) {
            for (const a of renderQueue) {
                a.action()
            }
        }
        for (const a of renderQueue) {
            Render(a._img, a.x, a.y)
            // mainctx.drawImage(a.img[state[a.state]], a.x, a.y)
            mainctx.fillText(`Level: ${a.level}`, a.x - 35, a.y - offsetY / 2 - 10)
            mainctx.fillText(a.hp, a.x + 15, a.y - offsetY / 2 - 10)
        }
        mainctx.beginPath()
        mainctx.arc(Hero.x, Hero.y, 64, 0, 6.28)
        mainctx.stroke()
        if (!/hide/.test(document.querySelector(".modal").className)) {
            return runing = 0
        }
        if (!(Hero.hp && runing)) {
            stop()
            return runing = 0
        }
        runing = 1
        return start = requestAnimationFrame(mainStart)
    }
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
}

function resume() {
    runing = 1
    modal.menu(false)
    modal.close()
    start = requestAnimationFrame(mainStart)
}

window.onload = async function (flag = 0) {
    console.log("onload")
    Hero.init() //初始化英雄
    let _width = document.documentElement.clientWidth,
        _height = document.documentElement.clientHeight
    modal.close()
    modal.menu(false)
    portal.x = _width - 166
    portal.y = _height - 138
    renderQueue = [];
    [main.width, main.height] = [back.width, back.height] = [_width, _height]
    //加载图片
    Hero._img.src = Hero._img.src || await loadImg("hero")

    if (flag == "dungeon") {
        //副本场景初始化怪物
        const slime = {
            $hp: 60,
            speed: 2,
            atk: 10,
            cd: 800,
            def: 0,
            rng: 65,
            time: {
                init: 2000,
                hurt: 600,
                move: 2000,
                attack: 600,
                standby: 1000
            },
            src: "slime"
        }
        dungeon = dungeon || await loadBack("dungeon")
        render(dungeon) //副本背景
        Monster.prototype.img = Monster.prototype.img || await loadImg("slime")

        // Monster.prototype.img = Array.from({
        //     //怪物贴图挂在原型里，省资源
        //     length: 5
        //   },
        //   (v, i) => {
        //     const img = new Image()
        //     img.src = `./img/${slime.src}${i}.png`
        //     return img
        //   }
        // )
        renderQueue = Array.from({
                length: 10
            },
            () => new Monster(slime).init()
        )
    } else {
        cityback = cityback || await loadBack("background")
        render(cityback)
        npc1 = npc1 || await loadBack("npc1")
        render(npc1, 10, back.height * 0.6) //药店
        npc2 = npc2 || await loadBack("npc2")
        render(npc2, 10, back.height * 0.8) //装备店
    }
    sel(".top-bar div:nth-child(2)").innerText = `血瓶:${Hero.medication}`
    sel(".info p span")[0].innerText = Hero.level
    sel(".info p span")[1].innerText = Hero.exp
    sel(".info p span")[2].innerText = Hero.money
    renderQueue.unshift(Hero)
    runing = 1
    sel(".mask").classList.add("hide")
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
        start = requestAnimationFrame(mainStart)
    }, 800)
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
        }, 600)
    })
}