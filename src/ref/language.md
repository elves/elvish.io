<!-- toc number-sections -->

# Introduction

**Note to the reader**. This document is a work in progress. Some materials are
missing, and some are documented in a handwavy way. If you found something that
should be improved -- even if there is already a "TODO" for it -- please feel
free to ask on any of the chat channels. The developer will explain to you,
**and update the document**. Question-driven documentation :)

This is a reference manual for the Elvish programming language. It is written
in a not-so-formal style, but nonetheless tries to be precise.

Examples for one construct might use (the most familiar form of) another
construct that will be introduced later in the text, so familiarity with the
language is assumed. If you are new to Elvish, consider reading some of the
[learning materials](/learn). Also, the article on the [semantics highlight
semantics](/learn/semantics-highlight) of Elvish is worth reading, even if you
have used Elvish for a while.

A little terminology:

*   An **inline whitespace** is a space or tab.

*   A **whitespace** is a newline or inline whitespace.


# String

Let's start with the most common data structure in shells, the string. There
are three possible syntaxes for strings, single-quoted, double-quoted and
barewords:

*   Everything inside a pair of **single quotes** represent themselves. For
    instance, ``'*\'`` evaluates to ``*\``. To write a single quote, double it:
    ``'it''s'`` evaluates to ``it's``.

*   Within **double quotes**, there are **C-like** escape sequences starting
    with ``\``. For instance, ``"\n"`` evaluates to a newline; ``"\\"``
    evaluates to a backslash; ``"\*"`` is a syntax error because ``\*`` is not a
    valid escape sequence.

    There is no interpolation in double quotes. For instance, `"$USER"` simply
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

Note that Elvish does **not** have number types; this is partly a consequence of barewords being a syntax for strings. For instance, in the command `+ 1 2`, both `1` and `2` are strings, and it is the command `+` that knows to treat its arguments as numbers.

# List and Map

Lists and maps are the basic container types in Elvish.

## List

Lists are surround by square brackets `[ ]`, with elements separated by
whitespaces. Examples:

```elvish-transcript
~> put [lorem ipsum]
▶ [lorem ipsum]
~> put [lorem
        ipsum
        foo
        bar]
▶ [lorem ipsum foo bar]
```

Note that commas have no special meanings and just represent themselves, so
don't use them to separate elements:

```elvish-transcript
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

```elvish-transcript
~> put [&foo=bar &lorem=ipsum]
▶ [&foo=bar &lorem=ipsum]
~> put [&a=   10
        &b=   23
        &sum= (+ 10 23)]
▶ [&a=10 &b=23 &sum=33]
```

An empty map is written as `[&]`.


# Variable

Variables are holders of values with names. In most other shells, variables can map directly to environmental variables: `$PATH` is almost always the `PATH` environment variable. This is not the case in Elvish. Instead, environment variables are put in a dedicated `E:` namespace. `$PATH` and `$E:PATH` are different variables, and only the latter maps to the environment variable called `PATH`. The `$PATH` variable only lives in the Elvish process (and possibly only on a local scope).

You will notice that variable names sometimes have a leading dollar sign, sometimes not. The tradition is that they do when they are used for their values, and do not otherwise (e.g. in assignment). Elvish is consistent with other shells in this aspect.

## Assignment: Ordinary Assignment

A variable can be assigned by writing its name, followed by `=` and the value to assign. There **must** be spaces both before and after `=`. Example:

```elvish-transcript
~> foo = bar
```

You can assign multiple values to multiple variables simultaneously, simply by writing several variable names (separated by inline whitespaces) on the left-hand side, and several values on the right-hand side:

```elvish-transcript
~> x y = 3 4
```

## Use: Simple Use

When using the value of a variable, add a `$` before its name:

```elvish-transcript
~> foo = bar
~> x y = 3 4
~> put $foo
▶ bar
~> put $x
▶ 3
```

Variables must be assigned before use. Attempting to use a variable before assigning will cause a compilation error:

```elvish-transcript
~> echo $x
Compilation error: variable $x not found
  [interactive], line 1:
    echo $x
~> { echo $x }
Compilation error: variable $x not found
  [interactive], line 1:
    { echo $x }
