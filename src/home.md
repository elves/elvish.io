**UNDER CONSTRUCTION, DO NOT SHARE YET**

This site is under heavy construction; the author asks you to **not** post it
on Hacker News or Reddit.

<hr>

<style>
img.macos {
  /* border: 1px solid #ddd; */
  border-radius: 6px;
  box-shadow: 0 0 10px #ddd;
}

.demo {
  margin-bottom: 16px;
  padding: 16px;
  /* background: #113; */
  background-color: #222;
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

.demo:after {
  content: "";
  display: table;
  clear: both;
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
  color: white;
  padding: 4px 14px;
}

ul#demo-switcher > li > a.current , ul#demo-switcher > li > a.current:hover {
  color: black;
  background-color: white;
}

ul#demo-switcher > li > a:hover {
  background-color: #333;
  cursor: pointer;
}

.hidden {
  display: none;
}
</style>

<div id="demo-container">
  <ul id="demo-switcher"> </ul>

  <div class="demo">
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
  </div>

  <div class="demo hidden">
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
  </div>

  <div class="demo hidden">
    <div class="demo-col">
      <img src="assets/location.png" srcset="assets/location-2x.png 2x" class="macos" alt="Screenshot of location mode">
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Location mode</div>
      <p>
        Tired of cd'ing into /a/long/nested/directory? Keep forgetting where
        your configuration files are?
      </p>
      <p>
        Elvish remembers where you have been. Press Ctrl-L and search, like in a
        browser.
      </p>
    </div> </div>
  </div>

  <div class="demo hidden">
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
  </div>

  <div class="demo hidden">
    <div class="demo-col">
      <img src="assets/navigation.png" srcset="assets/navigation-2x.png 2x" class="macos" alt="Screenshot of navigation mode">
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Navigation mode</div>
      <p>
        Power of the shell or convenience of a file manager?
      </p>
      <p>
        Choose two. Press Ctrl-N to quickly navigate directories and preview
        files, with full shell power.
      </p>
    </div> </div>
  </div>
</div>

<script>
  var current;
  var demos = document.getElementsByClassName("demo");
  var links = [];
  var makeOnlyShow = function(toShow) {
    return function() {
      current = toShow;
      for (var i = 0; i < demos.length; i++) {
        demos[i].className = "demo" + (i == toShow ? "" : " hidden");
        links[i].className = i == toShow ? "current" : "";
      }
    };
  }

  var demoSwitcher = document.getElementById("demo-switcher");
  for (var i = 0; i < demos.length; i++) {
    var li = document.createElement("li");
    var link = document.createElement("a");
    link.textContent = i + 1;
    link.onclick = makeOnlyShow(i)
    links.push(link);

    li.appendChild(link);
    demoSwitcher.appendChild(li);
  }
  makeOnlyShow(0)();
</script>


**Elvish** is a friendly and expressive shell for Linux, macOS and BSD.

## Getting Elvish

*   [Prebuilt binaries](https://dl.elvish.io) for Linux and macOS (x64).
    Written in Go, elvish comes in a single binary with no dependency.

*   [Source code](https://github.com/elves/elvish) on GitHub.

## Speaking Elvish

*   Follow tutorials in the [learn](learn) section. Start with the [quick
    introduction](learn/quick-intro.html).

*   Consult the [reference](ref) section for comprehensive treatises on
    elvish.

*   Keep updated to the [blog](blog).
