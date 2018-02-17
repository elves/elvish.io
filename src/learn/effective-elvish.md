Elvish is not an entirely new language. Its programming techniques have two
primary sources: traditional Unix shells and functional programming languages,
both dating back to many decades ago. However, the way Elvish combines those
two paradigms is unique in many ways, which enables new ways to write code.

This document is an advanced tutorial focusing on how to write idiomatic
Elvish code, code that is concise and clear, and takes full advantage of
Elvish's features.

An appropriate adjective for idiomatic Elvish code, like *Pythonic* for Python
or *Rubyesque* for Ruby, is **Elven**. In [Roguelike
games](https://en.wikipedia.org/wiki/Roguelike), Elven items are known to be
high-quality, artful and resilient. So is Elven code.


# Data Pipeline

Elvish is equipped with a powerful tool for passing data: the pipeline. Like
in traditional shells, it is an intuitive notation for data processing: data
flows from left to right, undergoing one transformation after another. Unlike
in traditional shells, it is not restricted to unstructured bytes: all Elvish
values, including lists, maps and even closures, can flow in the pipeline.
This section documents how to make the most use of pipelines.

## Use Structured Outputs to "Return" Values

Unlike functions in most other programming languages, Elvish commands do not
have return values. Instead, they can write to *structured output*, which is
similar to byte-based stdout, but preserves all internal structures of complex
Elvish values. The most fundamental builtin command that does this is `put`:

```elvish-transcript
~> put foo
▶ foo
~> x = (put foo)
~> put $x
▶ foo
```

This is hardly impressive - you can output and recover simple strings using
the good old byte-based output as well. But let's try this:

```elvish-transcript
~> put "a\nb" [foo bar]
▶ "a\nb"
▶ [foo bar]
~> s li = (put "a\nb" [foo bar])
~> put $s
▶ "a\nb"
~> put $li[0]
▶ foo
```

Here, two things are worth mentioning: the first value we `put` contains a
newline, and the second value is a list. When we capture the output, we get
those exact values back. Passing structured data is difficult with byte-based
output, but trivial with value output.

Besides `put`, many other builtin commands also write to structured output,
like `splits`:

```elvish-transcript
~> splits , foo,bar
▶ foo
▶ bar
~> words = [(splits , foo,bar)]
~> put $words
▶ [foo bar]
```

User-defined functions behave in the same way: they "return" values by writing
to structured stdout. Without realizing that return value and outputs are the
same in Elvish, it is easy to think of `put` as a command to return values and
write code like this:

```elvish-transcript
~> fn split-by-comma [s]{ put (splits , $s) }
~> split-by-comma foo,bar
▶ foo
▶ bar
```

The `split-by-comma` function works, but it can be written more concisely
simply as:

```elvish-transcript
~> fn split-by-comma [s]{ splits , $s }
~> split-by-comma foo,bar
▶ foo
▶ bar
```

In fact, the pattern `put (some-cmd)` is almost always redundant and
equivalent to just `some-command`.

Similarly, it is seldom necessary to write `echo (some-cmd)`: it is almost
always equivalent to just `some-cmd`. As an exercise, try simplifying the
following function:

```elvish
fn git-describe { echo (git describe --tags --always) }
```
## Mixing Bytes and Values

Each pipe in Elvish comprises two components: one traditional byte pipe that
carries unstructured bytes, and one value pipe that carries Elvish values. You
can write to both at the same time, and output capture will capture both:

```elvish-transcript
~> fn f { echo bytes; put value }
~> f
bytes
▶ value
~> outs = [(f)]
~> put $outs
▶ [bytes value]
```

This also illustrates that the output capture operator `(...)` works with both
byte and value outputs, and it can recover the output sent to `echo`. When
byte output contains multiple lines, each line becomes one value:

```elvish-transcript
~> x = [(echo "lorem\nipsum")]
~> put $x
▶ [lorem ipsum]
```

Most Elvish builtin functions also work with with both byte and value inputs.
Similarly to output capture, they split their byte intput by newlines. For
example:

```elvish-transcript
~> use str
~> put lorem ipsum | each $str:to-upper~
▶ LOREM
▶ IPSUM
~> echo "lorem\nipsum" | each $str:to-upper~
▶ LOREM
▶ IPSUM
```

This line-oriented treatment of byte input is consistent with traditional Unix
tools like `grep`, `sed` and `awk`. However, this behavior is not always
desirable: not all Unix commands output newline-separated data. When you want
to get the output as is, as one big string, you can use the `slurp` command:

```elvish-transcript
~> echo "a\nb\nc" | slurp
▶ "a\nb\nc\n"
```

One immediate use of `slurp` is to read a whole file into a string:

```elvish-transcript
~> cat hello.go
package main

import "fmt"

func main() {
            fmt.Println("vim-go")
}
~> hello-go = (slurp < hello.go)
~> put $hello-go
▶ "package main\n\nimport \"fmt\"\n\nfunc main()
{\n\tfmt.Println(\"vim-go\")\n}\n"
```

It is also useful, for example, when working with NUL-separated output:

```elvish-transcript
~/tmp/go> touch "a\nb.go"
~/tmp/go> mkdir d
~/tmp/go> touch d/f.go
~/tmp/go> find . -name '*.go' -print0 | splits "\000" (slurp)
▶ "./a\nb.go"
▶ ./d/f.go
▶ ''
```

In the above command, `slurp` turns the input into one string, which is then
captured and used as an argument to `splits`. In Elvish, strings can contain
NUL bytes (in fact, they can contain any byte). Note that the `find` command
terminates its output with a NUL byte, hence we see a trailing empty string in
the output.

One side note: In the first example, we saw that `bytes` appeared before `value`.
This is not guaranteed: byte output and value output are separate, it is
possible to get `value` before `bytes` in more complex cases. Writes to one
component, however, always have their orders preserved, so in `put x; put y`,
`x` will always appear before `y`.

## Pipes Over Parentheses

If you have experience with Lisp, you will discover that you can write Elvish
code very similar to Lisp. For instance, to split a string containing
comma-separated value, reduplicate each value (using commas as separators),
and rejoin them with semicolons, you can write:

```elvish-transcript
~> csv = a,b,foo,bar
~> joins ';' [(each [x]{ put $x,$x } [(splits , $csv)])]
▶ 'a,a;b,b;foo,foo;bar,bar'
```

This code works, but it is a bit unreadable. In particular, since `splits`
outputs multiple values but `each` wants a list argument, you have to wrap the
output of `splits` in a list with `[(splits ...)]`. Then you have to do this
again in order to pass the output of `each` to `joins`. You might wonder why
commands like `splits` and `each` do not simply output a list to make this
easier.

The answer to that particular question is answered in the next subsection, but
for the program at hand, there is a much better way to write it:

```elvish-transcript
~> csv = a,b,foo,bar
~> splits , $csv | each [x]{ put $x,$x } | joins ';'
▶ 'a,a;b,b;foo,foo;bar,bar'
```

Besides having fewer pairs of parentheses (and brackets), this program is also
more readable, because the data flows from left to right, and there is no
nesting. You can see that `$csv` is first split by commas, then each value
gets reduplicated, and then finally everything is joined by semicolons. It
matches exactly how you would describe the algorithm in spoken English -- or
for that matter, any spoken language!

Both versions work, because commands like `each` and `joins` that work with
multiple inputs can take their inputs in two ways: they can take the inputs as
one list argument, like in the first version; or from the pipeline, like the
second version. Whenever possible, you should prefer the input-from-pipeline
form: it makes for programs that have little nesting, read naturally.

One exception to the recommendation is when the input is a small set of things
known beforehand. For example:

```elvish-transcript
~> each $str:to-upper~ [lorem ipsum]
▶ LOREM
▶ IPSUM
```

Here, using the input-from-argument is completely fine: if you want to use the
input-from-input form, you have to supply the input using `put`, which is also
OK but a bit more wordy:

```elvish-transcript
~> put lorem ipsum | each $str:to-upper~
▶ LOREM
▶ IPSUM
```

However, not all commands supports taking input from the pipeline. For
example, if we want to first join some values with space and then split at
commas, this won't work:

```elvish-transcript
~> joins ' ' [a,b c,d] | splits ,
Exception: want 2 arguments, got 1
[tty], line 1: joins ' ' [a,b c,d] | splits ,
```

This is because the `splits` command only ever works with one input (one
string to split), and was not implemented to support taking input from
pipeline; hence it always takes 2 arguments and we got an exception.

It is easy to remedy this situation however. The `all` command passes its
input to its output, and by capturing its output, we can turn the input into
an argument:

```elvish-transcript
~> joins ' ' [a,b c,d] | splits , (all)
▶ a
▶ 'b c'
▶ d
```

## Multiple Output Values Over One List

In the previous subsection, we remarked that commands like `splits` and `each`
write multiple output values instead of one list. Why?

(To be written)