```

## Use: Explosion

When using a list variable, you can add `@` before the name to get all contained values. This is called **exploding** the variable:

```elvish-transcript
~> li = [lorem ipsum foo bar]
~> put $li
▶ [lorem ipsum foo bar]
~> put $@li
▶ lorem
▶ ipsum
▶ foo
▶ bar
```

(This notation is restricted to exploding variables. To explode arbitrary values, use the builtin [explode](/ref/builtin.html#explode) command.)

If the variable is `args` (a special variable for function arguments), you can omit the variable name -- `$@` is equivalent to `$@args`. This is a trick to make `$@` mean roughly the same thing as `"$@"` in POSIX shell. It is most useful when writing wrapper functions: the following code defines an `ll` function that calls `ls` with an additional `-l` flag:

```elvish-transcript
~> fn ll { ls -l $@ }
~> ll -a
total 12
drwxr-xr-x 3 xiaq xiaq 4096 Jun 20  2016 .
drwxr-xr-x 8 xiaq xiaq 4096 Jun 25 02:26 ..
-rw-r--r-- 1 xiaq xiaq    0 Jun 20  2016 a
-rw-r--r-- 1 xiaq xiaq    0 Jun 20  2016 b
-rw-r--r-- 1 xiaq xiaq    0 Jun 20  2016 c
drwx------ 2 root xiaq 4096 Jun 20  2016 x
```


## Assignment: Rest Variable

When assigning variables, if you prefix the name of the last variable with `@`, it becomes a list containing all remaining values. That variable is called a **rest variable**. Example:

```elvish-transcript
~> a b @rest = 1 2 3 4 5 6 7
~> put $a $b $rest
▶ 1
▶ 2
▶ [3 4 5 6 7]
```

Schematically this is an inversive operation to variable explosion, which is why they share the `@` sign.


## Assignment: Temporary Assignment

You can prepend a command with **temporary assignments** like `x=1`. Rules:

*   There shall be no space around `=`.

*   You can have multiple temporary assignments in one command, like `x=1 y=2
    command`.

*   If you need to have multiple variables on the left hand of one assignment,
    group them with braces: `{x y}=(put 1 2) command`.

Temporary assignments, as the name indicates, are undone after the command
finishes, whether it has thrown an error or not:

*   If a variable existed before, it reverts to its old value.

*   If not, its value becomes the empty string. (This behavior will likely
    change to deleting the variable.)

Example:

```elvish-transcript
~> x = 1
~> x=100 echo $x
100
~> echo $x
1
```

Note that the behavior is different from that of bash or zsh in one important
place. In either of them, temporary assignments to variables do not affect
their direct use in the command:

```sh
bash-4.4$ x=1
bash-4.4$ x=100 echo $x
1
```

You can also prepend ordinary assignments with temporary assignments.

```elvish-transcript
~> x=1
~> x=100 y = (+ 133 $x)
~> put $x $y
▶ 1
▶ 233
```


## Scoping rule

Elvish has lexical scoping, and each block has its own scope.

When you use a variable, Elvish looks for it in the current lexical scope, then its parent lexical scope, until the root scope:

```elvish-transcript
~> x = 12
~> { echo $x } # $x is in the root scope
12
~> { y = bar; { echo $y } } # $y is in the outer block
bar
```

When you assign a variable, Elvish does the same searching; only if no such variable is found, it creates this new variable on the current (innermost) scope:

```elvish-transcript
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

This means that Elvish will not shadow your variable in outer scopes. You can force Elvish to create an identically named variable as one on the outer scope, and thus shadowing it, by using the `local:` pseudo-namespace:

```elvish-transcript
~> x = 12
~> { local:x = 13; echo $x } # force shadowing
13
~> echo $x
12
```

After force shadowing, you can still access the variable in the outer scope using the `up:` pseudo-namespace:

```elvish-transcript
~> x = 12
~> { local:x = 14; echo $x $up:x }
14 12
```

The `local:` and `up:` pseudo-namespaces can also be used on unshadowed variables, although they are not useful in those cases:

```elvish-transcript
~> foo = a
~> { echo $up:foo } # $up:foo is the same as $foo
a
~> { bar = b; echo $local:bar } # $local:bar is the same as $bar
b
```


# Lambda

Lambdas are first-class values in Elvish. When used as commands, they resemble
code blocks in C-like languages in syntax:

```elvish-transcript
~> { echo "Inside a lambda" }
Inside a lambda
```

The code above defines a lambda and calls it immediately. Since lambdas are
first-class values, you can assign them to variables and use them as arguments:

```elvish-transcript
~> f = { echo "Inside a lambda" }
~> put $f
▶ <closure 0x18a1a340>
~> $f
Inside a lambda
```

