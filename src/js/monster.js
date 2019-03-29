function Monster(_) {
    Object.assign(this, _)
    this.date = new Date
    this._img = {}
    this.flag = {
        init: 0,
        hurt: 0,
        standby: 0,
        move: 0,
        attack: 0,
    }
    this.level = 0
    this.state = "init" //-1:init, 0:hurt，1：attacked，2：moveing，3：standby,
    this.x = Math.random().toFixed(2) * (main.width - offsetX / 2)
    this.y = Math.random().toFixed(2) * (main.height - offsetY / 2)
    return this
}
Monster.prototype = {
    attack() {
        const hero = Hero
        if (this.state === "move") {
            let _x = (hero.x - this.x) ** 2,
                _y = (hero.y - this.y) ** 2
            if (Math.sqrt(_x + _y).toFixed(2) < this.rng) {
                const _hp = this.atk - hero.def - (hero.level - 1) * 2
                changeStatus(this, "attack")
                changeStatus(hero, "hurt")
                hero.hp -= _hp > 0 ? _hp : 1
                if (hero.hp <= 0) {
                    hero.hp = 0
                    mainStop()
                    return window.stop()
                }
                changeStatus(this, "move", this.time.attack)
                changeStatus(hero, "move", hero.time.hurt)

            }
        }
        // if ((now - this.date) / 2 % 2 < 1) {}
        //move or attack
    },
    action() {
        if (
            this.state === "standby" &&
            new Date - this.flag["standby"] > this.time.standby
        ) {
            changeStatus(this, "move")
            setTimeout(she => {
                if (she.state !== "hurt" || "init") {
                    changeStatus(she, "standby")
                }
            }, this.time.move, this)
        }
        if (this.state === "move" && this.hp) {
            if (new Date - this.flag["move"] > this.time.move) {
                changeStatus(this, "standby")
            }
            let _x = Hero.x - this.x,
                _y = Hero.y - this.y,
                distance = Math.sqrt(_x ** 2 + _y ** 2).toFixed(2)
            if (distance > this.rng || new Date() - this.flag["attack"] < this.cd) {
                let x = ~~((this.speed / distance) * _x),
                    y = ~~((this.speed / distance) * _y)
                // log("monster", x, y)
                this.x += x
                this.y += y
            } else {
                this.attack()
            }
        }
        this._img.sx = 0
        this._img.sy = state[this.state] * offsetY
    },

    init() {
        ++this.level
        this.x = +Math.random().toFixed(2) * (document.querySelector("#maincanvas").width - offsetX / 2)
        this.y = +Math.random().toFixed(2) * (document.querySelector("#maincanvas").height - offsetY / 2)
        this.hp = this.$hp + (this.level - 1) * 5
        this.atk += (this.level - 1) * 2
        this.def += this.level - 1
        this._img.src = this.img
        //duang!
        changeStatus(this, "init")
        changeStatus(this, "move", this.time.init)
        return this
    }
}