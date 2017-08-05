<!-- toc -->

# Introduction

The builtin module contains facilities that are potentially useful to all
users. It occupies the `builtin:` namespace. You rarely have to explicitly
specify the namespace though, since it is one of the namespaces consulted when
resolving unqualified names.

## Usage Notation

The usage of a builtin command is described by giving an example usage, using
variables as arguments. For instance, The `repeat` command takes two arguments
and are described as:

```elvish
repeat $n $v
```

Optional arguments are represented with a trailing `?`, while variadic
arguments with a trailing `...`. For instance, the `count` command takes an optional list:

```elvish
count $input-list?
```

While the `put` command takes an arbitrary number of arguments:

```elvish
put $values...
```

Options are given along with their default values. For instance, the `echo`
command takes an `sep` option and arbitrary arguments:

```elvish
echo &sep=' ' $value...
```

(When you calling functions, options are always optional.)


## Supplying Input

Some builtin functions, e.g. `count` and `each`, can take their input in one
of two ways:

1. From pipe:

    ```elvish-transcript
    ~> put lorem ipsum | count # count number of inputs
    2
    ~> put 10 100 | each { + 1 $0 } # apply function to each input
    ▶ 11
    ▶ 101
    ```

    Byte pipes are also possible; one line becomes one input:

    ```elvish-transcript
    ~> echo "a\nb\nc" | count # count number of lines
    ▶ 3
    ```

1. From an argument -- an iterable value:

    ```elvish-transcript
    ~> count [lorem ipsum] # count number of elements in argument
    2
    ~> each { + 1 $0 } [10 100] # apply to each element in argument
    ▶ 11
    ▶ 101
    ```

    Strings, and in future, other sequence types are also possible:

    ```elvish-transcript
    ~> count lorem
    ▶ 5
    ```

When documenting such commands, the optional argument is always written as
`$input-list?`. On the other hand, a trailing `$input-list?` always indicates
that a command can take its input in one of two ways above: this fact is not
repeated below.

**Note**: You should prefer the first form, unless using it requires explicit
`put` commands. Avoid `count [(some-command)]` or `each some-func
[(some-command)]`; they are, most of the time, equivalent to `some-command |
count` or `some-command | each some-func`.

**Rationale**: An alternative way to design this is to make (say) `count` take
an arbitrary number of arguments, and count its arguments; when there is 0
argument, count inputs. However, this leads to problems in code like `count
*`; the intention is clearly to count the number of files in the current
directory, but when the current directory is empty, `count` will wait for
inputs. Hence it is required to put the input in a list: `count [*]`
unambiguously supplies input in the argument, even if there is no file.

## Numerical Commands

Commands that operate on numbers are quite flexible about the format of the
numbers. Integers can be specified as decimals (e.g. `233`) or hexadecimals
(e.g. `0xE9`) and floating-point numbers can be specified using the scientific
notation (e.g. `2.33e2`). These are different strings, but equal when
considered as commands.

Elvish has no special syntax or data type for numbers. Instead, they are just
strings. For this reason, builtin commands for strings and numbers are
completely separate. For instance, the numerical equality command is `==`,
while the string equality command is `==s`. Another example is the `+`
builtin, which only operates on numbers and does not function as a string
concatenation commands.


## Predicates

