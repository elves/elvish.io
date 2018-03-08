<!-- toc -->

The `edit:` module is the interface to the Elvish editor.

Function usages are given in the same format as in the [reference for the
builtin module](/ref/builtin.html).

*This document is incomplete.*

# Overview

## Modes and Submodules

The Elvish editor has different **modes**, and exactly one mode is active at
the same time.  Each mode has its own UI and keybindings. For instance, the
default **insert mode** lets you modify the current command. The **completion
mode** (triggered by <span class="key">Tab</span> by default) shows you all
candidates for completion, and you can use arrow keys to navigate those
candidates.

$ttyshot completion-mode

Each mode has its own submodule under `edit:`. For instance, builtin functions
and configuration variables for the completion mode can be found in the
`edit:navigation:` module.

The primary modes supported now are `insert`, `completion`, `navigation`,
`history`, `histlist`, `location`, and `lastcmd`. The last 4 are "listing
modes", and their particularity is documented below.


# Prompts

The left and right prompts can be customized by assigning functions to
`$edit:prompt` and `$edit:rprompt`. Their outputs are used as prompts.

# Keybindings

Each mode has its own keybinding, accessible as the `binding` variable in its
module. For instance, the binding table for insert mode is
`$edit:insert:binding`. To see current bindings, simply print the binding
table: `pprint $edit:insert:binding` (replace `insert` with any other mode).

A binding tables is simply a map that maps keys to functions. For instance, to
bind `Alt-x` in insert mode to exit Elvish, simply do:

```elvish
edit:insert:binding[Alt-x] = { exit }
```

Outputs from a bound function always appear above the Elvish prompt. You can see this by doing the following:

```elvish
edit:insert:binding[Alt-x] = { echo 'output from a bound function!' }
```

and press <span class="key">Alt-x</span> in insert mode. It allows you to put
debugging outputs in bound functions without messing up the terminal.

Internally, this is implemented by connecting their output to a pipe.
This does the correct thing in most cases, but if you are sure you want to do
something to the terminal, redirect the output to `/dev/tty`. For instance, the
following binds <span class="key">Ctrl-L</span> to clearing the terminal:

```elvish
edit:insert:binding[Ctrl-L] = { clear > /dev/tty }
```

Bound functions have their inputs redirected to /dev/null.


## Format of Keys

TBD

## Listing Modes

The modes `histlist`, `loc` and `lastcmd` are all **listing modes**: They all
show a list, and you can filter items and accept items.

Because they are very similiar, you may want to change their bindings at the
same time. This is made possible by the `$edit:listing:binding` binding table
(`listing` is not a "real" mode but an "abstract" mode). These modes still have
their own binding tables like `$edit:histlist:binding`, and bindings there have
highter precedence over those in the shared `$edit:listing:binding` table.

Moreover, there are a lot of builtin functions in the `edit:listing` module
like `edit:listing:down` (for moving down selection). They always apply to
whichever listing mode is active.


## Caveat: Bindings to Start Modes

Note that keybindings to **start** modes live in the binding table of the
insert mode, not the target mode. For instance, if you want to be able to use
<span class="key">Alt-l</span> to start location mode, you should modify
`$edit:insert:binding[Alt-l]`:

```elvish
edit:insert:binding[Alt-l] = { edit:location:start }
```

One tricky case is the history mode. You can press
<span class="key">▲&#xfe0e;</span> to start searching for history, and continue
pressing it to search further. However, when the first press happens, the
editor is in insert mode, while with subsequent presses, the editor is in
history mode. Hence this binding actually relies on two entries,
`$edit:insert:binding[Up]` and `$edit:history:binding[Up]`.

So for instance if you want to be able to use
<span class="key">Ctrl-P</span> for this, you need to modify both bindings:

```elvish
edit:insert:binding[Up] = { edit:history:start }
edit:history:binding[Up] = { edit:history:up }
```


# Completion API

## Argument Completer

