# game-of-life-multithreading
I know there are more efficient algorithms for game of life, I just wanted to tinker with Workers in js.
<img src="https://raw.githubusercontent.com/prenaissance/game-of-life-multithreading/master/.github/showcase.png" alt="showcase" height="50%" width="50%" align="center"/>

Multiprocessing works and loads up all your cpu cores, but it's slower than single threading because of the limitations with sharing memory between threads with web workers and my experimental implementation of it.

# Changelog

## [1.1.0]

### Added
- Option to toggle multiprocessing
- Fps counter
## [1.0.0]

### Added
- Bare minimum single threaded Game of Life
- Start & Pause buttons
- Multiprocessing functionality (not used yet)