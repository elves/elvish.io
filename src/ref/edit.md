<!-- toc -->

The `edit:` module is the interface to the Elvish editor.

Function usages are given in the same format as in the [reference for the
builtin module](/ref/builtin.html).

*This document is incomplete.*

# Keybindings

The Elvish editor has different **modes**, each with its own UI and keybindings.
Keybindings can be modified using `$edit:binding`. This is a map, mapping
modes to binding tables; Each binding table is a map from key to function. As
an example, the binding for <span class="key">Alt-x</span> in insert mode is
`$edit:binding[insert][Alt-x]`.

To see the entire binding table, use `pprint $edit:binding`.
The primary modes supported now are `insert`, `completion`, `navigation`,
`history`, `listing`, `histlist`, `loc`, and `lastcmd`. The last 4 are
somewhat special and are documented below. The Elvish editor starts in the
insert mode.

Any valid function can be bound to keys. When they are run, their output is
captured in a pipe, and then appear above the Elvish prompt, to avoid messing
up with the terminal. You can see this by doing the following

```elvish
edit:binding[insert][Alt-x] = { echo 'output from binding!' }
```

and press <span class="key">Alt-x</span> in insert mode. This does the correct
thing in most cases, but if you are sure you want to do something to the
terminal, redirect the output to `/dev/tty`. For instance, the following binds
<span class="key">Ctrl-L</span> to clearing the terminal:

```elvish
edit:binding[insert][Ctrl-L] = { clear > /dev/tty }
```


## Listing Modes

The modes `histlist`, `loc` and `lastcmd` are all **listing modes**: They all
show a list, and you can filter items and accept items. Because they are very
similiar, they share a lot of keybindings, and those keybindings are in the
`$edit:binding[listing]` binding table (`listing` is not a "real" mode but an
"abstract" mode). These modes still have their own binding tables like
`$edit:binding[histlist]`, and bindings there have highter precedence over
those in the shared `$edit:binding[listing]` table.

## Bindings to Start Modes

Note that keybindings to **start** modes live in the binding table of the
insert mode, not the target mode. For instance, if you want to be able to use
<span class="key">Alt-l</span> to start location mode, you should modify
`$edit:binding[insert][Alt-l]`:

```elvish
edit:binding[insert][Alt-l] = { edit:location:start }
```

One particular mode to note is the history mode. The fact that you can press
<span class="key">▲&#xfe0e;</span>
to start searching and going to an earlier item relies on two binding entries,
`$edit:binding[insert][Up]` and `$edit:binding[history][Up]`. So for instance
if you want to be able to use <span class="key">Ctrl-P</span> for this, you
need to modify two bindings:

```elvish
edit:binding[insert][Up] = { edit:history:start }
edit:binding[history][Up] = { edit:history:up }
```

## Format of Keys

TBD


# Hooks

Hooks in Elvish are provided by lists of functions. There are current two
hooks: `$edit:before-readline` and `$edit:after-readline`. Their elements are
called, before the editor reads code and after that, respectively. For
instance, if you do the following:

```elvish
edit:before-readline = [{ echo 'before readline!' }]
edit:after-readline = [{ echo 'after readline!' }]
```

Then every time you accept a chunk of code (and thus leaving the editor),
`after readline!` is printed; and at the very beginning of an Elvish session,
or after a chunk of code is executed, `before readline!` is printed.


# Argument completer API

There are two types of completions in Elvish: completion for internal data and
completion for command arguments. The former includes completion for variable
names (e.g. `echo $`<span class="key">Tab</span>) and indicies (e.g. `echo
$edit:binding[`<span class="key">Tab</span>). These are the completions that
Elvish can provide itself because they only depend on the internal state of
Elvish.

The latter, in turn, is what happens when you type e.g. `cat `<span
class="key">Tab</span>. Elvish cannot provide completions for them without full
knowledge of the command.

Command argument completions are programmable via the `$edit:completer`. When
Elvish is completing an argument of command `$x`, it will call the value stored
in `$edit:completer[$x]`, with all the existing arguments, plus the command
name in the front.

For example, if the user types `man 1`<span class="key">Tab</span>, Elvish will call:

```elvish
$edit:completer[man] man 1
```

If the user starting a new argument when hitting <span class="key">Tab</span>,
Elvish will call the completer with a trailing empty string. For instance, if
you do `man 1`<span class="key">Space</span><span class="key">Tab</span>,
Elvish will call:

```elvish
$edit:completer[man] man 1 ""
```

The output of this call becomes candidates. There are several ways of
outputting candidates:

*   Writing byte output, e.g. "echo cand1; echo cand2". Each line becomes a
    candidate. This has the drawback that you cannot put newlines in
    candidates. Only use this if you are sure that you candidates will not
    contain newlines -- e.g. package names, usernames, but **not** file names,
    etc..

*   Write strings to value output, e.g. "put cand1 cand2". Each string output
    becomes a candidate.

*   Use the `edit:complex-candidate` command:

    ```elvish
    edit:complex-candidate &code-suffix='' &display-suffix='' &style='' $stem
    ```

    **TODO**: Document this.

After receiving your candidates, Elvish will match your candidates against what
the user has typed. Hence, normally you do not need to do any matching yourself
(and shouldn't -- because the matching algorithm will also be programmable).
That means that in many cases you (and should) can simpy ignore the last
argument to your completer. However, they can be useful for deciding what
**kind** of things to complete. For instance, if you are to write a completer
for `ls`, you want to see whether the last argument starts with `-` or not: if
it does, complete an option; and if not, complete a filename.

Here is a very basic example of configuring a completer for the `apt` command.
It only supports completing the `install` and `remove` command and package
names after that:

```elvish
all-packages = [(apt-cache search '' | eawk { put $1 })]

edit:completer[apt] = {
    n = (count $args)
    if (eq $n 2) {
        # apt c<Tab> -- complete a subcommand name
        put install uninstall
    } elif (eq $n 3) {
        put $@all-packages
    }
}
```