There are two types of completions in Elvish: completion for internal data and
completion for command arguments. The former includes completion for variable
names (e.g. `echo $`<span class="key">Tab</span>) and indicies (e.g. `echo
$edit:insert:binding[`<span class="key">Tab</span>). These are the completions
that Elvish can provide itself because they only depend on the internal state
of Elvish.

The latter, in turn, is what happens when you type e.g. `cat `<span
class="key">Tab</span>. Elvish cannot provide completions for them without full
knowledge of the command.

Command argument completions are programmable via the `$edit:completion:arg-completer`
variable. When Elvish is completing an argument of command `$x`, it will call
the value stored in `$edit:completion:arg-completer[$x]`, with all the existing arguments,
plus the command name in the front.

For example, if the user types `man 1`<span class="key">Tab</span>, Elvish will call:

```elvish
$edit:completion:arg-completer[man] man 1
```

If the user is starting a new argument when hitting <span
class="key">Tab</span>, Elvish will call the completer with a trailing empty
string. For instance, if you do `man 1`<span class="key">Space</span><span
class="key">Tab</span>, Elvish will call:

```elvish
$edit:completion:arg-completer[man] man 1 ""
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
the user has typed. Hence, normally you don't need to (and shouldn't) do any
matching yourself.

That means that in many cases you can (and should) simpy ignore the last
argument to your completer. However, they can be useful for deciding what
**kind** of things to complete. For instance, if you are to write a completer
for `ls`, you want to see whether the last argument starts with `-` or not: if
it does, complete an option; and if not, complete a filename.

Here is a very basic example of configuring a completer for the `apt` command.
It only supports completing the `install` and `remove` command and package
names after that:

```elvish
all-packages = [(apt-cache search '' | eawk [0 1 @rest]{ put $1 })]

edit:completion:arg-completer[apt] = [@args]{
    n = (count $args)
    if (== $n 2) {
        # apt x<Tab> -- complete a subcommand name
        put install uninstall
    } elif (== $n 3) {
        put $@all-packages
    }
}
```


## Matcher

As stated above, after the completer outputs candidates, Elvish matches them
with them with what the user has typed. For clarity, the part of the user input
that is relevant to tab completion is called for the **seed** of the
completion. For instance, in `echo x`<span class="key">Tab</span>, the seed is
`x`.

Elvish first indexes the matcher table -- `$edit:completion:matcher` -- with the
completion type to find a **matcher**. The **completion type** is currently one
of `variable`, `index`, `command`, `redir` or `argument`. If the
`$edit:completion:matcher` lacks the suitable key, `$edit:completion:matcher['']` is used.


Elvish then calls the matcher with one argument -- the seed, and feeds
the *text* of all candidates to the input. The mather must output an identical
number of booleans, indicating whether the candidate should be kept.

As an example, the following code configures a prefix matcher for all
completion types:

```elvish
edit:completion:matcher[''] = [seed]{ each [cand]{ has-prefix $cand $seed } }
```

Elvish provides three builtin matchers, `edit:match-prefix`,
`edit:match-substr` and `edit:match-subseq`. In addition to conforming to the
matcher protocol, they accept two options `&ignore-case` and `&smart-case`.
For example, if you want completion of arguments to use prefix matching and
ignore case, use:

```elvish
edit:completion:matcher[argument] = [seed]{ edit:match-prefix $seed &ignore-case=$true }
```

The default value of `$edit:completion:matcher` is `[&''=$edit:match-prefix~]`, hence
that candidates for all completion types are matched by prefix.


# Hooks

Hooks are functions that are executed at certain points in time. In Elvish,
this functionality is provided by lists of functions.

There are current two hooks:

*   `$edit:before-readline`, whose elements are called before the editor reads
    code, with no arguments.

*   `$edit:after-readline`, whose elements are called, after the editor reads
    code, with a sole element -- the line just read.

Example usage:

```elvish
edit:before-readline = [{ echo 'going to read' }]
edit:after-readline = [[line]{ echo 'just read '$line }]
```

Then every time you accept a chunk of code (and thus leaving the editor),
`just read ` followed by the code is printed; and at the very beginning of an
Elvish session, or after a chunk of code is executed, `going to read` is
printed.


# Functions and Variables

Functions and variables who name start with `-` are experimental, will have
their names or behaviors changed in the near future. Others are more stable
(unless noted explicitly) but are also subject to change before the 1.0
release.

## edit:-dump-buf

Dump the content of onscreen buffer as HTML. This command is used to generate
"ttyshots" on [elvish.io](https://elvish.io).

Example:

```elvish
ttyshot = ~/a.html
edit:insert:binding[Ctrl-X] = { edit:-dump-buf > $tty }
```


## edit:styled

```elvish
edit:styled $text $styles
```

Construct an abstract styled text. The `$text` argument can be an arbitrary
string, while the `$styles` argument is a list or semicolon-delimited string
of the following styles:

* Text styles: `bold`, `dim`, `italic`, `underlined`, `blink`, `inverse`.

* Text colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`,
  `lightgray`, and their corresponding light colors: `gray`, `lightred`,
  `lightgreen`, `lightyellow`, `lightblue`, `lightmagenta`, `lightcyan` and
  `white`.

