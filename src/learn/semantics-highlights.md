As a result of its [design philosophy](/ref/philosophy.html), the semantics of
Elvish is significantly different from other shells in many aspects. If you are
used to other shells, those differences can be surprising.

# Structureful IO

Elvish offers the ability to build elaborate data structures, "return" them
from functions, and pass them through pipelines.

## Motivation

Traditionally shells have emphasized the use of strings above all other data
structures. Arrays and associated arrays are sometimes provided but often
limited (try building an array of arrays of strings in bash). Similarly, IOs
(pipelines, standard input and output) are also byte-oriented: communication
based on unstructured strings is all you get when piercing commands together.

While this minimalism is great for simple use cases, it falls short if your
data has inherent complexity. A common solution is using pseudo-structures of
"each line representing a record, and each (whitespace-separated) field
represents a property", but this quickly leads to problems with escaping, and
is hard to debug and maintain.

## Data Structures and "Returning" Them

Elvish offers first-class support for data structures such as lists and maps. Here is an example that uses a list:

```elvish
~> li = [foo bar 'lorem ipsum']
~> kind-of $li
▶ list
~> count $li
▶ 3
```

(The [language reference](/ref/lang.html) contains detailed description on the
syntax and usage of data structures. The `kind-of` builtin command gives you
the *kind* of a value, which you can treat as the same as *type* for now. The
`count` command here, well, counts the number of elements in `$li`.)

As you can see, you can store lists in variables and use them as command
arguments. But they would be much less useful if you cannot **return** them
from a function. A naive way to do this is by `echo`ing the list and use output
capture to recover it:
     
```elvish
~> fn f {
     echo [foo bar 'lorem ipsum']
   }
~> li = (f)
~> kind-of $li
▶ string
~> count $li
▶ 23
```

(Output capture in Elvish uses parentheses; they are similar to `$()` in other
shells. You probably already guessed that `fn` defines a function. The `count`
command here counts the number of bytes in `$li` because it is now a string.)

However, the `echo` in Elvish, like in other shells, writes a string to the
output. In this case, it will convert the list to a string. So when you try to
recover the list, you get a string instead. To correctly do this, you use
another builtin command called `put`:

```elvish
~> fn f {
     put [foo bar 'lorem ipsum']
   }
~> li = (f)
~> kind-of $li
▶ list
~> count $li
▶ 3
```

So how does `put` work differently from `echo` under the hood?

The standard output in Elvish is actually made up of two parts: one traditional
**byte-oriented file**, and one internal **value-oriented channel**. The `echo`
command writes to the former, serializing its arguments into a sequence of
bytes; while the `put` command writes to the latter, preserving all the
internal structures of the values.

If you invoke `put` directly from the command prompt, the values it output have
a leading `▶`:

```elvish
~> put [foo bar]
▶ [foo bar]
```

The leading arrow is a way to visualize that a command has written something
onto the value channel, and not part of the value itself.

In retrospect, you may discover that the `kind-of` and `count` builtin commands
also write their output to the value channel.


## Passing Data Structures Through the Pipeline

When I said that standard output in Elvish comprises two parts, I was not
telling the full story: pipelines in Elvish also have these two parts, in a
very similar way. Data structures can flow in the value-oriented part of the
pipeline as well. For instance, the `each` command takes **input** from the
value-oriented channel, and apply a function to each value:

```elvish
~> put lorem ipsum | each { echo "Got "$0 }
Got lorem
Got ipsum
```


# Exit Status and Exceptions

Unix commands exit with a non-zero value to signal errors. This is available
traditionally as a `$?` variable in other shells:

```bash
true
echo $? # prints "0"
false
echo $? # prints "1"
```

Builtin commands and user-defined functions also do this to signal errors,
although they are not Unix commands:

```bash
bad() {
  return 2
}
bad
echo $? # prints "2"
```

This model is fine, only if most errors are non-fatal (so that errors from a
previous command normally do not affect the execution of subsequence ones) and
the script author remembers to check `$?` for the rare fatal errors.

Elvish has no concept of exit status. Instead, it has exceptions that, when
thrown, interrupt the flow of execution. The equivalency of the `bad` function
in elvish is as follows:

```elvish
fn bad {
  fail "bad things have happened" # throw an exception
}
bad # will print a stack trace and stop execution
echo "after bad" # not executed
```

Non-zero exit status from external commands are turned into exceptions:

```elvish
false # will print a stack trace and stop execution
echo "after false"
```

(If you are running a version of Elvish older than 0.9, you might need to use
`e:false`, as the builtin version of `false` was removed recently.)

Defaulting on stopping execution when bad things happen makes Elvish safer and
code behavior more predictable.


# Execution Flow

Elvish interprets code in **chunks**. If you run `elvish some-script.elv` from
the command line, the entire script is one chunk; in interactive mode, each
time you hit Enter, the code you have written is one chunk.

Elvish interprets the code chunk in 3 phases: it first **parse** the code into
a syntax tree, **compile** the syntax tree code to an internal representation,
and finally **evaluate** the just-generated internal representation.

If any error happens during the first two phases, Elvish will reject the code
without executing any of it. For instance, in Elvish unclosed parenthesis is a
syntax error (error in the first parsing phase). The following code, when
executed as a chunk, does nothing:

```elvish
echo before
echo (
```

The same code, interpreted as bash, also contains a syntax error. However, if
you save this file to `bad.bash` and run `bash bad.bash`, bash will execute the
first line before complaining about the syntax error on the second line.

Likewise, in Elvish using an unassigned variable is a compilation error, so the
following code does nothing either:

```elvish
 assuming #nonexistent was not assigned
echo before
echo $nonexistent
```

There seems to be no equivalency of compilation errors in other shells, but
this extra compilation phase makes the language safer. (In future, optional
type checking may be introduced, which will fit into the phase.)