Predicates are functions that write exactly one output that is either `$true`
or `$false`. They are described like "Determine ..." or "Test ...". See
[`is`](#is) for one example.


# Builtin Functions

## + - * /

```elvish
+ $summand...
- $minuend $subtrahend...
* $factor...
/ $dividend $divisor...
```

Basic arithmetic operations of adding, substraction, multiplication and
division respectively.

All of them can take multiple arguments:

```elvish-transcript
~> + 2 5 7 # 2 + 5 + 7
▶ 14
~> - 2 5 7 # 2 - 5 - 7
▶ -10
~> * 2 5 7 # 2 * 5 * 7
▶ 70
~> / 2 5 7 # 2 / 5 / 7
▶ 0.05714285714285715
```

When given one element, they all output their sole argument (given that it
is a valid number). When given no argument,

*   `+` outputs 0, and `*` outputs 1. You can think that they both have
    "hidden" arguments of 0 and 1, which does not alter their behaviors (in
    mathematical terms, 0 and 1 are [identity
    elements](https://en.wikipedia.org/wiki/Identity_element) of addition and
    multiplication, respectively).

*   `-` throws an exception.

*   `/` becomes a synonym for `cd /`, due to the implicit cd feature. (The
    implicit cd feature will probably change to avoid this oddity).

## %

```elvish
% $dividend $divisor
```

Output the remainder after dividing `$dividend` by `$divisor`. Both must be
integers. Example:

```elvish-transcript
~> % 23 7
▶ 2
```

## ^

```elvish
^ $base $exponent
```

Output the result of raising `$base` to the power of `$exponent`. Examples:

```elvish-transcript
~> ^ 2 10
▶ 1024
~> ^ 2 0.5
▶ 1.4142135623730951
```

## &lt; &lt;= == != &gt; &gt;=

```elvish
<  $number... # less
<= $number... # less or equal
== $number... # equal
!= $number... # not equal
>  $number... # greater
>= $number... # greater or equal
```

Number comparisons. All of them accept an arbitrary number of arguments:

1.  When given less than two arguments, all output `$true`.

2.  When given two arguments, output whether the two arguments satisfy the
    named relationship.

3.  When given more than two arguments, output whether any adjacent pair of
    numbers satisfy the named relationship.

Examples:

```elvish-transcript
~> == 3 3.0
▶ $true
~> < 3 4
▶ $true
~> < 3 4 10
▶ $true
~> < 6 9 1
▶ $false
```

As a consequence of rule 3, the `!=` command outputs `$true` as long as any
*adjacent* pair of numbers are not equal, even if some numbers that are not
adjacent are equal:

```elvish-transcript
~> != 5 5 4
▶ $false
~> != 5 6 5
▶ $true
```


## &lt;s &lt;=s ==s !=s &gt;s &gt;=s

```elvish
<  $string... # less
<= $string... # less or equal
== $string... # equal
!= $string... # not equal
>  $string... # greater
>= $string... # greater or equal
```

String comparisons. They behave similarly to their number counterparts when
given multiple arguments. Examples:

```elvish-transcript
~> >s lorem ipsum
▶ $true
~> ==s 1 1.0
▶ $false
~> >s 8 12
▶ $true
```


## assoc

```elvish
assoc $container $k $v
```

Output a slighly modified version of `$container`, such that its value at `$k`
is `$v`. Currently only applies to lists, but will apply to maps as well.

When `$container` is a list, `$k` may be a negative index. However, slice is
not yet supported.


```elvish-transcript
~> assoc [foo bar quux] 0 lorem
▶ [lorem bar quux]
~> assoc [foo bar quux] -1 ipsum
▶ [foo bar ipsum]
```

Etymology: [Clojure](https://clojuredocs.org/clojure.core/assoc).


## bool

```elvish
bool $value
```

Convert a value to boolean. In Elvish, only `$false` and errors are booleanly
false. 0, empty strings and empty lists are all booleanly true:

```elvish-transcript
~> bool $true
▶ $true
~> bool $false
▶ $false
~> bool $ok
▶ $true
~> bool ?(fail haha)
▶ $false
~> bool ''
▶ $true
~> bool []
▶ $true
~> bool abc
▶ $true
```

$cf not

## cd

```elvish
cd $dirname
```

Change directory.

Note that Elvish's `cd` does not support `cd -`.

## constantly

```elvish
constantly $value...
```

Output a function that takes no arguments and outputs `$value`s when called.
Examples:

```elvish-transcript
~> f=(constantly lorem ipsum)
~> $f
▶ lorem
▶ ipsum
```

The above example is actually equivalent to simply `f = []{ put lorem ipsum }`;
it is most useful when the argument is **not** a literal value, e.g.

```elvish-transcript
~> f = (constantly (uname))
~> $f
▶ Darwin
~> $f
▶ Darwin
```

The above code only calls `uname` once, while if you do `f = []{ put (uname) }`,
every time you invoke `$f`, `uname` will be called.

Etymology: [Clojure](https://clojuredocs.org/clojure.core/constantly).


## count

```elvish
count $input-list?
```

Count the number of inputs.

Examples:

```elvish-transcript
~> count lorem # count bytes in a string
▶ 5
~> count [lorem ipsum]
▶ 2
~> range 100 | count
▶ 100
~> seq 100 | count
▶ 100
```


## each

```elvish
each $f $input-list?
```

Call `$f` on all inputs. Examples:

```elvish-transcript
~> range 5 8 | each [x]{ ^ $x 2 }
▶ 25
▶ 36
▶ 49
~> each [x]{ put $x[:3] } [lorem ipsum]
▶ lor
▶ ips
```

$cf peach

Etymology: Various languages, as `for each`. Happens to have the same name as
the iteration construct of
[Factor](http://docs.factorcode.org/content/word-each,sequences.html).


## eawk

```elvish
eawk $f $input-list?
```

For each input, call `$f` with the input followed by all its fields.

It should behave the same as the following functions:

```elvish
fn eawk [f @rest]{
  each [line]{
    @fields = (re:split '[ \t]+'
                        (re:replace '^[ \t]+|[ \t]+$' '' $line))
    $f $line $@fields
  } $@rest
}
```

This command allows you to write code very similar to `awk` scripts using
anonymous functions. In the function, the input is available as `$0` and
fields are available as `$1`, `$2`, ...

Example:

```elvish-transcript
~> echo " lorem  ipsum \n1 2" | eawk { put $1 }
▶ lorem
▶ 1
```


## echo

```elvish
echo &sep=' ' $value...
```

Print all arguments, joined by the `sep` option, and followed by a newline.

Examples:

```elvish-transcript
~> echo Hello   elvish
Hello elvish
~> echo "Hello   elvish"
Hello   elvish
~> echo &sep=, lorem ipsum
lorem,ipsum
```

Notes: The `echo` builtin does not treat `-e` or `-n` specially. For instance,
`echo -n` just prints `-n`. Use double-quoted strings to print special
characters, and `print` to suppress the trailing newline.

$cf print

Etymology: Bourne sh.


## eq

```elvish
eq $values...
```

Determine whether all `$value`s are structurally equivalent. Writes `$true`
when given no or one argument.

```elvish-transcript
~> eq a a
▶ $true
~> eq [a] [a]
▶ $true
~> eq [&k=v] [&k=v]
▶ $true
~> eq a [b]
▶ $false
```

$cf is

Etymology: [Perl](https://perldoc.perl.org/perlop.html#Equality-Operators).


## exec

```elvish
exec $command?
```

Replace the Elvish process with an external `$command`, defaulting to
`elvish`.


## exit

```elvish
exit $status?
```

Exit the Elvish process with `$status` (defaulting to 0).

## explode

```elvish
explode $iterable
```

Put all elements of `$iterable` on the structured stdout. Like `flatten` in
functional languages. Equivalent to `[li]{ put $@li }`.

Example:

```elvish-transcript
~> explode [a b [x]]
▶ a
▶ b
▶ [x]
```

Etymology: [PHP](http://php.net/manual/en/function.explode.php). PHP's
`explode` is actually equivalent to Elvish's `splits`, but the author liked
the name too much to not use it.


## fail

```elvish
fail $message
```

Throw an exception.

```elvish-transcript
~> fail bad
Exception: bad
Traceback:
  [interactive], line 1:
    fail bad
~> put ?(fail bad)
▶ ?(fail bad)
```

**Note**: Exceptions are now only allowed to carry string messages. You cannot
do `fail [&cause=xxx]` (this will, ironically, throw a different exception
complaining that you cannot throw a map). This is subject to change. Builtins
will likely also throw structured exceptions in future.


## from-json

```elvish
from-json
```

Takes bytes stdin, parses it as JSON and puts the result on structured stdout.
The input can contain multiple JSONs, which can, but do not have to, be
separated with whitespaces.

Examples:

```elvish-transcript
~> echo '"a"' | from-json
▶ a
~> echo '["lorem", "ipsum"]' | from-json
▶ [lorem ipsum]
~> echo '{"lorem": "ipsum"}' | from-json
▶ [&lorem=ipsum]
~> # multiple JSONs running together
   echo '"a""b"["x"]' | from-json
▶ a
▶ b
▶ [x]
~> # multiple JSONs separated by newlines
   echo '"a"
   {"k": "v"}' | from-json
▶ a
▶ [&k=v]
```

$cf to-json


## has-external

```elvish
has-external $command
```

Test whether `$command` names a valid external command. Examples (your output
might differ):

```elvish-transcript
~> has-external cat
▶ $true
~> has-external lalala
▶ $false
```

$cf search-external


## has-prefix

```elvish
has-prefix $string $prefix
```

Determine whether `$prefix` is a prefix of `$string`. Examples:

```elvish-transcript
~> has-prefix lorem,ipsum lor
▶ $true
~> has-prefix lorem,ipsum foo
▶ $false
```

## has-suffix

```elvish
has-suffix $string $suffix
```

Determine whether `$suffix` is a suffix of `$string`. Examples:

```elvish-transcript
~> has-suffix a.html .txt
▶ $false
~> has-suffix a.html .html
▶ $true
```


## is

```elvish
is $values...
```

Determine whether all `$value`s have the same identity. Writes `$true` when
given no or one argument.

The definition of identity is subject to change. Do not rely on its behavior.

```elvish-transcript
~> is a a
▶ $true
~> is a b
▶ $false
~> is [] []
▶ $true
~> is [a] [a]
▶ $false
```

$cf eq

Etymology: [Python](https://docs.python.org/3/reference/expressions.html#is).


## joins

```elvish
joins $sep $input-list?
```

Join inputs with `$sep`. Examples:

```elvish-transcript
~> put lorem ipsum | joins ,
▶ lorem,ipsum
~> joins , [lorem ipsum]
▶ lorem,ipsum
```

The suffix "s" means "string" and also serves to avoid colliding with the
well-known [join](https://en.wikipedia.org/wiki/join_(Unix)) utility.

Etymology: Various languages as `join`, in particular
[Python](https://docs.python.org/3.6/library/stdtypes.html#str.join).

$cf splits


## keys

```elvish
keys $map
```

Put all keys of `$map` on the structured stdout.

Example:

```elvish-transcript
~> keys [&a=foo &b=bar &c=baz]
▶ a
▶ c
▶ b
```

Note that there is no guaranteed order for the keys of a map.


## kind-of

```elvish
kind-of $value...
```

Output the kinds of `$value`s. Example:

```elvish-transcript
~> kind-of lorem [] [&]
▶ string
▶ list
▶ map
```

The terminology and definition of "kind" is subject to change.

## nop

```elvish
nop &any-opt= $value...
```

Accepts arbitrary arguments and options and does exactly nothing.

Examples:

```elvish-transcript
~> nop
~> nop a b c
~> nop &k=v
```

Etymology: Various languages, in particular NOP in [assembly
languages](https://en.wikipedia.org/wiki/NOP).


## not

```elvish
not $value
```

Boolean negation. Examples:

```elvish-transcript
~> not $true
▶ $false
~> not $false
▶ $true
~> not $ok
▶ $false
~> not ?(fail error)
▶ $true
```

**NOTE**: `and` and `or` are implemented as special commands.

$cf bool


## ord

```elvish
ord $string
```

Output value of each codepoint in `$string`, in hexadecimal. Examples:

```elvish-transcript
~> ord aA
▶ 0x61
▶ 0x41
~> ord 你好
▶ 0x4f60
▶ 0x597d
```

The output format is subject to change.

Etymology: [Python](https://docs.python.org/3/library/functions.html#ord).

## path-*

```elvish
path-abs $path
path-base $path
path-clean $path
path-dir $path
path-ext $path
```

See [godoc of path/filepath](https://godoc.org/path/filepath). Go errors are
turned into exceptions.

## peach

```elvish
peach $f $input-list?
```

Call `$f` on all inputs, possibly in parallel.

Example (your output will differ):

```elvish-transcript
~> range 1 7 | peach { + $0 10 }
▶ 12
▶ 11
▶ 13
▶ 16
▶ 15
▶ 14
```

$cf each


## put

```elvish
put $value...
```

Takes arbitrary arguments and write them to the structured stdout.

Examples:

```elvish-transcript
~> put a
▶ a
~> put lorem ipsum [a b] { ls }
▶ lorem
▶ ipsum
▶ [a b]
▶ <closure 0xc4202607e0>
```

Etymology: Various languages, in particular
[C](https://manpages.debian.org/stretch/manpages-dev/puts.3.en.html) and [Ruby](https://ruby-doc.org/core-2.2.2/IO.html#method-i-puts) as `puts`.


## pprint

```elvish
pprint $value...
```

Pretty-print representations of Elvish values. Examples:

```elvish-transcript
~> pprint [foo bar]
[
 foo
 bar
]
~> pprint [&k1=v1 &k2=v2]
[
 &k2=
  v2
 &k1=
  v1
]
```

The output format is subject to change.

$cf repr

## print

```elvish
print &sep=' ' $value...
```

Like `echo`, just without the newline.

$cf echo

Etymology: Various languages, in particular
[Perl](https://perldoc.perl.org/functions/print.html) and
[zsh](http://zsh.sourceforge.net/Doc/Release/Shell-Builtin-Commands.html),
whose `print`s do not print a trailing newline.


## range

```elvish
range &step=1 $low? $high
```

Output `$low`, `$low` + `$step`, ..., proceeding as long as smaller than
`$high`. If not given, `$low` defaults to 0.

Examples:

```elvish-transcript
~> range 4
▶ 0
▶ 1
▶ 2
▶ 3
~> range 1 6 &step=2
▶ 1
▶ 3
▶ 5
```

Beware floating point oddities:

```elvish-transcript
~> range 0 0.8 &step=.1
▶ 0
▶ 0.1
▶ 0.2
▶ 0.30000000000000004
▶ 0.4
▶ 0.5
▶ 0.6
▶ 0.7
▶ 0.7999999999999999
```

Etymology:
[Python](https://docs.python.org/3/library/functions.html#func-range).


## rand

```elvish
rand
```

Output a pseudo-random number in the interval [0, 1). Example:

```elvish-transcript
~> rand
▶ 0.17843564133528436
```

## randint

```elvish
randint $low $high
```

Output a pseudo-random integer in the interval [$low, $high). Example:

```elvish-transcript
~> # Emulate dice
   randint 1 7
▶ 6
```


## repeat

```elvish
repeat $n $value
```

Output `$value` for `$n` times. Example:

```elvish-transcript
~> repeat 0 lorem
~> repeat 4 NAN
▶ NAN
▶ NAN
▶ NAN
▶ NAN
```

Etymology: [Clojure](https://clojuredocs.org/clojure.core/repeat).

## replaces

```elvish
replaces &max=-1 $s $old $new
```

Replace all occurrences of `$old` in `$s` with `$new`. If `$max` is
non-negative, it determines the max number of replaces.

## repr

```elvish
repr $value...
```

Writes representation of `$value`s, separated by space and followed by a
newline. Example:

```elvish-transcript
~> repr [foo 'lorem ipsum'] "aha\n"
[foo 'lorem ipsum'] "aha\n"
```

$cf pprint

Etymology: [Python](https://docs.python.org/3/library/functions.html#repr).


## resolve

```elvish
resolve $command
```

Resolve `$command`. Command resolution is described in the [language
reference](/ref/language.html). (TODO: actually describe it there.)

Example:

```elvish-transcript
~> resolve echo
▶ <builtin echo>
~> fn f { }
~> resolve f
▶ <closure 0xc4201c24d0>
~> resolve cat
▶ <external cat>
```

## search-external

```elvish
search-external $command
```

Output the full path of the external `$command`. Throws an exception when not
found. Example (your output might vary):

```elvish-transcript
~> search-external cat
▶ /bin/cat
```

$cf has-external

## slurp

```elvish
slurp
```

Reads bytes input into a single string, and put this string on structured
stdout.

Example:

```elvish-transcript
~> echo "a\nb" | slurp
▶ "a\nb\n"
```

Etymology: Perl, as
[`File::Slurp`](http://search.cpan.org/~uri/File-Slurp-9999.19/lib/File/Slurp.pm).


## splits

```elvish
splits &sep='' $string
```

Split `$string` by `$sep`. If `$sep` is an empty string (default value), split
it into codepoints.

```elvish-transcript
~> splits &sep=, lorem,ipsum
▶ lorem
▶ ipsum
~> splits 你好
▶ 你
▶ 好
```

Etymology: Various languages as `split`, in particular
[Python](https://docs.python.org/3.6/library/stdtypes.html#str.split).

$cf joins


## to-json

```elvish
to-json
```

Takes structured stdin, convert it to JSON and puts the result on bytes
stdout.

```elvish-transcript
~> put a | to-json
"a"
~> put [lorem ipsum] | to-json
["lorem","ipsum"]
~> put [&lorem=ipsum] | to-json
{"lorem":"ipsum"}
```

$cf from-json

## wcswidth

```elvish
wcswidth $string
```

Output the width of `$string` when displayed on the terminal. Examples:

```elvish-transcript
~> wcswidth a
▶ 1
~> wcswidth lorem
▶ 5
~> wcswidth 你好，世界
▶ 10
```


# Builtin Variables

## $_

A blackhole variable. It can only be assigned, and values to assigned to it
will be discard. Trying to use its value will cause an exception.

## $false

The boolean false value.

## $ok

The special value used by `?()` to signal absence of exceptions.

## $paths

A list of search paths, kept in sync with `$E:PATH`. It is easier to use than
`$E:PATH`.

## $pid

The process ID of the current Elvish process.

## $pwd

The present working directory. Setting this variable has the same effect as
`cd`. This variable is most useful in temporary assignment.

Example:

```elvish
## Updates all git repositories
for x [*/] {
    pwd=$x {
        if ?(test -d .git) {
            git pull
        }
    }
}
```

Etymology: the `pwd` command.

## $true

The boolean true value.
