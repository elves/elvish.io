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
<pre class="terminal-shot"><code>~&gt; <span class="sgr-32">curl</span><span class="sgr-"> https://api.github.com/repos/elves/elvish/issues </span><span class="sgr-32">|</span><br>     <span class="sgr-32">from-json</span><span class="sgr-"> </span><span class="sgr-32">|</span><span class="sgr-"> </span><span class="sgr-32">each</span><span class="sgr-"> explode </span><span class="sgr-32">|</span><br>     <span class="sgr-32">each</span><span class="sgr-"> </span><span class="sgr-1">[</span><span class="sgr-">issue</span><span class="sgr-1">]{</span><span class="sgr-"> </span><span class="sgr-32">echo</span><span class="sgr-"> </span><span class="sgr-35">$issue</span><span class="sgr-1">[</span><span class="sgr-">number</span><span class="sgr-1">]</span><span class="sgr-">: </span><span class="sgr-35">$issue</span><span class="sgr-1">[</span><span class="sgr-">title</span><span class="sgr-1">]</span><span class="sgr-"> </span><span class="sgr-1">}</span><span class="sgr-"> </span><span class="sgr-32">|</span><br>     <span class="sgr-32">head</span><span class="sgr-"> -n 8</span>
366: Support searching file from elvish directly
364: Ctrl-C in elvish kills Atom in background
357: Asynchronous syntax highlighting
356: In web backend, run commands with pty IO, not pipe
354: Support multi-line prompts from byte output
353: Completers should detect context in a top-down manner
352: Quoted command names are highlighted randomly
351: keep navigation mode open after command
</code></pre>
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Structureful pipelines</div>
      <p>
        Text pipelines are powerful, but gets unwiedly when your data is
        complex. Keeping track of which column is what, and escaping text
        properly quickly becomes tedious. (You know this if you have written
        long <code>awk</code> scripts.)
      </p>
      <p>
        Pipelines in Elvish can carry structured data, not just text. You can
        stream lists, maps and even anonymous functions through the pipeline.
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col">
<pre class="terminal-shot"><code>~&gt; <span class="sgr-32">if</span><span class="sgr-"> </span><span class="sgr-35">$true</span><span class="sgr-"> </span><span class="sgr-1">{</span><br>     <span class="sgr-32">echo</span><span class="sgr-"> true</span><br>   <span class="sgr-1">}</span><span class="sgr-"> else </span><span class="sgr-1">{</span><br>     <span class="sgr-32">echo</span><span class="sgr-"> false</span><br>   <span class="sgr-1">}</span>
true
~&gt; <span class="sgr-32">for</span><span class="sgr-"> </span><span class="sgr-35">x</span><span class="sgr-"> </span><span class="sgr-1">[</span><span class="sgr-">lorem ipsum</span><span class="sgr-1">]</span><span class="sgr-"> </span><span class="sgr-1">{</span><br>     <span class="sgr-32">echo</span><span class="sgr-"> </span><span class="sgr-35">$x</span><br>   <span class="sgr-1">}</span>
lorem
ipsum</code></pre>
    </div>
    <div class="demo-col"> <div class="demo-description">
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
    <div class="demo-col">
<pre class="terminal-shot"><code>~&gt;                                           <span class="sgr-7">xiaq@xiaqsmbp</span>
<span class="sgr-1 sgr-37 sgr-45"> LOCATION </span><span class="sgr-"> </span>
<span class="sgr-7"> * ~                                                     </span><span class="sgr-35 sgr-7"> </span>
 * ~/go/src/github.com/elves/elvish                      <span class="sgr-35">│</span>
87 ~/go/src/github.com/elves/elvish/edit                 <span class="sgr-35">│</span>
64 ~/on/elvish-site/code                                 <span class="sgr-35">│</span>
53 ~/go/src/github.com/elves/elvish/eval                 <span class="sgr-35">│</span>
45 ~/on/chat-app/code                                    <span class="sgr-35">│</span>
40 ~/on/elvish-site/code/dst                             <span class="sgr-35">│</span>
27 ~/on/elvish-site/code/assets                          <span class="sgr-35">│</span>
24 ~/on/chat-app/code/public                             <span class="sgr-35">│</span>
21 ~/on/elvish-site/code/src                             <span class="sgr-35">│</span></code></pre>
    </div>
    <div class="demo-col"> <div class="demo-description">
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
    <div class="demo-col">
