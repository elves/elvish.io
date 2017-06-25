After being in construction for almost a year, the Elvish website is finally
live!

This website will be the entry point of all Elvish information. It will host
documents (including both [tutorials](/learn) and [references](/ref)), as well
as release notes or other announcements.  (The [GitHub
repository](https://github.com/elves/elvish) continues to host code and issues,
of course).

The website has no comment facilities: comment is outsourced to [Hacker
News](https://news.ycombinator.com) and [r/elv](https://www.reddit.com/r/elv/).

The [homepage](/) introduces each one section, and highlights some key features
of Elvish with screenshots. Please start there to explore this website!


# Technical Stack

The website is built with a [static website
generator](https://github.com/xiaq/genblog) from [a bunch of MarkDown and other
files](https://github.com/elves/elvish.io), and hosted on a
[DigitalOcean](https://www.digitalocean.com) server with
[nginx](http://nginx.org).

Thanks to [Cloudflare](https://www.cloudflare.com), this website has a good
chance of withstanding kisses of death from Hacker News, should there be any.
It uses Cloudflare's "strict" SSL configuration, meaning that both traffic from
you to Cloudflare and Cloudflare to my origin server are fully encrypted with
verified certificates. The origin server obtains and renews its certificate
from the wonderful [Let's Encrypt](https://letsencrypt.org/) service.
