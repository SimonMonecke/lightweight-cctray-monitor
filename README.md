# Lightweight-CCTray-Monitor

A small JavaScript tool to visualize cctray.xml files provided by any continuous integration tool.

## Usage
* clone this repository
* edit the file config.json.example
* rename this file to config.json
* open the file lightweight-cctray-monitor.html in your browser

### Configuration

* successText: Text which is visible if no step is running or failed (optional, default: ":D")
* autoHiddenRegex: Steps matching this regex are hidden (optional, no default)
* splitLineSeq: Replace sequence StepName with new line character (optional, no default)
* defaultHiddenSteps: Vector with steps which are hidden (optional, no default)
* pipelines : Vector with pipeline-maps (required)
  * cctrayUrl: URL of the cctray-xml document of the pipeline (required)
  * hiddenSteps: Vector with steps which are hidden in the pipeline (optional, no default)
  * guiUrl: URL to the UI of the pipeline in your CI tool (optional, no default)

Example:
```json
{
    "successText" : ":D",
    "autoHiddenRegex" : "^_",
    "splitLineSeq": " :: ",
    "defaultHiddenSteps" : ["either"],
    "pipelines" : {
        "Test-Pipeline" : {
            "cctrayUrl": "http://localhost:8080/cctray/pipeline.xml",
            "hiddenSteps": ["either"],
            "guiUrl": "http://localhost:8080/pipeline"
        }
    }
}
```

## TODO
- [x] scale font automatically
- [x] replace javascript config with json file
- [x] compute the number of steps in a col automatically
- [x] add a option to ignore steps with a specified prefix
- [x] change colors
- [ ] fix font scaling for small window sizes
- [ ] fix debug mode

## License

Copyright © 2015 Simon Monecke

Distributed under MIT License
