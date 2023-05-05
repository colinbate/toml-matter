# toml-matter

Parses the contents of a file with frontmatter written as TOML between two `+++` delimiters.

The return value should be largely compatible with `gray-matter`.

There is a single exported function called `matter`.

You pass it a string. It gives you back an object with the frontmatter properties on `data`.
