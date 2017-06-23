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
<script>
  if (location.host == 'draft.elvish.io') {
    document.getElementById('disclaimer').remove();
  }
</script>

**Elvish** is a friendly and expressive shell for Linux, macOS and BSDs.

<!--
<pre id="demo-debug">
</pre>
-->

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

<link href="/assets/home-demos.css" rel="stylesheet">
<script src="/assets/home-demos.js"></script>

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

