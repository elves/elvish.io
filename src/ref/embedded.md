Some modules implemented in Elvish are embedded within Elvish itself; they all
live under the `embedded:` namespace.

Right now there is exactly one embedded module.

# embedded:readline-binding

Contains readline-like keybindings. To use, put the following in `~/.elvish/rc.elv`:

```elvish
use embedded:readline-binding
```
