The `edit:` module is the interface to the Elvish editor.

Function usages are given in the same format as in the [reference for the
builtin module](/ref/builtin.html).

*This document is incomplete.*

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
