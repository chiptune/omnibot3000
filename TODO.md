# TODO

## In Progress

- loader animation while waiting for API response (`Loader.tsx`)

## Backlog

- add [OpenRouter](https://openrouter.ai/docs/quickstart#using-the-openai-sdk)
  as API client
- use [`commander.js`](https://www.npmjs.com/package/commander) for CLI
- use `inquirer.js` for CLI prompts
- arrow key up/down to cycle between CLI history
- model selection in CLI
- support for multiple models in the same conversation
- keep the latest query on the top while streaming the response
- hide all visual elements in _Game of Life_ mode except the toggle button
- randomize _Game of Life_ lifeforms angle by 90° steps
- try to color text with [rasterbars](https://en.wikipedia.org/wiki/Raster_bar)
- add links to [npmjs.com package](https://www.npmjs.com) on the /version page
- display time spent to return API response
- display the component name in debug mode
- move keyboard handler from `Cli.tsx` to a separate `./utils/keyboard.ts` file

## Done

- resize properly content margin
- allow clipboard text pasting to CLI
- support arrow key to move cursor
- ctrl+u to remove text before cursor
- ctrl+k to remove text after cursor
- catch API errors and display a dummy message
- lock vertical scrolling to line height
- add a
  [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
  in the background
- make the Game of Life background interactive with mouse clicks
- allow query retry
- handle conversation tree with multiple branches
- make API available online on [Render](https://render.com)
