function handleResize () {
  // 获取拖动区域
  let dragAreaLeft = document.querySelector('.handler-left')
  let dragAreaRight = document.querySelector('.handler-right')
  // 获取中间内容区
  let content = document.querySelector('.content-wrapper')
  // 获取文件信息区
  let fileInfo = document.querySelector('.file-wrapper')
  // 获取侧边栏
  let sideBar = document.querySelector('.sidebar-wrapper')
  dragAreaLeft.style.left = sideBar.clientWidth + 'px'
  // 设定内容区左边距
  content.style.left = sideBar.clientWidth + 'px'
  console.log(content.style.left)
  dragAreaRight.style.left = sideBar.clientWidth + content.clientWidth + 'px'
  // 设定文件信息区左边距
  fileInfo.style.left = sideBar.clientWidth + content.clientWidth + 'px'

  dragAreaLeft.addEventListener('mousedown', function initLeft (e) {
    dragAreaLeft.removeEventListener('mousedown', initLeft)
    initDrag(e, sideBar)
    dragAreaLeft.addEventListener('mousedown', initLeft)
  })

  dragAreaRight.addEventListener('mousedown', function initRight (e) {
    dragAreaRight.removeEventListener('mousedown', initRight)
    initDrag(e, content)
    dragAreaRight.addEventListener('mousedown', initRight)
  })

  let startX, startWidth

  function initDrag (e, element) {
    startX = e.clientX
    startWidth = parseInt(document.defaultView.getComputedStyle(element, null).width, 10)
    document.documentElement.addEventListener('mousemove', doDragLeft, false)
    document.documentElement.addEventListener('mouseup', stopDrag, false)
  }

  function doDragLeft (e) {
    let width = startWidth + e.clientX - startX
    sideBar.style.width = width + 'px'
    dragAreaLeft.style.left = width + 'px'
    // console.log(startWidth, e, startX, element.style.width)
  }

  function doDragRight (e) {
    let width = startWidth + e.clientX - startX
    content.style.width = width + 'px'
    dragAreaRight.style.left = width + 'px'
    // console.log(startWidth, e, startX, element.style.width)
  }

  function stopDrag (e) {
    console.log(window)
    document.documentElement.removeEventListener('mousemove', window.dragF, false)
    document.documentElement.removeEventListener('mouseup', stopDrag, false)
  }
}

export default handleResize
