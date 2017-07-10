Welcome to the first issue of Elvish Newsletter!

Elvish is a shell that seeks to combine a full-fledged programming langauge
with a friendly user interface. This newsletter is a summary of its progress
and future plans.


# Status Updates

*   17 pull requests have been merged in the past three weeks. Among them 13
    were made by @xofyargs, and the rest by @myfreeweb, @jiujieti, @HeavyHorst
    and @silvasur -- many kudos!

*   The [website](https://elvish.io) was made "[officially
    live](/blog/live.html)" on 3 July. Although the initial
    [submission](https://news.ycombinator.com/item?id=14691639) to HN was a
    failure, Elvish gained
    [quite](https://www.reddit.com/r/programming/comments/6l38nd/elvish_friendly_and_expressive_shell/)
    [some](https://www.reddit.com/r/golang/comments/6l3aev/elvish_friendly_and_expressive_shell_written_in_go/)
    [popularity](https://www.reddit.com/r/linux/comments/6l6wcs/elvish_friendly_and_expressive_shell_now_ready/)
    on Reddit, and [another](https://news.ycombinator.com/item?id=14698187) HN
    submission made to the homepage. All of these have brought 40k unique
    visitors to the website, totalling 340k HTTP requests. Thank you Internet
    :)

*   A lot of discussions have happened over the IM channels and the issue
    tracker, and it has become necessary to better document the current status
    of Elvish and organize the development effort, and this newsletter is
    part of the response.

    There is no fixed schedule yet, but the current plan is to publish
    newsletters roughly every month. Preview releases, which used to happen
    quite arbitrarily, will also be made to coincide with the publication of
    newsletters.

*   There are now IM channels for developers, see the next section for
    details.


# 0.10 Milestone and Current Focus

The next preview release will be 0.10. The past releases were done in a pretty
arbitrary way, but for 0.10, there is now a
[milestone](https://github.com/elves/elvish/milestone/2), a list of issues
considered vital for the release.
If you would like to contribute, you are more than welcome to pick an issue
from that list, although you are also more than welcome to pick any issue.

Here are the current focus areas of Elvish development:

*   Stabilizing the language core.

    The core of Elvish is still pretty immature, and it is definitely not as
    usable as any other dynamic language, say Python or Clojure. Among others,
    the 0.10 milestone now plans changes to the implementation of maps
    ([#414](https://github.com/elves/elvish/issues/414)), a new semantics of
    element assignment ([#422](https://github.com/elves/elvish/issues/422))
    and enhanced syntax for function definition
    ([#82](https://github.com/elves/elvish/issues/82) and
    [#397](https://github.com/elves/elvish/issues/397)). You probably wouldn't
    expect such fundamental changes in a mature language :)

    A stable language core is a prerequisite for a 1.0 release. Elvish 1.x
    will maintain backwards compatibility with code written for earlier 1.x
    versions.

*   Enhance usability of the user interface, and provide basic
    programmability.

    The goal is to build a fully programmable user interface, and there are a
    lot to be done. Among others, the 0.10 milestone plans to support
    manipulating the cursor
    ([#415](https://github.com/elves/elvish/issues/415)) programmatically,
    scrolling of previews in navigation mode previews
    ([#381](https://github.com/elves/elvish/issues/381)), and invoking
    external editors for editing code
    ([#393](https://github.com/elves/elvish/issues/393)).

    The user interface is important for two reasons: it is what users use, and
    it is a good place for testing the language.

If you are interested in the development of Elvish, you are more than welcome
to read, discuss and work on any of the issues. But you can also just propose
what you think is good for Elvish as new issues :)

To better coordinate development, there are now IM channels for Elvish
development:
[#elvish-dev](http://webchat.freenode.net/?channels=elvish-dev) on freenode,
[elves/elvish-dev](https://gitter.im/elves/elvish-dev) on Gitter and
[@elvish_dev](https://telegram.me/elvish_dev) on Telegram. These channels are
all connected together thanks to [fishroom](https://github.com/tuna/fishroom).
For general questions, you are welcome in
[#elvish](https://webchat.freenode.net/?channels=elvish) on Freenode,
[elves/elvish-public](https://gitter.im/elves/elvish-public) on Gitter, or
[@elvish](https://telegram.me/elvish) on Telegram.

Happy Speaking Elvish!

\- xiaq