<pre class="terminal-shot"><code>~&gt;                                           <span class="sgr-7">xiaq@xiaqsmbp</span>
<span class="sgr-1 sgr-37 sgr-45"> HISTORY (dedup on) </span><span class="sgr-"> </span><span class="sgr-4">vim</span>
12887 vim tools/initDB.php                               <span class="sgr-35">│</span>
12962 vim dump_buf.go                                    <span class="sgr-35">│</span>
12966 vim builtin_fn.go                                  <span class="sgr-35">│</span>
12993 vim rc.elv                                         <span class="sgr-35">│</span>
13002 vim main.go                                        <span class="sgr-35">│</span>
13031 vim .tmux.conf                                     <span class="sgr-35">│</span>
13033 vim home.md                                        <span class="sgr-35">│</span>
13078 vim dump_buf.go                                    <span class="sgr-35">│</span>
13086 vim buf.html                                       <span class="sgr-35">│</span>
<span class="sgr-7">13089 vim .elvish/rc.elv                                 </span><span class="sgr-35">│</span></code></pre>
    </div>
    <div class="demo-col"> <div class="demo-description">
      <div class="demo-title">Command history</div>
      <p>
        Want to see all the <code>ffmpeg</code> commands you have run?
      </p>
      <p>
        Just dig through your command history. Press Ctrl-R and search. Same
        key, more features.
      </p>
      <p>
        (In fact, you can do this in bash with <code>history | grep ffmpeg</code>, but it's far less keystrokes in Elvish :)
      </p>
    </div> </div>
  </div> </div>

  <div class="demo-wrapper"> <div class="demo">
    <div class="demo-col">
<pre class="terminal-shot"><code>~/go/src/github.com/elves/elvish&gt;            <span class="sgr-7">xiaq@xiaqsmbp</span>
<span class="sgr-1 sgr-37 sgr-45"> NAVIGATING </span><span class="sgr-"> </span>
<span class="sgr-01 sgr-34 sgr-7"> elvish       </span><span class="sgr-"> </span><span class="sgr- sgr-7"> CONTRIBUTING.md </span><span class="sgr-35 sgr-7"> </span><span class="sgr-">  # Notes for Contributors     </span><span class="sgr-35 sgr-7"> </span>
<span class="sgr-01 sgr-34"> fix-for-0.7  </span><span class="sgr-">  Dockerfile      </span><span class="sgr-35 sgr-7"> </span><span class="sgr-">                               </span><span class="sgr-35 sgr-7"> </span>
<span class="sgr-01 sgr-34"> images       </span><span class="sgr-">  Gopkg.lock      </span><span class="sgr-35 sgr-7"> </span><span class="sgr-">  ## Testing                   </span><span class="sgr-35 sgr-7"> </span>
<span class="sgr-01 sgr-34"> md-highlighte</span><span class="sgr-">  Gopkg.toml      </span><span class="sgr-35 sgr-7"> </span><span class="sgr-">                               </span><span class="sgr-35 sgr-7"> </span>
                LICENSE         <span class="sgr-35">│</span><span class="sgr-">  Always run unit tests before </span><span class="sgr-35">│</span>
                Makefile        <span class="sgr-35">│</span><span class="sgr-">                               </span><span class="sgr-35">│</span>
                README.md       <span class="sgr-35">│</span><span class="sgr-">  ## Generated files           </span><span class="sgr-35">│</span>
               <span class="sgr-01 sgr-34"> cover           </span><span class="sgr-35">│</span><span class="sgr-">                               </span><span class="sgr-35">│</span>
               <span class="sgr-01 sgr-34"> daemon          </span><span class="sgr-35">│</span><span class="sgr-">  Some files are generated from</span><span class="sgr-35">│</span>
               <span class="sgr-01 sgr-34"> edit            </span><span class="sgr-35">│</span><span class="sgr-">                               </span><span class="sgr-35">│</span></code></pre>
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
