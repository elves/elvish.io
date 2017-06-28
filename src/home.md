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
    <div class="demo-col left"><div class="demo-ttyshot">
      $ttyshot pipelines
    </div></div>
    <div class="demo-col right"> <div class="demo-description">
      <div class="demo-title">Structureful pipelines</div>
      <p>
        Text pipelines are powerful, but gets unwiedly when your data is
        complex. Complex text processing pipelines are hard to read and hard
        to maintain.
      </p>
      <p>
        Pipelines in Elvish can carry structured data, not just text. You can
        stream lists, maps and even anonymous functions through the pipeline.
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col left"><div class="demo-ttyshot">
      $ttyshot control-structures
    </div></div>
    <div class="demo-col right"> <div class="demo-description">
      <div class="demo-title">C-like control structures</div>
      <p>
        The idea that <code>fi</code> pairs with <code>if</code> and
        <code>esac</code> pairs with <code>case</code> is neat, but not so much
        the syntax gets in the way.
      </p>
      <p>
        Control structures in Elvish has a easier-to-remember syntax that
        mimics C. (It works differently under the hood, though.)
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col left"><div class="demo-ttyshot">
      $ttyshot location-mode
    </div></div>
    <div class="demo-col right"> <div class="demo-description">
      <div class="demo-title">Directory history</div>
      <p>
        Is <code>cd</code>ing into /a/long/nested/directory the first thing you
        do every day? Wish you remember the path of the configuration file you
        touched two months ago?
      </p>
      <p>
        Elvish remembers where you have been. Press Ctrl-L and search, like in a
        browser.
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col left"><div class="demo-ttyshot">
      $ttyshot histlist-mode
    </div></div>
    <div class="demo-col right"> <div class="demo-description">
      <div class="demo-title">Command history</div>
      <p>
        Want to see all the <code>ffmpeg</code> commands you have run?
        Just dig through your command history. Press Ctrl-R and search. Same
        key, more features.
      </p>
      <p>
        (In fact, you can do this in bash with <code>history | grep ffmpeg</code>, but it's far less keystrokes in Elvish :)
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col left"><div class="demo-ttyshot">
      $ttyshot navigation-mode
    </div></div>
    <div class="demo-col right"> <div class="demo-description">
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

<link href="/assets/home-demos.css?v=21" rel="stylesheet">
<script src="/assets/home-demos.js?v=24"></script>

## Getting Elvish

*   [Download](/download) prebuilt binaries if you are running Linux or macOS on
    an x86-64 CPU.

*   Source code is available on the [GitHub repository](https://github.com/elves/elvish).

## Speaking Elvish

*   [Learn](/learn) to speak Elvish by following tutorials.

    If you are not experienced with any shell, start with the
    [fundamentals](/learn/fundamentals.html).

    If you come from other shells, read the [cookbook](/learn/cookbook.html)
    to get started quickly, and learn about Elvish's [unique
    semantics](learn/semantics-uniqueness.html).

*   [Reference](ref) documents describe Elvish in a more formal and complete way.

    Read about the [philosophy](ref/philosophy.html), the
    [language](ref/language.html), the [builtin module](ref/builtin.html), and
    more.

*   [The blog](blog) contains news on Elvish.

    It is the place for release notes, notes on the internals of Elvish, and
    other announcements or musings from the developers.

*   [The feed](feed.atom) contains updates to all sections of the website (not
    just the blog).

## Meeting Other Elves

*   Join the #elvish channel on Freenode, the [Gitter
    room](https://gitter.im/elves/elvish-public), or the [Telegram
    group](https://telegram.me/elvish).

    The wonderful [fishroom](https://github.com/tuna/fishroom) service
    connects all of them together. So just join whichever channel suits you
    best, and you won't miss discussions happening in other channels.

*   Chinese speakers are also welcome on the #elvish-zh channel on
    Freenode and the [Chinese Telegram group](https://telegram.me/elvishzh).

*   The [issue tracker](https://github.com/elves/elvish/issues) is the place
    for bug reports and feature requests.
