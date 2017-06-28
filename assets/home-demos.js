(function() {
  var current = 0,
      demoWindow = document.getElementById("demo-window"),
      demoContainer = document.getElementById("demo-container"),
      demoSwitcher = document.getElementById("demo-switcher"),
      demoWrappers = document.getElementsByClassName("demo-wrapper"),
      nDemos = demoWrappers.length,
      switcherLinks = [];

  var scrollTo = function(to, instant) {
    if (current != null) {
      switcherLinks[current].className = "";
    }
    var translate = -demoWrappers[0].offsetWidth * to; 
    demoContainer.className = instant ? "" : "animated-transition";
    demoContainer.style.transform = "translateX(" + translate + "px)";
    switcherLinks[to].className = "current";
    current = to;
  };
  var scrollToNext = function() {
    scrollTo(current < nDemos - 1 ? current + 1 : current);
  };
  var scrollToPrev = function() {
    scrollTo(current > 0 ? current - 1 : current);
  };

  /* Build demo switcher. */
  for (var i = 0; i < nDemos; i++) {
    var li = document.createElement("li"),
        link = document.createElement("a");
    link.textContent = i + 1;
    link.onclick = (function(to) { return function() { scrollTo(to) }; })(i);
    if (i == 0) {
      link.className = "current";
    }
    switcherLinks.push(link);
    li.appendChild(link);
    demoSwitcher.appendChild(li);
  }

  /* Switcher built, hide scrollbar. */
  demoWindow.className = "overflow-hidden";

  /* Resizing breaks sliding, fix it. */
  window.addEventListener('resize', function() { scrollTo(current, true); });

  /* Scrolling primitives. */
  var scrollXTrigger = 5, scrollYTrigger = 5;
  var scrollX = false, scrollY = false;
  var offsetX = 0, offsetY = 0, baseOffset = 0;
  function handleScroll(ev) {
    if (!scrollX && !scrollY) {
      if (Math.abs(offsetX) > scrollXTrigger) {
        baseOffset = offsetX;
        scrollX = true;
      } else if (Math.abs(offsetY) > scrollYTrigger) {
        baseOffset = offsetY;
        scrollY = true;
      }
    }
    if (!scrollX) {
      return;
    }
    // No overscrolling.
    var calculatedOffset = offsetX - baseOffset;
    if ((current == 0 && calculatedOffset > 0) ||
        (current == nDemos-1 && calculatedOffset < 0)) {
      calculatedOffset = 0;
    }
    var translate = calculatedOffset - demoWrappers[0].offsetWidth * current;
    demoContainer.style.transform = "translateX(" + translate + "px)";
    ev.preventDefault();
  }
  function settleScroll() {
    if (scrollX) {
      var threshold = Math.min(60, demoWindow.offsetWidth / 4);
      if (offsetX < -threshold) {
        scrollToNext();
      } else if (offsetX > threshold) {
        scrollToPrev();
      } else {
        scrollTo(current);
      }
    }
    offsetX = offsetY = baseOffset = 0;
    scrollX = scrollY = false;
  }

  /* Support scrolling by touch. */
  var initX, initY;
  demoWindow.addEventListener('touchstart', function(ev) {
    initX = ev.touches[0].clientX;
    initY = ev.touches[0].clientY;
    demoContainer.className = "";
  });
  demoWindow.addEventListener('touchmove', function(ev) {
    if (ev.touches.length == 1) {
      var lastX = ev.touches[0].clientX;
      var lastY = ev.touches[0].clientY;
      offsetX = lastX - initX;
      offsetY = lastY - initY;
      handleScroll(ev);
      // document.getElementById('demo-debug').innerText = '(' + offsetX + ', ' + offsetY + '), ' + scrollX + ', ' + scrollY;
    }
  });
  demoWindow.addEventListener('touchcancel', function() { scrollTo(current); });
  demoWindow.addEventListener('touchend', settleScroll);

  // Keyboard bindings.
  window.addEventListener('keypress', function(ev) {
    var char = String.fromCodePoint(ev.keyCode || ev.charCode);
    if (char == 'h') {
      scrollToPrev();
    } else if (char == 'l') {
      scrollToNext();
    }
  });
})();