Lambdas can be either **signatureless** of **signatureful**.

## Signatureless Lambda

Signatureless lambdas are written like `{ command ... }`. Example:

```elvish-transcript
~> f = { echo Hi }
~> put $f
▶ <closure 0xc420450540>
~> $f
Hi
```

(Some whitespace after `{` **is required**: without whitespace, Elvish will
parse a braced list. A good style is to always put whitespaces around braces
when you are using them for lambdas.)

Signatureless lambdas accept arbitrary arguments and options; they are
available as the `$args` list and the `$opts` map, respectively:

```elvish-transcript
~> f = { put $args $opts }
~> $f lorem ipsum &foo=bar
▶ [lorem ipsum]
▶ [&foo=bar]
```

Moreover, variables `$0`, `$1`, etc. are shorthands for `$args[0]`, `$args[1]`,
etc.:

```elvish-transcript
~> f = { put $1 $0 }
~> $f foo bar
▶ bar
▶ foo
```

## Signatureful Lambda

A signatureful lambda looks just like a signatureless one, just with an
argument list in the front: `[a b]{ put $b $a }`. When calling a signatureful
lambda, number of arguments must match the signature:

```elvish-transcript
~> [a b]{ put $b $a } lorem ipsum
▶ ipsum
▶ lorem
~> [a b]{ put $b $a } lorem
Exception: arity mismatch
Traceback:
  [interactive], line 1:
    [a b]{ put $b $a } lorem
```

Note that in signatureful lambdas, there should be **no space** between
`]` and `{`; otherwise Elvish parses a list and a lambda.

Analogous to rest variables in assignments, If the last argument in the list
starts with `@`, it becomes a **rest argument** and its value is a list
containing all remaining arguments:

```elvish-transcript
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

Indexing is done by putting one or more **index expressions** in brackets after
a value.

## List Indexing

Lists are zero-based (i.e. the first element has index 0). They can be indexed
with any of the following three ways:

*   A non-negative integer, an offset counting from the beginning of the list.
    For example, `$li[0]` is the first element.

*   A negative integer, an offset counting from the back of the list. For
    instance, `$li[-1]` is its last element.

*   A slice `$a:$b`, where both `$a` and `$b` are integers. The result is
    sublist of `$li[$a]` upto, but not including, `$li[$b]`. For instance,
    `$li[4:7]` equals `[$li[4] $li[5] $li[6]]`, while `$li[1:-1]` contains all
    elements from `$li` except the first and last one.

    Both integers may be omitted; `$a` defaults to 0 while `$b` defaults to the
    length of the list.

    Note that the slice needs to be a **single** string, meaning that both
    integers must run together. For instance, `$li[2: 10]` is not the same as
    `$li[2:10]`, but rather the same as `$li[2:] $li[10]` (see "multiple
    indicies" below).

Examples:

```elvish-transcript
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

Strings should always be UTF-8, and they can indexed by **byte indicies at
which codepoints start**, and indexing results in **the codepoint that starts
there**.  This is best explained with examples:

*   In the string `elv`, every codepoint is encoded with only one byte, so 0,
    1, 2 are all valid indices:

    ```elvish-transcript
    ~> put elv[0]
    ▶ e
    ~> put elv[1]
    ▶ l
    ~> put elv[2]
    ▶ v
    ```

*   In the string `世界`, each codepoint is encoded with three bytes. The first
    codepoint occupies byte 0 through 2, and the second occupies byte 3 through
    5. Hence valid indicies are 0 and 3:

    ```elvish-transcript
    ~> put 世界[0]
    ▶ 世
    ~> put 世界[3]
    ▶ 界
    ```

Strings can also be indexed by slices.

This idea of indexing codepoints by their byte positions is stolen from Julia.

## Map indexing

Maps are simply indexed by their keys. There is no slice indexing, and `:` does
not have a special meaning. Examples:

```elvish-transcript
~> map = [&a=lorem &b=ipsum &a:b=haha]
~> echo $map[a]
lorem
~> echo $map[a:b]
haha
```

## Multiple indices

If you put multiple values in the index, you get multiple values: `$li[x y z]`
is equivalent to `$li[x] $li[y] $li[z]`. This applies to all indexable values.
Examples:

```elvish-transcript
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

Output capture is formed by putting parentheses around a code chunk. (A code
chunk is zero or more commands or pipelines, and will be described later.) It
redirects the output of the chunk into an internal pipe, and evaluates to all
the values that have been output.

```elvish-transcript
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

