<!-- toc number-sections -->

In function usages, a trailing `?` represents an optional argument.

Some builtin functions like `count` and `each` can take input in two ways:

1. From pipe:

    ```elvish
    ~> put lorem ipsum | count
    2
    ~> put 10 100 | each { + 1 $0 }
    ▶ 11
    ▶ 101
    ```

    Byte pipes are also possible; one line becomes one input:

    ```elvish
    ~> echo "a\nb\nc" | count
    ▶ 3
    ```

1. From argument:

    ```elvish
    ~> count [lorem ipsum]
    2
    ~> each { + 1 $0 } [10 100]
    ▶ 11
    ▶ 101
    ```

    Strings, and in future, other sequence types are also possible:

    ```elvish
    ~> count lorem
    ▶ 5
    ```

You should prefer the first form, unless using it requires explicit `put` commands. Avoid `count [(some-command)]` or `each some-func [(some-command)]`; they are, most of the time, equivalent to `some-command | count` or `some-command | each some-func`.

Such commands can be recognized in their specifications in that they take a trailing optional input list, written as `input-list?`.

**Rationale**. An alternative way to design this is to make (say) `count` take an arbitrary number of arguments, and count its arguments; when there is 0 argument, count inputs. However, this leads to problems in code like `count *`; the intention is clearly to count the number of files in the current directory, but when the current directory is empty, `count` will wait for inputs. Hence it is required to put the input in a list: `count [*]` unambiguously supplies input in the argument, even if there is no file.

# + - * /

Basic arithmetic operators for adding, substraction, multiplication and
division respectively.

Note that `/`, when given no argument, is a synonym for `cd /` due to the
implicit cd feature.

# constantly

```
constantly a b c ...
```

Takes any number of arguments `a b c ...`, and outputs a function. The function takes no arguments and outputs `a b c ...` when called. Examples:

```
~> f=(constantly a b c)
~> $f
▶ a
▶ b
▶ c
```

Etymology: Clojure.

# count

```
count input-list?
```

Count the number of inputs.

Examples:

```
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

# each

```
each f input-list?
```

Calls `f` on all inputs. Examples:

```elvish
~> range 5 8 | each [x]{ ^ $x 2 }
▶ 25
▶ 36
▶ 49
~> each [x]{ put $x[:3] } [lorem ipsum]
▶ lor
▶ ips
```

Etymology: Various languages, as `for each`.


# echo

```
echo x y z ...
```

Print all arguments and a newline. Arguments are separated by a space when printed.

Examples:

```elvish
~> echo Hello   elvish
Hello elvish
~> echo "Hello   elvish"
Hello   elvish
```

Notes: The `echo` builtin does not treat `-e` or `-n` specially. For instance, `echo -n` just prints `-n`. Use double-quoted strings to print special characters, and `print` to not have a newline.

Etymology: Bourne sh.


# explode

Takes one list and puts all its values on the structured stdout. Like
`flatten` in functional languages. Equivalent to `[li]{ put $@li }`.

Example:

```elvish
~> explode [a b [x]]
▶ a
▶ b
▶ [x]
```

Etymology: PHP, although they do different things.


# from-json

Takes bytes stdin, parses it as JSON and puts the result on structured stdout.

Examples:

```elvish
~> echo '"a"' | from-json
▶ a
~> echo '["lorem", "ipsum"]' | from-json
▶ [lorem ipsum]
~> echo '{"lorem": "ipsum"}' | from-json
▶ [&lorem=ipsum]
```


# nop

Accepts arbitrary arguments and options and does exactly nothing.

Examples:

```elvish
~> nop
~> nop a b c
~> nop &k=v
```

Etymology: Various languages, especially assembly languages.


# peach

Like `each`, but may run the function in parallel.

Example (your output will differ):

```elvish
~> range 1 7 | peach { + $0 10 }
▶ 12
▶ 11
▶ 13
▶ 16
▶ 15
▶ 14
```


# put

Takes arbitrary arguments and write them to the structured stdout.

Examples:

```
~> put a
▶ a
~> put lorem ipsum [a b] { ls }
▶ lorem
▶ ipsum
▶ [a b]
▶ <closure 0xc4202607e0>
```

Etymology: Various languages, in particular C and Ruby as `puts`.


# print

Like `echo`, just without the newline.

Etymology: Various languages, in particular Perl and zsh.


# repeat

Takes a number `n` and a value `v`. Output value `v` for `n` times. Example:

```elvish
~> repeat 4 foo
▶ foo
▶ foo
▶ foo
▶ foo
```

Etymology: Clojure.

# repr

Like `echo`, but writes the representation instead of stringification.

Etymology: Python.


# slurp

Reads bytes input into a single string, and put this string on structured
stdout.

Example:

```elvish
~> echo "a\nb" | slurp
▶ "a\nb\n"
```

Etymology: Perl, as `File::Slurp`.


# to-json

Takes structured stdin, convert it to JSON and puts the result on bytes
stdout.

```elvish
~> put a | to-json
"a"
~> put [lorem ipsum] | to-json
["lorem","ipsum"]
~> put [&lorem=ipsum] | to-json
{"lorem":"ipsum"}
```


# $false

Contains the boolean false value.

# $paths

A list of search paths, kept in sync with `$E:PATH`. Users should prefer this
variable to `$E:PATH`, because it often leads to more readable code.

# $pid

Contains the process ID of the current elvish process.

# $pwd

The present working directory. Setting this variable has the same effect as
`cd`. This variable is most useful in temporary assignment.

Example:

```elvish
# Updates all git repositories
for x [*/] {
    pwd=$x {
        if ?(test -d .git) {
            git pull
        }
    }
}
```

Etymology: the `pwd` command.

# $true

Contains the boolean true value.
