If you come from other shells, hopefully the following recipes will get you started quickly:

*   Put your startup script in `~/.elvish/rc.elv`. There is no `alias` yet, but you can achieve the goal by defining a function:

    ```elvish
    fn ls { e:ls --color $@ }
    ```

    The `e:` prefix (for "external") ensures that the external command named `ls` will be called. Otherwise this definition will result in infinite recursion.

*   The left and right prompts can be customized by assigning functions to `le:prompt` and `le:rprompt`. Their outputs are concatenated (with no spaces in between) before being used as the respective prompts. The following simulates the default prompts but uses fancy Unicode:

    ```elvish
    # "tilde-abbr" abbreviates home directory to a tilde.
    le:prompt = { tilde-abbr $pwd; put '❱ ' }
    # "constantly" returns a function that always writes the same value(s) to output.
    le:rprompt = (constantly `whoami`✸`hostname`)
    ```

*   Press Up to search through history. It uses what you have typed to do prefix match. To cancel, press Escape.

    <img src="/assets/history.png" srcset="/assets/history-2x.png 2x" class="macos" alt="History mode demo">

*   Press Tab to start completion. Use arrow key and Tab to select the candidate; press Enter, or just continue typing to accept. To cancel, press Escape. It even comes with a scrollbar.

    <img src="/assets/tab-completion.png" srcset="/assets/tab-completion-2x.png 2x" class="macos" alt="Tab completion demo">

*   Press Ctrl-N to start navigation mode. Press Ctrl-H to show hidden files; press again to hide. Press tab to append selected filename to your command. Likewise, pressing Escape gets you back to the default (insert) mode.

    <img src="/assets/navigation.png" srcset="/assets/navigation-2x.png 2x" class="macos" alt="Navigation mode demo">

*   Try typing `echo [` and press Enter. Elvish knows that the command is unfinished due to the unclosed `[` and inserts a newline instead of accepting the command. Moreover, common errors like syntax errors and missing variables are highlighted in real time.

*   Elvish remembers which directories you have visited. Press Ctrl-L to list visited directories. Like in completion, use Up, Down and Tab to navigate and use Enter to accept (which `cd`s into the selected directory). Press Escape to cancel.

    <img src="/assets/location.png" srcset="/assets/location-2x.png 2x" class="macos"alt="Location mode demo">

    Type to filter:

    <img src="/assets/location-filter.png" srcset="/assets/location-filter-2x.png 2x" class="macos"alt="Location mode filter demo">

    The filtering algorithm is tailored for matching paths; you need only type
    a prefix of each component. In the screenshot, x/p/v matches
    **x**iaq/**p**ersistent/**v**ector.

*   Elvish doesn't support history expansion like `!!`. Instead, it has a
    "last command mode", triggered by `Alt-,`, that provides the same
    functionality. For example, if you typed a command but forgot to add
    `sudo`, you can then type `sudo ` and press `Alt-,` twice to fix it:

    <img src="/assets/bang.png" srcset="/assets/bang-2x.png 2x" class="macos"alt="Bang mode demo">

*   Lists look like `[a b c]`, and maps look like `[&key1=value1 &key2=value2]`. Unlike other shells, a list never expands to multiple words, unless you explicitly explode it by prefixing the variable name with `@`:
    ```sh
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
    ```sh
    ~> put $E:HOME
    ▶ /home/xiaq
    ~> E:PATH=$E:PATH":/bin"
    ```

*   You can manipulate search paths through the special list `$paths`, which is synced with `$E:PATH`:
    ```sh
    ~> echo $paths
    [/bin /sbin]
    ~> paths = [/opt/bin $@paths /usr/bin]
    ~> echo $paths
    [/opt/bin /bin /sbin /usr/bin]
    ~> echo $E:PATH
    /opt/bin:/bin:/sbin:/usr/bin
    ```

*   You can manipulate the keybinding through the map `$le:binding`. For example, this binds Ctrl-L to clearing the terminal: `le:binding[insert][Ctrl-L]={ clear > /dev/tty }`. The first index is the mode and the second is the key. (Yes, the braces enclose a lambda.)

    Use `pprint $le:binding` to get a nice (albeit long) view of the current keybinding.

    **NOTE**: Bindings for letters modified by Alt are case-sensitive. For instance, `Alt-a` means pressing `Alt` and `A`, while `Alt-A` means pressing `Alt`, `Shift` and `A`.

*   There is no interpolation inside double quotes (yet). Use implicit string concatenation:
    ```sh
    ~> name = xiaq
    ~> echo "My name is "$name"."
    My name is xiaq.
    ```

*   Elementary floating-point arithmetics as well as comparisons are builtin. Unfortunately, you have to use prefix notation:
    ```sh
    ~> + 1 2
    ▶ 3
    ~> / `* 2 3` 4
    ▶ 1.5
    ~> / (* 2 3) 4 # parentheses are equivalent to backquotes, but look nicer in arithmetics
    ▶ 1.5
    ~> > 1 2 # ">" may be used as a command name
    ✗
    ~> < 1 2 # "<" may also be used as a command name; silence means "true"
    ```

*   Functions are defined with `fn`. You can name arguments:
    ```sh
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
    in the shell; more on this later.