If the chunk outputs bytes, Elvish strips the last newline (if any), and split them by newlines, and consider each line to be one string value:

```elvish-transcript
~> put (echo "a\nb")
▶ a
▶ b
```

If the chunk outputs both values and bytes, the values of output capture will
contain both value outputs and lines, but the ordering between value output and
byte output might not agree with the order in which they happened:

```elvish-transcript
~> put (put a; echo b) # value order need not be the same as output order
▶ b
▶ a
```


# Exception Capture

Exception capture is formed by putting `?()` around a code chunk. It runs the chunk and evaluates to the exception it throws.

```elvish-transcript
~> fail bad
Exception: bad
Traceback:
  [interactive], line 1:
    fail bad
~> put ?(fail bad)
▶ ?(fail bad)
```

If there was no error, it evaluates to the special value `$ok`:

```elvish-transcript
~> nop
~> put ?(nop)
▶ $ok
```

Exceptions are booleanly false and `$ok` is booleanly true. This is useful in
`if` (introduced later):

```elvish-transcript
if ?(test -d ./a) {
  # ./a is a directory
}
```

Exception captures do not affect the output of the code chunk. You can combine
output capture and exception capture:

```
output = (error = ?(commands-that-may-fail))
```


# Tilde Expansion

Tildes are special when they appear at the beginning of an expression (the
exact meaning of "expression" will be explained later). The string after it, up
to the first `/` or the end of the word, is taken as a user name; and they
together evaluate to the home directory of that user. If the user name is
empty, the current user is assumed.

In the following example, the home directory of the current user is `/home/xiaq`, while that of the root user is `/root`:

```elvish-transcript
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

```elvish-transcript
~> put a~root
▶ a~root
```

If you need them to be, surround them with braces (the reason this works will be explained later):

```elvish-transcript
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

The following behaviors are default, although they can be altered by modifiers:

*   When the entire wildcard pattern has no match, an error is thrown.

*   None of the wildcards matches `.` at the beginning of filenames. For example:

    *   `?x.conf` does not match `.x.conf`;

    *   `d/*.conf` does not match `d/.x.conf`;

    *   `**.conf` does not match `d/.x.conf`.


## Modifiers

Wildcards can be **modified** using the same syntax as indexing. For instance, in `*[mod1 mod2]` the `*` wildcard is modified. There are two kinds of modifiers.

**Global modifiers** apply to the whole pattern and can be placed after any
wildcard:

*   `nomatch-ok` tells Elvish not to throw an error when there is no match for
    the pattern. For instance, in the example directory `put bad*` will be an
    error, but `put bad*[nomatch-ok]` does exactly nothing.

*   `but:xxx` (where `xxx` is any filename) excludes the filename from the final
    result.

Although global modifiers affect the entire wildcard pattern, you can add it
after any wildcard, and the effect is the same. For example, `put
*/*[nomatch-ok].cpp` and `put *[nomatch-ok]/*.cpp` do the same thing.

On the other hand, you must add it after a wildcard, instead of after the
entire pattern: `put */*.cpp[nomatch-ok]` unfortunately does not do the correct
thing. (This will probably be fixed.)

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


# Compound Expression and Braced Lists

Writing several expressions together with no space in between will concatenate
them. This creates a **compound expression**, because it mimics the formation
of compound words in natural languages. Examples:

```elvish-transcript
~> put 'a'b"c" # compounding three string literals
▶ abc
~> v = value
~> put '$v is '$v # compounding one string literal with one string variable
▶ '$v is value'
```

Many constructs in Elvish can generate multiple values, like indexing with
multiple indices and output captures. Compounding multiple values with other
values generates all possible combinations:

```elvish-transcript
~> put (put a b)-(put 1 2)
▶ a-1
▶ a-2
▶ b-1
▶ b-2
```

Note the order of the generated values. The value that comes later changes faster.

**NOTE**: There is a perhaps a better way to explain the ordering, but you can think of the previous code as equivalent to this:

```elvish-transcript
for x [a b] {
  for y [1 2] {
    put $x-$y
  }
}
```

## Braced Lists

In practice, you never have to write `(put a b)`: you can use a braced list `{a,b}`:

```elvish-transcript
~> put {a,b}-{1,2}
▶ a-1
▶ a-2
▶ b-1
▶ b-2
```

Elements in braced lists can also be separated with whitespaces, or a combination of comma and whitespaces (the latter not recommended):

