/**
 * 根据分类的条目数，自动设置分类栏宽度，响应分类栏滑动
 */
import $ from 'jquery'

function scrollBar (tem) {
  let startX = 0
  let currentX = 0
  let moveX = 0
  let count = 0

  let scrollBar = document.getElementById('scrollBar')
  let i = 0
  let r = $('#scrollBar').width()
  // 获取所有选项条的宽度
  $('#scrollBar .scrollBar-inner').children().each(function () {
    i += $(this).width() + 20
  })
  i = i < r ? r : i
  $(scrollBar).find('.scrollBar-inner').width(i)

  let hiddenWidth = i - $('#scrollBar').width()

  function move () {
    currentX += moveX
    if (currentX >= 0) {
      if (currentX === 0) {
        return null
      }
      currentX = 1
    } else if (-currentX >= hiddenWidth) {
      if (-currentX === hiddenWidth) {
        return null
      }
      currentX = -(hiddenWidth)
    }
    $('#scrollBar .scrollBar-inner').css('transform', 'translateX(' + currentX + 'px)')
  }

  function getMoveX () {
    let e = event || window.event
    e.preventDefault()
    moveX = e.pageX - startX
    startX = e.pageX
    if (count === 1) {
      move()
    }
  }

  if (scrollBar && hiddenWidth > 0) {
    scrollBar.addEventListener('mousedown', function (e) {
      count++
      e.preventDefault()
      startX = e.clientX
      scrollBar.addEventListener('mousemove', getMoveX, false)
    }, false)
    scrollBar.addEventListener('mouseup', function (e) {
      count--
      e.preventDefault()
      scrollBar.removeEventListener('mousemove', getMoveX)
    }, false)
  }
}

export default scrollBar
