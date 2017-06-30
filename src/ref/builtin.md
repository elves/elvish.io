<!-- toc number-sections -->

# Introduction

**THIS DOCUMENT IS NOT YET COMPLETE.**

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


## Optional input list

Some builtin functions like `count` and `each` can take input in two ways:

1. From pipe:

    ```elvish-transcript
    ~> put lorem ipsum | count
    2
    ~> put 10 100 | each { + 1 $0 }
    ▶ 11
    ▶ 101
    ```

    Byte pipes are also possible; one line becomes one input:

    ```elvish-transcript
    ~> echo "a\nb\nc" | count
    ▶ 3
    ```

1. From argument:

    ```elvish-transcript
    ~> count [lorem ipsum]
    2
    ~> each { + 1 $0 } [10 100]
    ▶ 11
    ▶ 101
    ```

    Strings, and in future, other sequence types are also possible:

    ```elvish-transcript
    ~> count lorem
    ▶ 5
    ```

You should prefer the first form, unless using it requires explicit `put` commands. Avoid `count [(some-command)]` or `each some-func [(some-command)]`; they are, most of the time, equivalent to `some-command | count` or `some-command | each some-func`.

Such commands can be recognized in their specifications in that they take a trailing optional input list, written as `input-list?`.

**Rationale**. An alternative way to design this is to make (say) `count` take an arbitrary number of arguments, and count its arguments; when there is 0 argument, count inputs. However, this leads to problems in code like `count *`; the intention is clearly to count the number of files in the current directory, but when the current directory is empty, `count` will wait for inputs. Hence it is required to put the input in a list: `count [*]` unambiguously supplies input in the argument, even if there is no file.

# Builtin Functions

## + - * /

```elvish
+ $summand...
- $minuend $subtrahend...
* $factor...
/ $dividend $divisor...
```

Basic arithmetic operators for adding, substraction, multiplication and
division respectively.

Note that `/`, when given no argument, is a synonym for `cd /` due to the
implicit cd feature.

## bool

```elvish
bool $value
```

Convert a value to boolean.

## cd

```elvish
cd $dirname
```

Change directory.

## constantly

```elvish
constantly $value...
```

Output a function that takes no arguments and outputs all given `$value`s when
called. Examples:

```elvish-transcript
~> f=(constantly lorem ipsum)
~> $f
▶ lorem
▶ ipsum
```

Etymology: Clojure.

## count

```elvish
count $input-list?
```

Count the number of inputs.

Examples:

```elvish
~> count lorem
▶ 5
~> count [lorem ipsum]
▶ 2
~> range 100 | count
▶ 100
~> seq 100 | count
▶ 100
```

Etymology: English.

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

Etymology: Various languages, as `for each`.


## echo

```elvish
echo &sep=' ' $value...
```

Print all arguments and a newline. Arguments are separated by the `sep` option.

Examples:

```elvish-transcript
~> echo Hello   elvish
Hello elvish
~> echo "Hello   elvish"
Hello   elvish
~> echo &sep=, lorem ipsum
lorem,ipsum
```

Notes: The `echo` builtin does not treat `-e` or `-n` specially. For instance, `echo -n` just prints `-n`. Use double-quoted strings to print special characters, and `print` to suppress the trailing newline.

Etymology: Bourne sh.


## explode

```elvish
explode $list
```

Put all elements of the `$list` on the structured stdout. Like `flatten` in
functional languages. Equivalent to `[li]{ put $@li }`.

Example:

```elvish-transcript
~> explode [a b [x]]
▶ a
▶ b
▶ [x]
```

Etymology: PHP, although they do different things.


## from-json

```elvish
from-json
```

Takes bytes stdin, parses it as JSON and puts the result on structured stdout.

Examples:

```elvish-transcript
~> echo '"a"' | from-json
▶ a
~> echo '["lorem", "ipsum"]' | from-json
▶ [lorem ipsum]
~> echo '{"lorem": "ipsum"}' | from-json
▶ [&lorem=ipsum]
```


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

Etymology: Various languages, especially assembly languages.


## peach

```elvish
peach $f $input-list?
```

Like `each`, but may run the function in parallel.

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

Etymology: Various languages, in particular C and Ruby as `puts`.


## print

```elvish
print &sep=' ' $value...
```

Like `echo`, just without the newline.

Etymology: Various languages, in particular Perl and zsh.


## repeat

Takes a number `n` and a value `v`. Output value `v` for `n` times. Example:

```elvish-transcript
~> repeat 4 foo
▶ foo
▶ foo
▶ foo
▶ foo
```

Etymology: Clojure.

## repr

```elvish
repr $value...
```

Like `echo`, but writes the representation instead of stringification.

Etymology: Python.


## slurp

Reads bytes input into a single string, and put this string on structured
stdout.

Example:

```elvish-transcript
~> echo "a\nb" | slurp
▶ "a\nb\n"
```

Etymology: Perl, as `File::Slurp`.


## to-json

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


# Builtin Variables

## $false

Contains the boolean false value.

## $paths

A list of search paths, kept in sync with `$E:PATH`. Users should prefer this
variable to `$E:PATH`, because it often leads to more readable code.

## $pid

Contains the process ID of the current elvish process.

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

Contains the boolean true value.
