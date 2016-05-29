# Jupyter Notebook Extensions

This repository contains a collection of extensions that add functionality to the Jupyter notebook for the book 
"Scientific Computing with Python".

To install the extensions:

```
jupyter nbextension install scpy3 --user
```

and then enable the extensions:

```
jupyter nbextension enable scpy3/style
jupyter nbextension enable scpy3/macro
jupyter nbextension enable scpy3/copycells
jupyter nbextension enable scpy3/slice
jupyter nbextension enable scpy3/iconbox
jupyter nbextension enable scpy3/maximize
jupyter nbextension enable scpy3/toc
```

## Convert code by `convert.py`

All the extensions are written in Python, and converted to Javascript by 
[flexx.pyscript](http://flexx.readthedocs.io/en/stable/pyscript/api.html).

To convert the code, run following command:

```
python convert.py
```
## Extensions

### style

Customize style sheet:

* Hide prompt
* More `padding-right` for TOC 

### macro

This extension provides macros in edit mode. To edit macros, type `$` and then `Alt-m`, a dialog box will be popped up.

Here is the default settings:

```
default_macros = {
    "1":"\u2776",
    "2":"\u2777",
    "3":"\u2778",
    "4":"\u2779",
    "5":"\u277a",
    "6":"\u277b",
    "7":"\u277c",
    "8":"\u277d",
    "9":"\u277e",
    "fig":'![](/files/images/.png "")',
    "next":'`ref:fig-next`',
    "prev":'`ref:fig-prev`',
    "tip":'> **TIP**\n\n> ',
    "source":'> **SOURCE**\n\n> ',
    "warning":'> **WARNING**\n\n> ',
    "question":'> **QUESTION**\n\n> ',
    "link":'> **LINK**\n\n> \n\n> ',        
 }

```

To input macros, type a macro name, and then `Alt-m`. If the macro name is ambiguous, add a `$` before the name.


### copycells

Copy cells between notebooks. 

* Select the cells and then press `Alt-c` to copy it. 
* Press `Alt-v` to paste cells in clipboard. 
* Press `Alt-a` to append selected cells to the clipboard.

### slice

Quick insert code slice in to current cell:

* To register a slice: Type some code into a cell, and then press `Alt-i`, input `slice group : slice name` and press the Ok button.

* To insert a slice in to the current cell: Press `Alt-l`. If the current cell is not code type, a new cell will be inserted.

### iconbox

Render markdown cell as a box with icon. The cell must contain only a blockquote element, which is created by `>` in markdown. Here is a list of the five types:

* a tip box

```
> **TIP**

> This is a tip
```

* a link box

```
> **LINK**

> http://google.com

> This is google
```

* a warning box

```
> **WARNING**

> This is a warning
```

* a source box

```
> **SOURCE**

> This is a source code
```
* a question box

```
> **QUESTION**

> This is a question
```

### maximize

Enlarge notebook edit area by hiding title, menubar and toolbar. In maximized mode the notification area will be moved to lower-left of the screen.

* `Ctrl-↑`: Maximize notebook
* `Ctrl-↓`: Return to normal mode 

### toc

This extension collects all running headers in the notebook and display them on the right side of the notebook.

* `Alt-t`: Toggle table of content
* `Crtrl-←`: Jump to previous head
* `Crtrl-→`: Jump to next head