* Background colors: any of the text colors with a `bg-` prefix (e.g. `bg-red`
  for red background), plus `bg-default` for default background color.

* An [ANSI SGR
  parameter](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_.28Select_Graphic_Rendition.29_parameters)
  code (e.g. `1` for bold), subject to terminal support.

Note that the result of `edit:styled` is an abstract data structure, not an
ANSI sequence. However, it stringifies to an ANSI sequence, so you rarely have
to convert it. To force a conversion, use `to-string`:

```elvish-transcript
~> edit:styled haha green
▶ (edit:styled haha [green])
~> echo (edit:styled haha green) # output is green
haha
~> to-string (edit:styled haha green)
▶ "\e[32mhaha\e[m"
```

The forced conversion is useful when e.g. assigning to `$value-out-indicator`:

```elvish-transcript
~> value-out-indicator = (to-string (edit:styled '> ' green))
~> put lorem ipsum # leading '> ' is green
> lorem
> ipsum
```

The styled text can be inspected by indexing:

```elvish-transcript
~> s = (edit:styled haha green)
~> put $s[text] $s[styles]
▶ haha
▶ [green]
```


## $edit:current-command

Contains the content of the current input. Setting the variable will cause the
cursor to move to the very end, as if
`edit-dot = (count $edit:current-command)` has been invoked.

This API is subject to change.


## $edit:-dot

Contains the current position of the curosr, as a byte position within
`$edit:current-command`.


## $edit:max-height

Maximum height the editor is allowed to use, defaults to `+Inf`.

By default, the height of the editor is only restricted by the terminal
height. Some modes like location mode can use a lot of lines; as a result, it
can often occupy the entire terminal, and push up your scrollback buffer.
Change this variable to a finite number to restrict the height of the editor.


## $edit:completion:matcher

See [the Matcher section](#matcher).


## $edit:prompt

See [the Prompts section](#prompts).

## $edit:-prompts-eagerness

A number for controlling how eager the prompt and rprompt are updated:

*   The prompt and rprompt are always updated when the editor starts (e.g. by
    pressing Enter).

*   If `$edit-prompts-eagerness` >= 5, they are updated when the working
    directory changes.

*   If `$edit-prompts-eagerness` >= 10, they are updated on each keystroke.

The default value is 5.

## $edit:-prompts-max-wait

A time in seconds. If the execution of a prompt function exceeds this time,
the editor does not wait for it to finish; instead, it shows the old value of
the prompt with a marker, and updates the prompt again when the execution is
finished. Defaults to `+Inf`, which causes Elvish to block on the prompt
functions.

## $edit:rprompt

See [the Prompts section](#prompts).
