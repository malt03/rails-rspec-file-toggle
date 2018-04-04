# rails-rspec-file-toggle

This is an extension for Visual Studio Code.
In rails project with rspec, toggle between spec and tested file.

## Features

```json
[
    {
        "command": "extension.railsRspecFileToggle",
        "title": "Rails Rspec File Toggle",
        "key": "cmd+alt+r"
    }
]
```

![screenshot](https://github.com/malt03/rails-rspec-file-toggle/blob/master/README/rails-rspec-file-toggle.gif?raw=true)

## Extension Settings

```json
"railsRspecFileToggle.convertDefinition": {
    "default": [
        {
            "app_directory": "controllers",
            "spec_directory": "requests",
            "app_suffix": "_controller",
            "spec_suffix": ""
        }
    ],
    "description": "convert app directory path `app/${app_directory}/**/*${app_suffix}.rb` to spec path `spec/${spec_directory}/**/*${spec_suffix}_spec.rb`.",
    "type": "array"
},
"railsRspecFileToggle.rspecDirectory": {
    "default": "spec",
    "description": "rspec directory name.",
    "type": "string"
}
```