```elvish-transcript
~> put {a b , c,d}
▶ a
▶ b
▶ c
▶ d
```

(In future, the syntax might be made more strict.)

Braced list is merely a syntax for grouping multiple values. It is not a data
structure.


# Expression Structure and Precedence

Braced lists are evaluated before being compounded with other values. You can
use this to affect the order of evaluation. For instance, `put *.txt` gives you
all filenames that end with `.txt` in the current directory; while `put
{*}.txt` gives you all filenames in the current directory, appended with
`.txt`.

**TODO**: document evaluation order regarding tilde and wildcards.


# Ordinary Command

The **command** is probably the most important syntax construct in shell
languages, and Elvish is no exception. In the terminology of this document, the
term **command** include scan several things: an ordinary assignment
(introduced before), an ordinary command (which is being introduced here), or a
special command.

An **ordinary command** consists of a compulsory head, and any number of
arguments, options and redirections.

## Head

The **head** must appear first. It is an arbitrary word that determines what will be run. Examples:

```elvish-transcript
~> ls -l # the string ls is the head
(output omitted)
~> (put ls) -l # (put ls) is the head
(same output)
```

The head must evaluate to one value. For instance, the following does not work:

```elvish-transcript
~> (put ls -l)
Exception: head of command must be 1 value; got 2
Traceback:
  [interactive], line 1:
    (put ls -l)
```

The definition of barewords is relaxed for the head to include `<`, `>`, `*`
and `^`. These are all names of numeric builtins:

```elvish-transcript
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

**Arguments** (args for short) and **options** (opts for short) can be supplied
to commands. Arguments are arbitrary words, while options have the same
syntax as map pairs. They are separated by inline whitespaces:

```elvish-transcript
~> splits &sep=: /home:/root # &sep=: is an option; /home:/root is an argument
▶ /home
▶ /root
```


## Redirections

Redirections are used for modifying file descriptors (FD).

The most common form of redirections opens a file and associates it with an FD.
The form consists of an optional destination FD (like `2`), a redirection
operator (like `>`) and a filename (like `error.log`):

*   The **destination fd** determines which FD to modify. If absent, it is
    determined from the redirection operator. If present, there must be no
    space between the fd and the redirection operator. (Otherwise Elvish parses
    it as an argument.)

*   The **redirection operator** determines the mode to open the file, and the
    destination fd if it is not explicitly specified.

*   The **filename** names the file to open.

Possible redirection operators and their default FDs are:

*   `<` for reading. The default FD is 0 (stdin).

*   `>` for writing. The default FD is 1 (stdout).

*   `>>` for appending. The default FD is 1 (stdout).

*   `<>` for reading and writing. The default FD is 1 (stdout).

Examples:

```elvish-transcript
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

Redirections can also be used for closing or duplicating FDs. Instead of
writing a filename, use `&n` (where `n` is a number) for duplicating, or `&-`
for closing. In this case, the redirection operator only determines the default
destination FD (and is totally irrevelant if a destination FD is specified).
Examples:

```elvish-transcript
~> ls >&- # close stdout
/bin/ls: write error: Bad file descriptor
Exception: ls exited with 2
Traceback:
  /home/xiaq/.elvish/rc.elv, line 1:
    fn ls { e:ls --color=auto $@ }
  [interactive], line 1:
    ls >&-
```

If you have multiple related redirections, they are applied in the order they appear. For instance:

```elvish-transcript
~> fn f { echo out; echo err >&2 } # echoes "out" on stdout, "err" on stderr
~> f >log 2>&1 # use file "log" for stdout, then use (changed) stdout for stderr
~> cat log
out
err
```


## Ordering

The ordering of arguments, options and redirections is arbitrary: they can
intermix each other. The only requirement is that the head must come first.
This is different from POSIX shells, where redirections may appear before the
head.


# Special Commands

**Special commands** obey the same syntax rules as normal commands (i.e.
syntactically special commands can be treated the same as ordinary commands),
but have evaluation rules that are custom to each command. To explain this, we
use the following example:

```elvish-transcript
~> or ?(echo x) ?(echo y) ?(echo z)
x
▶ $ok
```

In the example, the `or` command first evaluates its first argument, which has the value `$ok` (a truish value) and the side effect of outputting `x`. Due to the custom evaluation rule of `or`, the rest of the arguments are not evaluated.

If `or` were a normal command, the code above is still syntactically correct. However, Elvish would then evaluate all its arguments, with the side effect of outputting `x`, `y` and `z`, before calling `or`.


