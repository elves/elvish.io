TBW: sth about the vision of elvish

# Hello, world!

Let's begin with the traditional "hello world" program:

```elvish
echo "Hello, world!"
```

Why not say hello to yourself as well?

```elvish
echo "Hello, world! Hello, "$E:USER"!"
```

If you compare it to the equivalent bash code

```sh
echo "Hello, world! Hello, $USER!"
```

you will notice two differences. First, environment variables have to be qualified by `E:` in elvish; this is because environment variables do not live on the default (unqualified) **namespace**, but rather the special `E` namespace. So `$USER` and `$E:USER` are different variables: the former only exists in the current process, while the latter will affect all child processes. There is no need for an `export` command in elvish: variables in the `E` namespace are exported while other variables are not.

Second, there is no string interpolation in elvish. Instead, the lack of spaces between `$E:USER` and two strings around it causes elvish to concatenate them.

# Hello, \\x1b[32mworld\\x1b[m!

Why not say hello to a green world? If you know [ASCII](https://en.wikipedia.org/wiki/ASCII), you will know that there are some invisible "control" characters, one of them being ESC. This character is used to start [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) (**not** related to the concept of escaping with a backslash), which can, among other things, give you colors.

In elvish, any ASCII character can be written with `"\x??"`, where `??` is two hex digits representing the value of the character. Hence the ESC character, whose value is 27, or 0x1b in hex, is written as `"\x1b"`. The sequences `"\x1b[31m"` tells the terminal to switch to green color for the text, and `"\x1b[m"` clears the color. Therefore to say hello to a green world, you would do:

```elvish
echo "Hello, \x1b[32mworld\x1b[m!"
```

As easy as it is, writing special characters like ESC is tricky in traditional shells. The program above works in zsh but not in bash: this is because double quotes in those shells do not really support the syntax of `"\x??"`; instead they keep the backslash as is. In zsh, it is the `echo` that understands `"\x??"`; while in bash such it is not understood unless you add a `-e` switch to `echo`.

This implies that while you can `echo` special characters like ESC (with `-e` in bash), it is more tricky to write special characters in other situations, like file names. If you have a file whose name contain a ESC character, you have to either use `$(echo "\x1b")` or embed an actual ESC character in your script.

I won't go into full details here, since for our purpose, it suffices to know that strings are much simpler in elvish:

*   Double-quoted strings are **C-like**: i.e. they support escape sequences
    like `\n` for newline, `\t` for tab, ``\\`` for backslash and so on. There
    is a special sequence, `\e` that is equivalent to `\x1b` -- this helps
    writing ANSI escape sequences. As we have seen, interpolations are not
    supported.

*   Single-quoted strings are **raw**: they support no escape sequences (so
    ``\`` has no special meaning), except that single quotes can be written by
    doubling them: ``'it''s\'`` represents the string ``it's\``.

*   Outside quotes, ``\`` has no special meaning. To write special characters
    like `$`, you must use quotes: `'$'` or `"$"` instead of `\$`. This makes
    it easier to write paths in Windows when elvish gets ported there.

Moreover, the `echo` builtin in elvish does not accept any switch starting with `-`:  `echo $x` always prints `$x` followed by a newline. The following

```elvish
x=-e
echo $x
```

prints nothing in bash and zsh, but `-e` in elvish. The `echo` command in traditional shells also have a `-n` switch to suppress the trailing newline. To suppress the newline in elvish, use the `print` builtin.

# Hello, &nbsp; &nbsp; world!

I just mentioned that `echo $x` always prints `$x`. This is indeed true:

```elvish
x='Hello,    world!'
echo $x # prints "Hello,    world!"
```

In bash, this prints `Hello, world!` -- the four spaces after the comma become one, which often comes as a surprise to newcomers. This is because bash will break `$x` into two arguments, `Hello,` and `world!` by splitting at the spaces. The `echo` command then join its arguments with a single space.

Such breakings do not happen in elvish. In elvish, `$x` is always exactly one argument. To be more precise, `$x` is always one **value**: besides being an argument to commands, it can also be e.g. filenames used for redirections. The following

```elvish
x="I am a file"
echo "I am some content" > $x
```

writes to a file named `I am a file`.

# Hello, everyone!

Now let's say you want to say hello to several people, and typing `Hello` repeatedly is tiresome. You can save some work by using a **for-loop**:

```elvish
for name in 'Julius Caesar'
            'Pompey the Great'
            'Marcus Licinius Crassus'; do
    echo 'Hello, '$name'!'
done
```

In elvish you can put newlines between the elements to loop over, as long as they are terminated by `; do`.

For easier reuse, you can also create a **list** to store the names:

```elvish
first-triumvirate=[
    'Julius Caesar'
    'Pompey the Great'
    'Marcus Licinius Crassus'
]
```

Lists are surrounded by square brackets, like in several other languages. Elements are separated by whitespaces.

<!-- Comma is a normal character in elvish; trailing commas will become part of the elements:

sh
a-list=[a, b, c]
echo $li[0] # a,
echo $li[1] # b,
echo $li[2] # c

-->

As you may have noticed, dashes are allowed in variable names. You are encouraged to use them instead of underscores; they are easier to type and more readable (after a little getting-used-to).

Now it's time to use our list of the first triumvirate:

```elvish
for name in $first-triumvirate; do
    echo 'Hello, '$name'!'
done
```

This will, however, results in an error, saying that a string and a list cannot be concatenated. Why? Remember that `$x` is always one value. This is even true for lists, so the `for` loop only sees one value to loop over, namely the list itself.

To make multiple words out of a list, you must explicitly **splice** the list with an `@` before the variable name:

```elvish
for name in $@first-triumvirate; do
    echo 'Hello, '$name'!'
done
```

# Each person gets $&hello'ed

The for-loop we just show can also be written in a functional style:

```elvish
each [name]{
    echo 'Hello, '$name'!'
} $first-triumvirate
```

This looks similar to the for-loop version, but it makes use of a remarkable construct -- an **anonymous function**, also known as a **lambda**. In elvish, a lambda is syntactically formed by an argument list followed immediately (without space) by a function body enclosed in braces. Here, `[name]{ echo 'Hello, '$name'!' }` is a lambda that takes exactly one argument and calls `echo` to do the helloing. We pass it along a list to the `each` builtin, which runs the function on each element of the list.

Functions, like strings and lists, can be stored in variables:

```elvish
hello=[name]{ echo 'Hello, '$name'!' }
each $hello $first-triumvirate
```

To call a function, simply use it as a command:

```elvish
$hello 'Mark Antony' # Hello, Mark Anthony!
```

You must have noticed that you have to use `$hello` instead of `hello` to call the function. This is because the *hello-the-variable* and *hello-the-command* are different enitites. To define new commands, use the `fn` special form:

```elvish
fn hello [name]{
    echo 'Hello, '$name'!'
}
hello Cicero # Hello, Cicero!
```

Users of traditional shells and Common Lisp will find this separation of the variable namespace and command namespace familiar.

However, in elvish this separation is only superficial; what `fn hello` really does is just defining a variable called `&hello`. You can prove this:

```elvish
echo $&hello # <closure ...>
$&hello Brutus # Hello, Brutus!
each $&hello $first-triumvirate # (Hello to the first triumvirate)
```

Conversely, defining a variable `&hello` will also create a command named `hello`:

```elvish
'&hello'=[name]{ echo "Hello, hello, "$name"!" }
hello Augustus # Hello, Augustus!
```

<!--
```
What I want to get into this document:

[ ] Command substitution

[ ] Rich pipeline

[X] Lists

[ ] Maps

[X] Lambdas

[X] fn

[X] $&

[X] One variable, one argument

[X] String syntax

[X] Lack of interpolation

[X] Several builtins -- each println

[ ] Editor API

[ ] Exception and verdict

[X] E: namespace for environment variables

[ ] e: namespace for external commands

[ ] Modules

Write for readers with a moderate knowledge of a POSIXy shell (bash, zsh, ...)
-->

