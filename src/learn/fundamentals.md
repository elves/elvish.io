This tutorial introduces the fundamentals of shell programming with Elvish.
It does not assume familiarity with other shells, but some understanding of
basic programming concepts is required.

Beware that Elvish is very similar to other shell languages in many aspects,
but very different in some other aspects. When transferring your knowledge of
Elvish to another shell, it is worthwhile to check how things work in the
other shell.

# Hello, world!

Let's begin with the most traditional "hello world" program. In Elvish,
you call the `echo` **command** to print something on the terminal:

```elvish-transcript
~> echo "Hello, world!"
Hello, world!
```

In Elvish, as in other shells, command calls follow a simple structure: you
write the command name, followed by arguments, all separated by spaces (or
tabs). No parentheses or commas are needed.

We enclose our text here in double quotes, making it a **string literal**.
Compared to other languages, shell languages are a bit sloppy in that they
allow you to write strings *without* quotes. The following also works:

```elvish-transcript
~> echo Hello, world!
Hello, world!
```

However, the way it works has a subtle difference: here `Hello,` and `world!`
are two arguments (remember that spaces separate arguments), and `echo` joins
them together with a space. This is apparent if you put multiple spaces
between them:

```elvish-transcript
~> echo Hello,      world!
Hello, world!
~> echo "Hello,     world!"
Hello,     world!
```

When you write your message without quotes, no matter how many spaces there
are, it is always the same two arguments `Hello,` and `world!`. If you quote
your message, the spaces are part of the string and thus preserved.

It is a good idea to always quote your string when it contains spaces or any
special symbols other than period (`.`), dash (`-`) or underscore (`_`).


# Hello, {insert user name}!

A program that always prints the same message is not very interesting.

One way to make programs more interesting is to make them do different things
depending on the context. In the case of our "hello world" program, why not
teach it to greet whoever is running the program?

```elvish-transcript
~> echo "Hello, world! Hello, "$E:USER"!"
Hello, world! Hello, xiaq!
```

There are several things happening here. First, `$E:USER` represents the `USER`
**environment variable** ("E" being mnemonic for "environment"). In UNIX
environments, it is usually set to the name of the current user. Second, we
are running several strings and a variable all together: in this case, Elvish
will concatenate them for you. Hence the result we see.

Depending on your taste, you might feel that it's nicer to greet the world and
the user on separate lines. There are several ways to do this; we can use two
`echo` commands:

```elvish-transcript
~> echo "Hello, world"
   echo "Hello, "$E:USER"!"
Hello, world
Hello, xiaq!
```

(When using the terminal interface, press <span class="key">Alt-Enter</span>
to insert a literal newline instead of executing a command.)

Or we can use a special **escape sequence** that represents a newline in our
string:

```elvish-transcript
~> echo "Hello, world!\nHello, "$E:USER"!"
Hello, world!
Hello, xiaq!
```

Within double quotes, `\n` represents a newline. There are many such sequences
starting with a backslash, including `\\` which represents the backslash
itself.

Yet the simplest, albeit slight less unreadable option is to simply insert a
newline in the string:

```elvish-transcript
~> echo "Hello, world!
   Hello, "$E:USER"!"
Hello, world!
Hello, xiaq!
```


<!--
# Hello, everyone!

Now let's say you want to say hello to several people, and typing `Hello` repeatedly is tiresome. You can save some work by using a **for-loop**:

```elvish
for name [Julius Pompey Marcus] {
    echo 'Hello, '$name'!'
}
```

In elvish you can put newlines between the elements to loop over, as long as they are terminated by `; do`.

For easier reuse, you can also create a **list** to store the names:

```elvish
triumvirate = [Julius Pompey Marcus]
```

Lists are surrounded by square brackets, like in several other languages. Elements are separated by whitespaces.

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

