<!-- toc number-sections -->

# Introduction

This is a reference manual for the Elvish programming language. It is written in an informal style, but nonetheless tries to be unambiguous. It is reorganized mostly in terms of syntax constructs.

Some familarity with the language is assumed: examples for one construct might use another construct that has not yet been introduced (only in some basic form, though). If you are completely new to Elvish, please read one of the [tutorials](../learn) first.

Some definitions that will be used:

*   An **inline whitespace** is a space or tab.

*   A **whitespace** is a newline or inline whitespace.


# String

There are three possible syntaxes for strings.

*   Everything a pair of inside **single quotes** represent themselves. For
    instance, ``'*\'`` evaluates to ``*\``. To write a single quote, double it:
    ``'it''s'`` evaluates to ``it's``.

*   Within **double quotes**, there are **C-like** escape sequences starting
    with ``\``. For instance, ``"\n"`` evaluates to a newline; ``"\\"``
    evaluates to a backslash; ``"\*"`` is a syntax error because stars do not
    need escaping in double quotes.

    There is no interpolation in double quotes. For instance, `"$USER"`
    evaluates to the string `$USER`.

*   **Barewords** are sequences of non-metacharacters and do not need quoting.
    Examples are `a.txt`, `long-bareword`, and `/usr/local/bin`.
    Eventually we will define formally what characters are meta and what are
    not.

    Unlike traditional shells, metacharacters cannot be escaped with ``\``;
    they must be quoted. For instance, to echo a star, write `echo "*"` or
    `echo '*'`, **not** ``echo \*``.  (Currently ``\`` stands for itself, so
    ``echo \*`` echoes ``\*``, but this is subject to change.)

These three syntaxes all evaluate to strings: they are interchangeable. For instance, `xyz`, `'xyz'` and `"xyz"` are different syntaxes for the same string, and they are always equivalent.

Note that elvish does **not** have number types; this is partly a consequence of barewords being a syntax for strings. For instance, in the command `+ 1 2`, both `1` and `2` are strings, and it is the command `+` that knows to treat its arguments as numbers.

# List and Map

Lists and maps are the basic container types in Elvish.

## List

Lists are surround by square brackets `[ ]`, with elements separated by
whitespaces. Examples:

```elvish
~> put [lorem ipsum]
▶ [lorem ipsum]
~> put [lorem
        ipsum
        foo
        bar]
▶ [lorem ipsum foo bar]
```

Note that commas are non-metacharacters and represent themselves, so don't use
them to separate elements:

```elvish
~> li = [a, b]
~> put $li
▶ [a, b]
~> put $li[0]
▶ a,
```

## Map

Maps are also surrounded by square brackets; elements are written like
`&key=value` (think HTTP query parameters) and separated by whitespaces.
Whitespaces are allowed after `=`, but not before `=`. Examples:

```elvish
~> put [&foo=bar &lorem=ipsum]
▶ [&foo=bar &lorem=ipsum]
~> put [&a=   10
        &b=   23
        &sum= (+ 10 23)]
▶ [&a=10 &b=23 &sum=33]
```

An empty map is written as `[&]`.


# Variable

## Assignment

A variable can be assigned by writing its name, followed by `=` and the value to assign. There **must** be spaces both before and after `=`. Example:

```elvish
~> foo = bar
```

You can assign multiple values to multiple variables simultaneously:

```elvish
~> x y = 3 4
```

## Using

When referencing a variable, add a `$` before its name:

```elvish
~> foo = bar
~> x y = 3 4
~> put $foo
▶ bar
~> put $x
▶ 3
```

Variables must be assigned before use. Attempting to use a variable before assigning will cause a **compilation error**:

```elvish
~> echo $x
Compilation error: variable $x not found
  [interactive], line 1:
    echo $x
~> { echo $x }
Compilation error: variable $x not found
  [interactive], line 1:
    { echo $x }
```

## Exploding and Rest Variable

When referencing a list variable, add `@` before the name to get all contained values:

```elvish
~> li = [lorem ipsum foo bar]
~> put $li
▶ [lorem ipsum foo bar]
~> put $@li
▶ lorem
▶ ipsum
▶ foo
▶ bar
```

