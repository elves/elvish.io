<div id="disclaimer">
<p>
<b>UNDER CONSTRUCTION, DO NOT SHARE YET</b>
</p>
<p>
This site is under heavy construction; the author asks you to **not** post it
on Hacker News or Reddit.
</p>
<hr>
</div>

**Elvish** is a friendly and expressive shell for Linux, macOS and BSDs.

<ul id="demo-switcher"> </ul>

<div id="demo-window"> <div id="demo-container" class="animated-transition">
  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col">
      <img src="assets/pipeline.png" srcset="assets/pipeline-2x.png 2x" class="macos" alt="Rich pipeline demo in elvish">
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Powerful pipelines</div>
      <p>
        Have data more complex than what grep and cut can handle?
      </p>
      <p>
        Pipelines in elvish can carry structured data, not just text. Stream
        your lists, maps and even functions through the powerful pipeline.
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col">
      <img src="assets/control.png" srcset="assets/control-2x.png 2x" class="macos" alt="Screenshot of control structures">
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">C-like control structures</div>
      <p>
        Never sure where to put semicolons, and no longer amused by "fi" and
        "esac"?
      </p>
      <p>
        Elvish uses curly braces for control structures.
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col">
      <img src="assets/location.png" srcset="assets/location-2x.png 2x" class="macos" alt="Screenshot of location mode">
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Directory history</div>
      <p>
        Tired of cd'ing into /a/long/nested/directory? Keep forgetting where
        your configuration files are?
      </p>
      <p>
        Elvish remembers where you have been. Press Ctrl-L and search, like in a
        browser.
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col">
      <img src="assets/histlist.png" srcset="assets/histlist-2x.png 2x" class="macos" alt="Screenshot of history listing mode">
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Command history</div>
      <p>
        Need to remind yourself of the usage of ffmpeg?
      </p>
      <p>
        Just dig through your command history. Press Ctrl-R and search. Same
        key, more features.
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col">
      <img src="assets/navigation.png" srcset="assets/navigation-2x.png 2x" class="macos" alt="Screenshot of navigation mode">
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Built-in File Manager</div>
      <p>
        Power of the shell or convenience of a file manager?
      </p>
      <p>
        Choose two. Press Ctrl-N to quickly navigate directories and preview
        files, with full shell power.
      </p>
    </div> </div>
  </div> </div>
</div> </div>


## Getting Elvish

*   [Download](download) prebuilt binaries if you are running Linux or macOS on
    an x86-64 CPU.

*   Source code is available on the [GitHub repository](https://github.com/elves/elvish).

## Speaking Elvish

*   [Learn](learn) to speak Elvish by following tutorials.

    For basics, read the [quick introduction](learn/quick-intro.html). If you
    come from other shells, the [cookbook](learn/cookbook.html) can get you
    started quickly.

*   [Reference](ref) documents describe Elvish in a more formal and complete way.

    Read about the [philosophy](ref/philosophy.html), the
    [language](ref/lang.html), the [builtin module](ref/builtin.html), and
    more.

*   The [blog](blog) is the place for release notes, notes on the
    internals of Elvish, and other random musings from the developers.

To keep updated, subscribe to the [feed](feed.atom). It contains updates to all
sections of the website, not just the blog.


<style>
img.macos {
  border-radius: 6px;
  box-shadow: 0 0 10px #999;
}

#demo-window {
  background-color: #eee;
  margin-bottom: 16px;
  overflow: scroll; /* Graceful degrading. */
}

.overflow-hidden {
  overflow: hidden !important;
}

.animated-transition {
  transition: all 500ms; /* cubic-bezier(0.165, 0.84, 0.44, 1); */
}

#demo-container {
  transform: translateX(0);
  width: 500%;
}

.demo-wrapper {
  width: 20%;
  float: left;
}

.demo:after {
  content: "";
  display: table;
  clear: both;
}

.demo {
  padding: 16px;
}

.demo-col {
  width: 100%;
  height: 100%;
  float: left;
}

.demo-col img {
  display: block;
  margin: 0 auto;
}

.demo-description {
  margin: 16px 5% 0;
}

@media screen and (min-width: 800px) {
  .demo-col {
    width: 50%;
  }
  .demo-description {
    margin: 0 5%;
  }
}

.demo-title {
  font-size: 1.3em;
}

.demo-col p {
  margin-top: 16px;
  margin-bottom: 0;
}

ul#demo-switcher {
  display: inline;
  margin: 0;
}

ul#demo-switcher > li {
  list-style: none;
  display: inline-block;
}

ul#demo-switcher > li > a {
  color: black;
  padding: 4px 14px;
}

ul#demo-switcher > li > a.current , ul#demo-switcher > li > a.current:hover {
  color: white;
  background-color: black;
}

ul#demo-switcher > li > a:hover {
  background-color: #ccc;
  cursor: pointer;
}
</style>

<script>

  if (location.host == 'draft.elvish.io') {
    document.getElementById('disclaimer').remove();
  }

  var current = 0,
      demoWindow = document.getElementById("demo-window"),
      demoContainer = document.getElementById("demo-container"),
      demoSwitcher = document.getElementById("demo-switcher"),
      demoWrappers = document.getElementsByClassName("demo-wrapper"),
      demos = document.getElementsByClassName("demo"),
      len = demoWrappers.length,
      links = [];

  var scrollTo = function(to, instant) {
    if (current != null) {
      links[current].className = "";
    }
    var translate = -demoWrappers[0].offsetWidth * to; 
    if (instant) {
      demoContainer.className = "";
    }
    demoContainer.style.transform = "translateX(" + translate + "px)";
    demoContainer.className = "animated-transition";
    links[to].className = "current";
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
    links.push(link);
    li.appendChild(link);
    demoSwitcher.appendChild(li);
  }
  demoWindow.className = "overflow-hidden";

  /* Resizing breaks sliding, fix it. */
  window.addEventListener('resize', function() { scrollTo(current, true); });

  /* Support sliding by touch. */
  var initX, offsetX;
  demoWindow.addEventListener('touchstart', function(ev) {
    initX = ev.touches[0].pageX;
    offsetX = 0;
    demoContainer.className = "";
  });
  demoWindow.addEventListener('touchmove', function(ev) {
    if (ev.touches.length == 1) {
      lastX = ev.touches[0].pageX;
      offsetX = lastX - initX;
      var translate = offsetX - demoWrappers[0].offsetWidth * current;
      demoContainer.style.transform = "translateX(" + translate + "px)";
    }
  });
  demoWindow.addEventListener('touchcancel', function(ev) {
    demoContainer.className = "animated-transition";
    scrollTo(current);
  });
  demoWindow.addEventListener('touchend', function(ev) {
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
</script>