## Logics: `and` and `or`

The `and` special command evaluates its arguments from left to right; as soon
as a booleanly false value is obtained, it outputs the value and stops. When
given no arguments, it outputs `$true`.

The `or` special command is the same except that it stops when a booleanly true
value is obtained. When given no arguments, it outpus `$false`.


## Condition: `if`

**TODO**: Document the syntax notation, and perhaps use another one.

Syntax:

```elvish-transcript
if <condition> {
    <body>
} elif <condition> {
    <body>
} else {
    <else-body>
}
```

The `if` special command goes through the conditions one by one: as soon as one
evaluates to a booleanly true value, its corresponding body is executed. If
none of conditions are booleanly true and an else body is supplied, it is
executed.

The condition part is an expression, not a command like in other shells.

Tip: a combination of `if` and `?()` gives you a semantics close to other shells:

```elvish-transcript
if ?(test -d .git) {
    # do something
}
```

However, for Elvish's builtin predicates that output values instead of throw exceptions, the output capture construct `()` should be used.

**TODO**: add more examples.

## Conditional Loop: `while`

Syntax:

```elvish-transcript
while <condition> {
    <body>
} else {
    <else-body>
}
```

Execute the body as long as the condition evaluates to a booleanly true value.

The else body, if present, is executed if the body has never been executed
(i.e. the condition evaluates to a booleanly false value in the very
beginning).


## Iterative Loop: `for`

Syntax:

```elvish-transcript
for <var> <container> {
    <body>
} else {
    <body>
}
```

Iterate the container (e.g. a list). In each iteration, assign the variable to
an element of the container and execute the body.

The else body, if present, is executed if the body has never been executed
(i.e. the iteration value has no elements).


## Exception Control: `try`

(If you just want to capture the exception, you can use the more concise
exception capture construct `?()` instead.)

Syntax:

```elvish-transcript
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


## Function Definition: `fn`

Syntax:

```elvish-transcript
fn <name> <lambda>
```

Define a function with a given name. The function behaves in the same way to
the lambda used to define it, except that it "captures" `return`. In other
words, `return` will fall through lambdas not defined with `fn`, and continues
until it exits a function defined with `fn`:

```elvish-transcript
~> fn f {
     { echo a; return }
     echo b # will not execute
   }
~> f
a
~> {
     f
     echo c # executed, because f "captures" the return
   }
a
c
```

**TODO**: Find a better way to describe this. Hopefully the example is
illustrative enough, though.


## Importing Module: `use`

**TODO**: Namespacing deserves more explanation.

Reusable modules are Elvish source files with a `.elv` extension under
`~/.elvish/lib`. The `use` special command loads modules. Modules get their own
namespace. Example:

```elvish-transcript
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
`~/.elvish/lib/lorem/ipsum.elv` can be used with `use lorem:ipsum`.


# Pipeline

A **pipeline** is formed by joining one or more commands together with the pipe
sign (`|`).

## IO Semantics

For each pair of adjacent commands `a | b`, the output of `a` is connected to
the input of `b`. Both the byte pipe and the value channel are connected, even
if one of them is not used.

Command redirections are applied before the connection happens. For instance,
the following writes `foo` to `a.txt` instead of the output:

```elvish-transcript
~> echo foo > a.txt | cat
~> cat a.txt
foo
```

## Execution Flow

All of the commands in a pipeline are executed in parallel, and the execution
of the pipeline finishes when all of its commands finish execution.

If one or more command in a pipeline throws an exception, the other commands
will continue to execute as normal. After all commands finish execution, an
exception is thrown, the value of which depends on the number of commands that
have thrown an exception:

*   If only one command has thrown an exception, that exception is rethrown.

*   If more than one commands have thrown exceptions, a "composite exception",
    containing information all exceptions involved, is thrown.

## Background Pipeline

Adding an ampersand `&` to the end of a pipeline will cause it to be executed
in the background. In this case, the rest of the code chunk will continue to
execute without waiting for the pipeline to finish. Exceptions thrown from the
background pipeline do not affect the code chunk that contains it.

When a background pipeline finishes, a message is printed to the terminal if
the shell is interactive.


# Code Chunk

A **code chunk** is formed by joining zero or more pipelines together,
separating them with either newlines or semicolons.

Pipelines in a code chunk are executed in sequence. If any pipeline throws an
exception, the execution of the whole code chunk stops, propagating that
exception.


# Exception and Flow Commands


# Namespace
