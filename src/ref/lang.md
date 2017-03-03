<!-- toc number-sections -->

# Literals

## String

*   Everything inside **single quotes** represent themselves. For instance, `'*\'` evaluates to `*\`. To write a single quote, double it: `'it''s'` evaluates to `it's`.

* Within **double quotes**, there are **C-like** escape sequences starting with `\`. For instance, `"\n"` evaluates to a newline; `"\\"` evaluates to a backslash; `"\*"` is a syntax error because stars do not need escaping in double quotes.

  There is no interpolation in double quotes. For instance, `"$USER"` evaluates to the string `$USER`.

## List

## Map

## Lambda


# Indexing and compounding


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


# Assignment

Assignments look like `x = 1`. Note:

*   Spaces are required before **and** after `=`. In other words, elvish only
    recognizes assignments when `=` comes as a lone "word".

*   Both sides around `=` can have multiple items, as in `x y = 1 2`.

## Rest variable

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

## Temporary assignment

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


# Control structures

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
