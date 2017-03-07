<!-- toc number-sections -->

# Literals

## String

*   Everything inside **single quotes** represent themselves. For instance,
    ``'*\'`` evaluates to ``*\``. To write a single quote, double it:
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
    they must be quoted. For instance, to echo a start, write `echo "*"` or
    `echo '*'`; ``echo \*`` is not allowed. Currently ``\`` stands for itself,
    so ``echo \*`` echoes ``\*``; this is subject to change.


## List

Lists are surround by square brackets `[` `]`, with elements separated by
whitespaces -- spaces, tabs and newlines. Examples are `[a b c]` and `[(put
lorem ipsum) *]`. In the following example elements are separated by newlines:

```elvish
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
Whitespaces are allowed after `=`, but not before `=`. Examples are `[&foo=bar
&lorem=ipsum]` and `[&a= 23 &b= 10 &sum= (+ 23 10)]`. An empty map is written
`[&]`.


## Lambda

Lambdas are written with curly braces: `{ code ... }`. The space after `{` is
significant: without it, Elvish will parse a braced list.

Example (assignments will be introduced in detail later):

```elvish
~> f = { echo Hi }
~> put $f
▶ <closure 0xc420450540>
~> $f
Hi
```

Lambdas can take arguments. In the lambda body, arguments are available as the
`$args` list:

```elvish
~> f = { put $args }
~> $f
▶ []
~> $f foo bar
▶ [foo bar]
```

Variables whose names are integers are shorthands for elements of `$args`; for
instance, `$1` is the shorthand for `$args[1]`, the second argument:

```elvish
~> f = { put $1 }
~> $f foo bar
▶ bar
```

Lambdas can have an argument list. An argument list looks like a list sticked
before the lambda: `[a b]{ put $a $b }`. Note there should be no space between
`]` and `{`; otherwise Elvish parses two values, a list and a lambda. When
calling lambdas defined this way, number of arguments must match:

```elvish
~> [a b]{ put $a $b } 1
Exception: arity mismatch
Traceback:
  [interactive], line 1:
    [a b]{ put $a $b } 1
```

TBD: rest arguments:

```elvish
~> [a @rest]{ put $a $rest } 1 2 3 4
▶ 1
▶ [2 3 4]
```


# Builtin types

TBD: more explanation

Strings, lists, maps, closures, errors -- result of `?()`, bools -- `$true` and
`$false`. Note that int is missing.


# Variable and Assignment

TBD: Variable reference

```elvish
~> put $pid
▶ 85155
~> li = [foo bar]
~> put $li
▶ [foo bar]
~> put $@li
▶ foo
▶ bar
```


Assignments look like `x = 1`. Note:

*   Spaces are required before **and** after `=`. In other words, elvish only
    recognizes assignments when `=` comes as a lone "word".

*   Both sides around `=` can have multiple items, as in `x y = 1 2`.

## Rest Variable

If you don't know how many values the right-hand side has, you can capture them in a **rest variable**:

```
~> a b c @d = (range 10)
~> put $a $b $c $d
▶ 0
▶ 1
▶ 2
▶ [3 4 5 6 7 8 9]
```

The rest variable must come last.

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


# Indexing

TBD: indexing list

```elvish
~> li = [lorem ipsum foo bar]
~> put $li[0]
▶ lorem
~> put $li[-1]
▶ bar
~> put $li[0:2]
▶ [lorem ipsum]
```

TBD: indexing string

```elvish
~> s = Elvish
~> put $s[0]
▶ E
~> s = 世界
~> put $s[0]
▶ 世
~> put $s[3]
▶ 界
```

TBD: indexing map

```elvish
~> map = [&lorem=ipsum]
~> put $map[lorem]
▶ ipsum
```


# Compounding and Braced List

TBD: explain compounding

```elvish
~> v = value
~> put '$v is '$v
▶ '$v is value'
~> put {a,b}{c,d}
▶ ac
▶ ad
▶ bc
▶ bd
```


# Tilde Expansion

TBD: explain tilde expansion

```elvish
~> put ~
▶ /Users/xiaq
~> put ~root
▶ /var/root
```


# Wildcards

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

By default:

*   None of them matches `.` at the beginning of filenames. For example:

    *   `?x.conf` does not match `.x.conf`;

    *   `d/*.conf` does not match `d/.x.conf`;

    *   `**.conf` does not match `d/.x.conf`.

* When there is no match, an error is thrown.

Both behaviors can be changed by a modifier.

## Modifiers

Wildcards can be **modified** using the same syntax as indexing, e.g. `*[mod1
mod2]`. There are two kinds of modifiers.

**Global modifiers** apply to the whole pattern and can be placed after any
wildcard:

*   `nomatch-ok` tells elvish not to throw an error when there is no match for
    the pattern. For instance, in the example directory `put bad*` will be an
    error, but `put bad*[nomatch-ok]` does exactly nothing.

    Being a global modifer, you can add it to any wildcard and the effect is
    the same; `put */*[nomatch-ok].cpp` and `put *[nomatch-ok]/*.cpp` do the
    same thing.

*   `but:xxx` (where `xxx` is any filename) excludes the filename from the final
    result.

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


# Output Capture

TBD

```elvish
~> + 1 10 100
▶ 111
~> x = (+ 1 10 100)
~> put $x
▶ 111
~> put lorem ipsum
▶ lorem
▶ ipsum
~> x = (put lorem ipsum)
Exception: arity mismatch
Traceback:
  [interactive], line 1:
    x = (put lorem ipsum)
~> x y = (put lorem ipsum)
~> put $x
▶ lorem
~> put $y
▶ ipsum
```


# Error Capture

TBD

```elvish
~> fail bad
Exception: bad
Traceback:
  [interactive], line 1:
    fail bad
~> put ?(fail bad)
▶ ?(fail bad)
~> nop
~> put ?(nop)
▶ $ok
```


# Control Structures

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


# Modules

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
