var localStorage = window.localStorage || null
const key = {
    w: 0,
    a: 0,
    s: 0,
    d: 0,
    k: 0
  },
  Hero = {
    atk: 10,
    cd: 500,
    x: document.documentElement.clientWidth / 2 - 32,
    y: document.documentElement.clientHeight / 2 - 32,
    date: new Date,
    def: 2,
    $hp: 100,
    hp: 100,
    weapon: null,
    armor: null,
    medication: 10,
    money: 0,
    flag: {
      move: new Date,
      attack: "",
      heal: true,
      status: [0, 0, 0, 0, 0]
    },
    img: [new Image, new Image, new Image, new Image],
    speed: 9,
    state: "standby", //-1:init, 0:hurt，1：attacked，2：moving，3：standby
    heal() { //  hp+2/s,cd 5s
      //  hp+2/s,cd 5s
      if (!this.medication) {
        return Massage("没药了!")
      }
      if (this.hp === 100) {
        return Massage("HP是满的!")
      }
      this.flag.heal = false
      this.medication -= 1
      for (let n = 0; n < 5; n++) {
        setTimeout(() => {
          this.hp < 99 ? (this.hp += 2) : (this.hp = 100)
          n === 4 && (this.flag.heal = true)
        }, n * 1000)
      }
    },
    init() {
      changeStatus(this,"standby")
      this.x = document.documentElement.clientWidth / 2 - 32
      this.y = document.documentElement.clientHeight / 2 - 32
      this.load()
      this.img.forEach((item, key) => {
        item.src = `./img/Hero${key}.png`
      })
    },
    move(control) {
      if (this.state === "move" || this.state === "standby") {
        let _x = control.d - control.a,
          _y = control.s - control.w
        if (_x || _y) {
          let _dist = this.speed,
            x,
            y
          if (_x && _y) {
            _dist /= 1.41 //根号2
          }
          x = _dist * _x
          y = _dist * _y
          changeStatus(this, "move")
          this.x += this.x + x > main.width - 64 || this.x + x < 0 ? 0 : x
          this.y += this.y + y > main.height - 64 || this.y + y < 300 ? 0 : y
          //console.log("Hero", _dist, x, y, this.x, this.y)
          if (Math.sqrt((this.x - portal.x - 154) ** 2 + (this.y - portal.y - 103) ** 2) < 60) {
            this.save()
            if (renderQueue.length > 2) { //回城
              return window.onload("city")
            }
            window.onload("dungeon")
          }
        }
        changeStatus(this, "standby")
      }
    },
    attack() {
      const _this = this
      // this.onmove = false
      if (new Date() - this.flag.attack > this.cd) {
        changeStatus(this, "attack")
        // clearTimeout(this.attacked) //防抖
        changeStatus(this, "standby", this.cd)
        // this.attacked = setTimeout(
        //     () => (this.state = "standby"),
        //     this.cd
        // ) //攻击状态持续500
        renderQueue.forEach(v => {
          if (v.state !== "init" && v.hp > 0) { //跳过init和died的怪
            let x = (v.x - this.x) ** 2,
              y = (v.y - this.y) ** 2,
              result = +Math.sqrt(x + y).toFixed(2) //和怪的间距
            if (result < 70 && result > 0) {
              changeStatus(v, "hurt")
              const _hp = v.hp - this.atk + v.def
              if (_hp > 0) {
                v.hp = _hp
                changeStatus(v, "move", 800)
                // clearTimeout(v.been_attacked) //防抖
                // v.been_attacked = setTimeout(() => {
                //     v.state = "move"
                //     v.flag.move = new Date()
                // }, 800) //挨打状态持续800
              } else {
                // clearTimeout(v.been_attacked)
                v.hp = 0
                this.money += 10
                setTimeout(() => {
                  v.init()
                }, 2500)
              }
              // v.state = "hurt"
            }
          }
        })
      } else {
        this.move(key)

      }
    },
    action() {
      if (renderQueue.length < 2) { //安全区~
        return this.move(key)
      }
      if (this.state === "standby" || this.state === "move") {
        if (key.k) {
          this.attack()
        } else {
          this.move(key)
        }
      }
    },
    load() {
      if (window.localStorage && localStorage.hero) {
        let hero = JSON.parse(localStorage.hero)
        for (let i in hero) {
          this[i] = hero[i]
        }
        console.log("存档已载入！")
      } else {
        console.log("暂未存档或此浏览器不支持存档功能。")
      }
    },
    save() {
      if (window.localStorage) {
        let hero = {
          atk: this.atk,
          cd: this.cd,
          def: this.def,
          hp: this.hp,
          weapon: this.weapon,
          armor: this.armor,
          medication: this.medication,
          money: this.money
        }
        console.log("saved")
        return localStorage.hero = JSON.stringify(hero)
      }
      return console.log("此浏览器不支持存档功能。")
    }
  }
document.addEventListener("keydown", function (e) {
  console.log(e.key)
  if (e.key == "1") {
    runing && Hero.flag.heal && Hero.heal()
    return
  }
  key[e.key] = 1
})

document.addEventListener("keyup", function (e) {
  key[e.key] = 0
})