If you come from other shells, hopefully the following recipes will get you started quickly:

*   Put your startup script in `~/.elvish/rc.elv`. There is no `alias` yet,
    but you can achieve the goal by defining a function:

    ```elvish
    fn ls { e:ls --color $@ }
    ```

    The `e:` prefix (for "external") ensures that the external command named
    `ls` will be called. Otherwise this definition will result in infinite
    recursion.

*   The left and right prompts can be customized by assigning functions to
    `le:prompt` and `le:rprompt`. Their outputs are concatenated (with no
    spaces in between) before being used as the respective prompts. The
    following simulates the default prompts but uses fancy Unicode:

    ```elvish
    # "tilde-abbr" abbreviates home directory to a tilde.
    le:prompt = { tilde-abbr $pwd; put '❱ ' }
    # "constantly" returns a function that always writes the same value(s) to
    # output; "le:styled" writes styled output.
    le:rprompt = (constantly (le:styled `whoami`✸`hostname` inverse))
    ```

    Screenshot:

    $screenshot custom-prompt Custom prompt demo

*   Press <span class="key">▲&#xfe0e;</span> to search through history. It
    uses what you have typed to do prefix match. To cancel, press <span
    class="key">Escape</span>.

    $screenshot history History mode demo

*   Press <span class="key">Tab</span> to start completion. Use arrow keys
    <span class="key">▲&#xfe0e;</span>
    <span class="key">▼&#xfe0e;</span>
    <span class="key">◀&#xfe0e;</span>
    <span class="key">▶&#xfe0e;</span>
    or <span class="key">Tab</span> and <span class="key">Shift-Tab</span>
    to select the candidate. Press <span class="key">Enter</span>, or just
    continue typing to accept. To cancel, press <span
    class="key">Escape.</span> It even comes with a scrollbar! :) In fact,
    all interactive modes show a scrollbar when there is more output to see.

    $screenshot tab-completion Tab completion demo

*   Press <span class="key">Ctrl-N</span> to start the builtin filesystem
    navigator, aptly named "navigation mode." Use arrow keys to navigate.
    <span class="key">Enter</span> inserts the selected filename to your
    command line. If you want to insert the filename and stay in the mode
    (e.g. when you want to insert several filenames), use <span
    class="key">Alt-Enter</span>.

    You can continue typing your command when you are in navigation mode.
    Press <span class="key">Ctrl-H</span> to toggle hidden files; and like in
    other modes, <span class="key">Escape</span> gets you back to the default
    (insert) mode.

    $screenshot navigation Navigation mode demo

*   Try typing `echo [` and press <span class="key">Enter</span>. Elvish knows that the command is unfinished due to the unclosed `[` and inserts a newline instead of accepting the command. Moreover, common errors like syntax errors and missing variables are highlighted in real time.

*   Elvish remembers which directories you have visited. Press <span
    class="key">Ctrl-L</span> to list visited directories. Like in completion,
    use arrow keys
    <span class="key">▲&#xfe0e;</span>
    <span class="key">▼&#xfe0e;</span>
    or <span class="key">Tab</span> and <span class="key">Shift-Tab</span> to
    select a directory and use Enter to `cd` into it. Press <span
    class="key">Escape</span> to cancel.

    $screenshot location Location mode demo

    Type to filter:

    $screenshot location-filter Location mode filter demo

    The filtering algorithm is tailored for matching paths; you need only type
    a prefix of each component. In the screenshot, x/p/v matches
    **x**iaq/**p**ersistent/**v**ector.

*   Elvish doesn't support history expansion like `!!`. Instead, it has a
    "last command mode" offering the same functionality, triggered by <span
    class="key">Alt-1</span> by default (resembling how you type `!` using
    <span class="key">Shift-1</span>). In this mode, you can pick individual
    arguments from the last command using numbers, or the entire command by
    typing <span class="key">Alt-1</span> again.

    This is showing me trying to fix a forgotten `sudo`:

    $screenshot lastcmd Last command mode demo

*   Lists look like `[a b c]`, and maps look like `[&key1=value1 &key2=value2]`. Unlike other shells, a list never expands to multiple words, unless you explicitly explode it by prefixing the variable name with `@`:
    ```elvish-transcript
    ~> li = [1 2 3]
    ~> put $li
    ▶ [1 2 3]
    ~> put $@li
    ▶ 1
    ▶ 2
    ▶ 3
    ~> map = [&k1=v1 &k2=v2]
    ~> echo $map[k1]
    v1
    ```

*   Environment variables live in a separate `E:` (for "environment") namespace and must be explicitly qualified:
    ```elvish-transcript
    ~> put $E:HOME
    ▶ /home/xiaq
    ~> E:PATH = $E:PATH":/bin"
    ```

*   You can manipulate search paths through the special list `$paths`, which is synced with `$E:PATH`:
    ```elvish-transcript
    ~> echo $paths
    [/bin /sbin]
    ~> paths = [/opt/bin $@paths /usr/bin]
    ~> echo $paths
    [/opt/bin /bin /sbin /usr/bin]
    ~> echo $E:PATH
    /opt/bin:/bin:/sbin:/usr/bin
    ```

*   You can manipulate the keybinding through the map `$le:binding`. For
    example, this binds <span class="key">Ctrl-L</span> to clearing the
    terminal: `le:binding[insert][Ctrl-L] = { clear > /dev/tty }`. The first
    index into the map is the mode and the second is the key. (Yes, the braces
    enclose a lambda.)

    Use `pprint $le:binding` to get a nice (albeit long) view of the current
    keybinding.

    **NOTE**: Bindings for letters modified by Alt are case-sensitive. For
    instance, `Alt-a` means pressing `Alt` and `A`, while `Alt-A` means
    pressing `Alt`, `Shift` and `A`. This will probably change in the future.

*   There is no interpolation inside double quotes (yet). Use implicit string concatenation:

    ```elvish-transcript
    ~> name = xiaq
    ~> echo "My name is "$name"."
    My name is xiaq.
    ```

*   Elementary floating-point arithmetics as well as comparisons are builtin,
    with a prefix syntax:

    ```elvish-transcript
    ~> + 1 2
    ▶ 3
    ~> / (* 2 3) 4
    ▶ 1.5
    ~> > 1 2
    ▶ $false
    ~> < 1 2
    ▶ $true
    ```

*   Functions are defined with `fn`. You can name arguments:

    ```elvish-transcript
    ~> fn square [x]{
         * $x $x
       }
    ~> square 4
    ▶ 16
    ```

*   Output of some builtin commands start with a funny `▶`. It is not part of
    the output itself, but shows that such commands output a stream of values
    instead of bytes. As such, their internal structures as well as boundaries
    between values are preserved. This allows us to manipulate structured data
    in the shell. Read [semantics
    highlights](/learn/semantics-highlights.html) for details.
