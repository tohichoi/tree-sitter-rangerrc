# INSTALL

## build

```shell
npm init -y
npm install --save-dev tree-sitter-cli
npx tree-sitter generate
```

## modify languages.toml

```toml
[[grammar]]
name = "rangerrc"
source = { git = "https://github.com/사용자이름/tree-sitter-rangerrc", rev = "main" } 
# source = { path = "/home/x/Workspace/tree-sitter-rangerrc" } # 실제 작업하신 절대 경로 입력

[[language]]
name = "rangerrc"
scope = "source.rangerrc"
# inherits = "bash"
file-types = [
  { glob = "rc.conf" }
]
roots = []
grammar = "rangerrc"
```

## copy highlights.scm to runtime dir

```shell
mkdir -p ~/.config/helix/runtime/queries/rangerrc
cp highlights.scm ~/.config/helix/runtime/queries/rangerrc
```

## build helix grammar

```shell
hx --grammar build
```