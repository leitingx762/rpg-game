const main = document.querySelector("#maincanvas"),
  mainctx = main.getContext("2d"),
  back = document.querySelector("#backcanvas"),
  backctx = back.getContext("2d"),
  state = {
    hurt: 0,
    attack: 1,
    move: 2,
    standby: 3,
    init: 4
  },
  portal = {
    src: "portal.jpg",
    x: 0.99 * document.documentElement.clientWidth - 233,
    y: 0.99 * document.documentElement.clientHeight - 460
  }
let runing = 0,
  renderQueue = []

const sel = (Selector) => {
    const list = document.querySelectorAll(Selector)
    return list.length === 1 ? list[0] : list
  },
  modal = {
    menu(close) {
      if (!close) {
        return sel(".menu").classList.add("hide")
      }
      sel(".menu").classList.remove("hide")
    },
    confirm(close, title, content, fn1, fn2 = () => {
      modal.confirm(false)
      modal.menu(true)
    }) {
      if (!close) {
        return sel(".confirm").classList.add("hide")
      }
      sel(".confirm>.title").innerText = title
      sel(".confirm pre").innerText = content
      sel(".confirm .btn")[0].onclick = fn1
      sel(".confirm .btn")[1].onclick = fn2
      sel(".confirm").classList.remove("hide")
    },
    msg(close, content) {
      if (!close) {
        return sel(".modal .msg").classList.add("hide")
      }
      sel(".modal .msg p").innerText = content
      sel(".modal .msg").classList.remove("hide")
    },
    open() {
      sel(".modal").classList.remove("hide")
    },
    close() {
      sel(".modal").classList.add("hide")
    }
  }

function Massage(msg) {
  console.log(msg)
}

function changeStatus(target, _state, time) {
  //状态控制器
  clearTimeout(target.flag.change)
  const change = () => {
    target.state = _state
    target.flag[_state] = new Date
  }
  if (time) {
    target.flag.change = setTimeout(change, time)
  } else {
    change()
  }

}