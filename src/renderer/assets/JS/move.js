/**
 * 根据分类的条目数，自动设置分类栏宽度，响应分类栏滑动
 */
// <div class="classify-bar">
//   <div class="move-bar">
//   <div class="classify-items">
//   <ul>
//   <li class="classify">
//   <span class="classify-title">推荐</span>
//   <span class="choose-line" id="first"></span>
//   </li>
//   </ul>
//   </div>
//   </div>
//   </div>
import $ from 'jquery'

$(function () {
  var startX = 0
  var currentX = 0
  var moveX = 0

  var classifyBar = document.getElementsByClassName('classify-bar')[0]
  let i = 0
  let r = $(window).width()
  $('.classify-bar ul').children().each(function () {
    i += $(this).width() + parseInt($(this).css('margin-left')) * 2 + 4 // 每个li之间有空隙
  })
  i = i < r ? r : i

  $(classifyBar).find('.move-bar').width(i)

  let hiddenWidth = i - $(window).width()

  function move () {
    currentX += moveX
    if (currentX >= 0) {
      if (currentX === 0) {
        return null
      }
      currentX = 0
    } else if (-currentX >= hiddenWidth) {
      if (-currentX === hiddenWidth){
        return null
      }
      currentX = -(hiddenWidth)
    }

    $('.classify-bar .move-bar').css('transform', 'translateX(' + currentX + 'px)')
  }

  if (classifyBar) {
    classifyBar.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX
    })

    classifyBar.addEventListener('touchmove', function () {
      var e = event || window.event
      e.preventDefault()
      moveX = e.touches[0].pageX - startX
      startX = e.touches[0].pageX
      move()
    }, false)
  }
})
