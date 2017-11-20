# watch-scp
Watch file changes in a directory, and use scp to synchronize to remote.

# Start up

## Install the package

`npm install -g watch-scp`

## Configuration

Enter your working directory, run `watch-scp init`. This will generate a configuration file `config.toml` in current directory. Modify the generated configuration file to satisfy your requirements.

## Start
Run `watch-scp`.

## Specify a configuration file

You can specify a specific configuration file instead of the default `./config.toml`. Use the `-c` or `--config` option. e.g.: `watch-scp -c ~/foo.toml`.

Of course you can initialize the working directory with a specified configuration filename. e.g.: `watch-scp init -c foo.toml`.
