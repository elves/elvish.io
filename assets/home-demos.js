(function() {
  var current = 0,
      demoWindow = document.getElementById("demo-window"),
      demoContainer = document.getElementById("demo-container"),
      demoSwitcher = document.getElementById("demo-switcher"),
      demoWrappers = document.getElementsByClassName("demo-wrapper"),
      len = demoWrappers.length,
      switcherLinks = [];

  var scrollTo = function(to, instant) {
    if (current != null) {
      switcherLinks[current].className = "";
    }
    var translate = -demoWrappers[0].offsetWidth * to; 
    if (instant) {
      demoContainer.className = "";
    }
    demoContainer.style.transform = "translateX(" + translate + "px)";
    demoContainer.className = "animated-transition";
    switcherLinks[to].className = "current";
    current = to;
  };
  var scrollToNext = function() {
    scrollTo(current < len - 1 ? current + 1 : current);
  };
  var scrollToPrev = function() {
    scrollTo(current > 0 ? current - 1 : current);
  };
  var makeScrollTo = function(to) {
    return function() { scrollTo(to); };
  };

  /* Build demo switcher. */
  for (var i = 0; i < len; i++) {
    var li = document.createElement("li"),
        link = document.createElement("a");
    link.textContent = i + 1;
    link.onclick = makeScrollTo(i);
    if (i == 0) {
      link.className = "current";
    }
    switcherLinks.push(link);
    li.appendChild(link);
    demoSwitcher.appendChild(li);
  }
  demoWindow.className = "overflow-hidden";

  /* Resizing breaks sliding, fix it. */
  window.addEventListener('resize', function() { scrollTo(current, true); });

  /* Support sliding by touch. */
  var scrollXTrigger = 5, scrollYTrigger = 5;
  var initX, initY, offsetX, offsetY, baseOffset, scrollX, scrollY;
  demoWindow.addEventListener('touchstart', function(ev) {
    initX = ev.touches[0].clientX;
    initY = ev.touches[0].clientY;
    offsetX = offsetY = baseOffset = 0;
    scrollX = scrollY = false;
    demoContainer.className = "";
  });
  demoWindow.addEventListener('touchmove', function(ev) {
    if (ev.touches.length == 1) {
      lastX = ev.touches[0].clientX;
      lastY = ev.touches[0].clientY;
      offsetX = lastX - initX;
      offsetY = lastY - initY;
      // document.getElementById('demo-debug').innerText = '(' + offsetX + ', ' + offsetY + '), ' + scrollX + ', ' + scrollY;
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
          (current == len-1 && calculatedOffset < 0)) {
        calculatedOffset = 0;
      }
      var translate = calculatedOffset - demoWrappers[0].offsetWidth * current;
      demoContainer.style.transform = "translateX(" + translate + "px)";
      ev.preventDefault();
    }
  });
  demoWindow.addEventListener('touchcancel', function(ev) {
    demoContainer.className = "animated-transition";
    scrollTo(current);
  });
  demoWindow.addEventListener('touchend', function(ev) {
    if (!scrollX) {
      return;
    }
    demoContainer.className = "animated-transition";
    var threshold = Math.min(60, demoWindow.offsetWidth / 4);
    if (offsetX < -threshold) {
      scrollToNext();
    } else if (offsetX > threshold) {
      scrollToPrev();
    } else {
      scrollTo(current);
    }
  });

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