If the variable is `args`, you can omit the variable name -- `$@` is equivalent to `$@args`. This is a trick to make `$@` mean roughly the same thing as `"$@"` in POSIX shell. It is most useful when writing wrapper functions: the following code defines an `ll` function that calls `ls` with `-l`, followed by all arguments it was given:

```elvish
fn ll { ls -l $@ }
```

To turn a list that is not already a variable into all its values, use the [explode](stdlib.html#explode) builtin.


When assigning variables, if you prefix the name of the last variable with `@`, it becomes a list containing all remaining values. That variable is called a **rest variable**. Example:

```elvish
~> a b c @d = (range 10)
~> put $a $b $c $d
▶ 0
▶ 1
▶ 2
▶ [3 4 5 6 7 8 9]
```


## Temporary Assignment

You can prepend a command with **temporary assignments** that look like `x=1`.
Note:

*   There shall be no space around `=`.

*   You can have multiple temporary assignments in one command, like `x=1 y=2
    command`.

*   If you need to have multiple variables on the left hand of one assignment,
    group them with braces: `{x y}=(put 1 2) command`.

Temporary assignments, as the name indicates, are undone after the command
finishes, whether it has thrown an error or not:

*   If a variable existed before, it reverts to its old value.

*   If not, its value becomes the empty string.

Example:

```elvish
~> x = 1
~> x=100 echo $x
100
~> echo $x
1
```

Note that the behavior is different from that of bash or zsh. In bash or zsh,
temporary assignments to variable `$x` do not affect its direct appearance in
the command:

```sh
bash-4.4$ x=1
bash-4.4$ x=100 echo $x
1
```

You can also prepend (ordinary) assignments with temporary assignments.

```elvish
~> x=1
~> x=100 y = (+ 133 $x)
~> put $x $y
▶ 1
▶ 233
```


## Scoping rule

Elvish has lexical scoping, and each block has its own scope.

When you use a variable, Elvish looks for it in the current lexical scope, then its parent lexical scope, until the root scope:

```elvish
~> x = 12
~> { echo $x } # $x is in the root scope
12
~> { y = bar; { echo $y } } # $y is in the outer block
bar
```

When you assign a variable, Elvish does the same searching; only if no such variable is found, it creates this new variable on the current (innermost) scope:

```elvish
~> x = 12
~> { x = 13 } # assigns to x in the root scope
~> echo $x
13
~> { z = foo } # creates z in the innermost scope
~> echo $z
Compilation error: variable $z not found
  [interactive], line 1:
    echo $z
```

This means that Elvish will not shadow your variable in outer scopes by default. You can force Elvish to create an identically named variable as one on the outer scope, and thus shadowing it, by using the `local:` pseudo-namespace:

```elvish
~> x = 12
~> { local:x = 13; echo $x } # force shadowing
13
~> echo $x
12
```

After force shadowing, you can access the variable in the outer scope using the `up:` pseudo-namespace:

```elvish
~> x = 12
~> { local:x = 14; echo $x $up:x }
14 12
```

The `local:` and `up:` pseudo-namespaces can also be used on non-shadowed variables, although they are not useful in those cases:

```elvish
~> foo = a
~> { echo $up:foo } # $up:foo is the same as $foo
a
~> { bar = b; echo $local:bar } # $local:bar is the same as $bar
b
```


# Lambda

Lambdas can be either **signatureless** of **signatureful**.

Signatureless lambdas are written like `{ command ... }`. The space after `{` is
significant: without it, Elvish will parse a braced list. Example:

```elvish
~> f = { echo Hi }
~> put $f
▶ <closure 0xc420450540>
~> $f
Hi
```

Signatureless lambdas accept arbitrary arguments and options, which are
available as the `$args` list and the `$opts` map, respectively. Moreover,
variable `$0`, `$1`, ... are shorthands for `$args[0]`, `$args[1]`, etc.:

```elvish
~> f = { put $args $opts $1 $0 }
~> $f lorem ipsum dolar sit &k=v
▶ [lorem ipsum dolar sit]
▶ [&k=v]
▶ ipsum
▶ lorem
```

If you stick a list before the lambda, it becomes a signatureful lambda:
`[a b]{ put $b $a }`. Note there should be no space between
`]` and `{`; otherwise Elvish parses a list and a lambda.

When calling a signatureful lambda, number of arguments must match the
signature:

```elvish
~> [a b]{ put $b $a } lorem ipsum
▶ ipsum
▶ lorem
~> [a b]{ put $b $a } lorem
Exception: arity mismatch
Traceback:
  [interactive], line 1:
    [a b]{ put $b $a } lorem
```

Like assignments, if the last argument in the list starts with `@`, it becomes a **rest argument** and will be a list containing all remaining arguments:

```elvish
~> f = [a @rest]{ put $a $rest }
~> $f lorem
▶ lorem
▶ []
~> $f lorem ipsum dolar sit
▶ lorem
▶ [ipsum dolar sit]
```

This is similar to `*rest` in Python, or `rest ...T` in Go.

You will be able to declare options in signatures as well ([#82](https://github.com/elves/elvish/issues/82)).


# Indexing

## List Indexing

Lists can be indexed with any of the following three ways:

*   A nonpositive integer, which is a 0-based index. For instance, if `$li` is a list, `$li[0]` is its first element, and `$li[1]` is its second element, and so on.

*   A negative integer, which counts from the back. For instance, `$li[-1]` is its last element.

*   A slice, which is a **single string** made up of two integers `a` and `b` with a colon in between. The result is a list made up of elements `$li[a]` up to, but not including, `$li[b]`. Both integers may be omitted; `a` defaults to 0 while `b` defaults to the size of `$li`.

Examples:

```elvish
~> li = [lorem ipsum foo bar]
~> put $li[0]
▶ lorem
~> put $li[-1]
▶ bar
~> put $li[0:2]
▶ [lorem ipsum]
```

This feature is stolen from Python.

## String indexing

Strings should always be UTF-8, and they can indexed by *byte indicies where codepoints start*, and indexing results in *the codepoint that starts there*. This is best explained with examples:

*   In the string `elv`, every codepoint is encoded with only one byte, so 0, 1, 2 are all valid indices:

    ```elvish
    ~> put elv[0]
    ▶ e
    ~> put elv[1]
    ▶ l
    ~> put elv[2]
    ▶ v
    ```

*   In the string `世界`, each codepoint is encoded with three bytes. The first codepoint occupies byte 0 through 2, and the second occupies byte 3 through 5. Hence valid indicies are 0 and 3:

    ```elvish
    ~> put 世界[0]
    ▶ 世
    ~> put 世界[3]
    ▶ 界
    ```

Strings can also be indexed by slices.

This idea of indexing codepoints by their byte positions is stolen from Julia.

## Map indexing

Maps are indexed by their keys. There is no slice indexing, and `:` does not have a special meaning. Examples:

```elvish
~> map = [&a=lorem &b=ipsum &a:b=haha]
~> echo $map[a]
lorem
~> echo $map[a:b]
haha
```

## Multiple indices

If you put multiple values in the index, you get multiple values: `$li[x y z]` is equivalent to `$li[x] $li[y] $li[z]`. This applies to all indexable values. Examples:

```elvish
~> put elv[0 2 0:2]
▶ e
▶ v
▶ el
~> put [lorem ipsum foo bar][0 2 0:2]
▶ lorem
▶ foo
▶ [lorem ipsum]
~> put [&a=lorem &b=ipsum &a:b=haha][a a:b]
▶ lorem
▶ haha
```


# Output Capture

Output capture is formed by putting parentheses around a code chunk. It redirects the output of the chunk into an internal pipe, and evaluates to all the values that have been output.

```elvish
~> + 1 10 100
▶ 111
~> x = (+ 1 10 100)
~> put $x
▶ 111
~> put lorem ipsum
▶ lorem
▶ ipsum
~> x y = (put lorem ipsum)
~> put $x
▶ lorem
~> put $y
▶ ipsum
```

If the chunk outputs bytes, Elvish strips the last newline (if any), and split them by newlines, and consider each line to be one (string) value:

```elvish
~> put (echo "a\nb")
▶ a
▶ b
```

If the chunk outputs both values and bytes, the values of output capture will contain both value outputs and lines, but the original order of output is not guaranteed.

```elvish
~> put (put a; echo b) # value order need not be the same as output order
▶ b
▶ a
```


# Error Capture

Error capture is formed by putting `?()` around a code chunk. It runs the chunk and catch the error it throws, and evaluates to that error.

```elvish
~> fail bad
Exception: bad
Traceback:
  [interactive], line 1:
    fail bad
~> put ?(fail bad)
▶ ?(fail bad)
```

If there was no error, it evaluates to `$ok`:

```elvish
~> nop
~> put ?(nop)
▶ $ok
```

Remember that errors are false-ish and `$ok` is true-ish. This is useful in `if`:

```elvish
if ?(test -d ./a) {
  # ./a is a directory
}
```


# Tilde Expansion

Tildes are special when they appear at the beginning of a word (the meaning of "word" will be explained later). The string after it, up to the first `/` or the end of the word, is taken as a user name; and they together evaluate to the home directory of that user. If the user name is empty, the current user is assumed.

In the following example, the home directory of the current user is `/home/xiaq`, while that of the root user is `/root`:

```elvish
~> put ~
▶ /home/xiaq
~> put ~root
▶ /root
~> put ~/xxx
▶ /home/xiaq/xxx
~> put ~root/xxx
▶ /root/xxx
```

Note that tildes are not special when they appear elsewhere in a word:

```elvish
~> put a~root
▶ a~root
```

If you need them to be, surround them with braces (the reason this works will be explained later):

```elvish
~> put a{~root}
▶ a/root
```


# Wildcard Patterns

**Wildcard patterns** are patterns containing **wildcards**, and they evaluate to all filenames they match.

We will use this directory tree in examples:

```
.x.conf
a.cc
ax.conf
foo.cc
d/
|__ .x.conf
|__ ax.conf
|__ y.cc
.d2/
|__ .x.conf
|__ ax.conf
```

Elvish supports the following wildcards:

*   `?` matches one arbitrary character except `/`. For example, `?.cc`
    matches `a.cc`;

*   `*` matches any number of arbitrary characters except `/`. For example,
    `*.cc` matches `a.cc` and `foo.cc`;

*   `**` matches any number of arbitrary characters including `/`. For example,
    `**.cc` matches `a.cc`, `foo.cc` and `b/y.cc`.

By default,

*   When the entire wildcard pattern has no match, an error is thrown.

*   None of the wildcards matches `.` at the beginning of filenames. For example:

    *   `?x.conf` does not match `.x.conf`;

    *   `d/*.conf` does not match `d/.x.conf`;

    *   `**.conf` does not match `d/.x.conf`.

Both behaviors can be changed by a modifier, the former by a global modifier and the latter by a local modifier.

## Modifiers

Wildcards can be **modified** using the same syntax as indexing, e.g. `*[mod1
mod2]`. There are two kinds of modifiers.

**Global modifiers** apply to the whole pattern and can be placed after any
wildcard:

*   `nomatch-ok` tells elvish not to throw an error when there is no match for
    the pattern. For instance, in the example directory `put bad*` will be an
    error, but `put bad*[nomatch-ok]` does exactly nothing.

*   `but:xxx` (where `xxx` is any filename) excludes the filename from the final
    result.

Although global modifiers affect the entire wildcard pattern, you can add it after any wildcard, and the effect is the same. For example, `put */*[nomatch-ok].cpp` and `put *[nomatch-ok]/*.cpp` do the same thing.

On the other hand, you must add it after a wildcard, instead of after the entire pattern: `put */*.cpp[nomatch-ok]` unfortunately does not do the correct thing.

**Local modifiers** only apply to the wildcard it immediately follows:

*   `match-hidden` tells the wildcard to match `.` at the beginning of
    filenames, e.g. `*[match-hidden].conf` matches `.x.conf` and `ax.conf`.

    Being a local modifier, it only applies to the wildcard it immediately
    follows. For instance, `*[match-hidden]/*.conf` matches `d/ax.conf` and
    `.d2/ax.conf`, but not `d/.x.conf` or `.d2/.x.conf`.

*   Character matchers restrict the characters to match:

    *   Character sets, like `set:aeoiu`;

    *   Character ranges like `range:a-z` (including `z`) or `range:a~z` (excluding `z`);

    *   Character classes: `control`, `digit`, `graphic`, `letter`, `lower`,
        `mark`, `number`, `print`, `punct`, `space`, `symbol`, `title`, and
        `upper`. See the Is* functions [here](https://godoc.org/unicode) for
        their definitions.

    Note the following caveats:

    *   If you have multiple matchers, they are OR'ed. For instance,
        ?[set:aeoiu digit] matches `aeoiu` and digits.

    *   `.` at the beginning of filenames always require an explicit
        `match-hidden`. For example, `?[set:.a]x.conf` does **not** match
        `.x.conf`; use `?[set:.a match-hidden]x.conf`.

    *   `?` and `*` never matches slashes, and `**` always does. This behavior
        is not affected by character matchers.


# Compounding and Braced List

Writing two strings together will concatenate them. This is called **compounding** in elvish, because it mimics the formation of compound words in natural languages. Examples:

```elvish
~> put 'a'b"c" # compounding three string literals
▶ abc
~> v = value
~> put '$v is '$v # compounding one string literal with one string variable
▶ '$v is value'
```

Some constructs can generate multiple values, like indexing with multiple indices and output captures. Compounding multiple values with other values generates all possible combinations:

```elvish
~> put (put a b)-(put 1 2)
▶ a-1
▶ a-2
▶ b-1
▶ b-2
```

Note the order of the generated values. The value that comes later changes faster.

NOTE: There is a perhaps a better way to explain the ordering, but you can think of the previous code as equivalent to this:

```elvish
for x [a b] {
  for y [1 2] {
    put $x-$y
  }
}
```

In practice, you never have to write `(put a b)`: you can use a braced list `{a,b}`:

```elvish
~> put {a,b}-{1,2}
▶ a-1
▶ a-2
▶ b-1
▶ b-2
```

Elements in braced lists can also be separated with whitespaces, or a combination of comma and whitespaces (the latter not recommended):

```elvish
~> put {a b , c,d}
▶ a
▶ b
▶ c
▶ d
```

In future, the syntax might stricten to force you to use either comma or whitespaces consistently within one braced list.

Braced list is merely a syntax for grouping values; it is not a data structure.


# Word Structure and Evaluation

Braced lists are evaluated before being compounded with other values. You can use this to affect the order of evaluation. For instance, `put *.txt` gives you all filenames that end with `.txt` in the current directory; while `put {*}.txt` gives you all filenames in the current directory, appended with `.txt`.


# Command

A **command** can consist of several parts.

## Head

The **head** must appear first. It is an arbitrary word that determines what will be run. Examples:

```elvish
~> ls -l # the string ls is the head
(output omitted)
~> (put ls) -l # (put ls) is the head
(same output)
```

The head must evaluate to one value. For instance, the following does not work:

```elvish
~> (put ls -l)
Exception: head of command must be 1 value; got 2
Traceback:
  [interactive], line 1:
    (put ls -l)
```

The definition of barewords is relaxed for the head to include `<`, `>`, `*` and `^`. These are all names of numeric builtins:

```elvish
~> < 3 5 # less-than
▶ $true
~> > 3 5 # greater-than
▶ $false
~> * 3 5 # multiplication
▶ 15
~> ^ 3 5 # power
▶ 243
```

## Arguments and Options

**Arguments** (args for short) and **options** (opts for short) are data passed to the command. Arguments are arbitrary words, while options have the same syntax as map pairs:

```elvish
~> splits &sep=: /home:/root # &sep=: is an option; /home:/root is an argument
▶ /home
▶ /root
```

## Redirections

Redirections are used for modifying file descriptors (fd).

The most common form of redirections opens a file and associates it with an fd. The form consists of an optional destination fd (like `2`), a redirection operator (like `>`) and a filename (like `error.log`):

*   The destination fd determines which fd will be modified; if absent, it is determined from the redirection operator. If present, there must be no space between the fd and the redirection operator. (Otherwise Elvish parses it as an argument.)

*   The redirection operator determines the mode to open the file, and the default destination fd.

*   The filename names a file to open.

Possible redirection operators are:

*   `<` for reading. The default fd is 0.

*   `>` for writing. The default fd is 1.

*   `>>` for appending. The default fd is 1.

*   `<>` for reading and writing. The default fd is 1.

Examples:

```elvish
~> echo haha > log
~> cat log
haha
~> cat < log
haha
~> ls --bad-arg 2> error
Exception: ls exited with 2
Traceback:
  /home/xiaq/.elvish/rc.elv, line 1:
    fn ls { e:ls --color=auto $@ }
  [interactive], line 1:
    ls --bad-arg 2> error
~> cat error
/bin/ls: unrecognized option '--bad-arg'
Try '/bin/ls --help' for more information.
```

Redirections can also be used for closing or dupping file descriptors. Use `&n` (where `n` is a number) for dupping, and `&-` for closing. In this case, the redirection operator is irrevelant. Examples:

```elvish
~> ls >&-
/bin/ls: write error: Bad file descriptor
Exception: ls exited with 2
Traceback:
  /home/xiaq/.elvish/rc.elv, line 1:
    fn ls { e:ls --color=auto $@ }
  [interactive], line 1:
    ls >&-
```

If you have multiple related redirections, they are applied in the order they appear. For instance:

```elvish
~> fn f { echo out; echo err >&2 } # echoes "out" on stdout, "err" on stderr
~> f >log 2>&1 # use file "log" for stdout, then use (changed) stdout for stderr
~> cat log
out
err
```


## Ordering

The ordering of arguments, options and redirections is arbitrary: they can intermix each other. The only requirement is that the head must come first. This is different from POSIX shells, where redirections may appear before the head.


# Special Commands

**Special commands** obey the same syntax rules as normal commands, but have evaluation rules that are custom to each command. To explain this, we use the following example:

```elvish
~> or ?(echo x) ?(echo y) ?(echo z)
x
▶ $ok
```

In the example, the `or` command first evaluates its first argument, which has the value `$ok` (a truish value) and the side effect of outputting `x`. Due to the custom evaluation rule of `or`, the rest of the arguments are not evaluated.

If `or` were a normal command, the code above is still syntactically correct. However, Elvish would then evaluate all its arguments, with the side effect of outputting `x`, `y` and `z`, before calling `or`.


## `and` and `or`


## if

Syntax:

```elvish
if <condition> {
    <body>
} elif <condition> {
    <body>
} else {
    <else-body>
}
```

## while

Syntax:

```elvish
while <condition> {
    <body>
} else {
    <else-body>
}
```

## for

Syntax:

```elvish
for <var> <iterable> {
    <body>
} else {
    <body>
}
```

## try

Syntax:

```elvish
try {
    <try-block>
} except [except-varname] {
    <except-block>
} else {
    <else-block>
} finally {
    <finally-block>
}
```

Only `try` and `try-block` are required. This control structure behaves as follows:

1.  The `try-block` is always executed first.

2.  If `except` is present and an exception occurs in `try-block`, it is
    caught and stored in `except-varname`, and `except-block` is executed.

3.  If no exception occurs and `else` is present, `else-block` is executed.

4.  In all cases, `finally-block` is executed.

5.  If the exception was not caught (i.e. `except` is not present), it is
    rethrown after the execution of `finally-block`.

Exceptions thrown in blocks other than `try-block` are not caught. If an
exception was thrown and either `except-block` or `finally-block` throws
another exception, the original exception is lost.

Examples:

1.  `try { fail bad }` throws `bad`; it is equivalent to a plain `fail bad`.

2.  `try { fail bad } except e { echo $e }` prints out an exception constructed
    from `haha` (the format is subject to change in future).

3.  `try { nop } else { echo well }` prints out `well`.

4.  `try { fail bad } finally { echo final }` prints out `final` and then
    throws `bad`.

5.  `try { echo good } finally { echo final }` prints out `good` and `final`.

6.  `try { fail bad } except e { fail worse }` throws `worse`.

7.  `try { fail bad } except e { fail worse } finally { fail worst }` throws `worst`.


## fn


## use

To have reusable modules, put them under `~/.elvish/lib`. To load them, use
`use`. Modules are executed in its own namespace. Example:

```sh
~> cat ~/.elvish/lib/a.elv
echo "mod a loading"
fn f {
  echo "f from mod a"
}
~> use a
mod a loading
~> a:f
f from mod a
```

Source files in directories become nested modules. For instance,
`~/.elvish/lib/lorem/ipsum.elv` is the source file for module `lorem:ipsum`.


# Pipeline
