imports = ['base/js/namespace', 'require', 'base/js/events']

themes = ['default', 'oceans16', 'grade3', 'space-legos', 'doc-white', 'doc-black']

def load(Jupyter, require, events):
    from .utils import load_css, unload_css, get_metadata, set_metadata
    load_css('./style.css')

    def main():
        def on_theme_changed():
            theme = select.val()
            unload_css(themes[1:])
            if theme != 'default':
                load_css('./themes/%s.css' % theme)
            set_metadata(Jupyter.notebook, 'theme', theme)
            events.trigger('theme-changed.scpy3')
        select = jQuery('<select/>').attr('id', 'scpy3-theme-selector')
        select.addClass('form-control select-xs')
        select.append(jQuery('<optgroup label = "Themes:">'))
        for theme in themes:
            select.append(jQuery('<option/>').attr('value', theme).text(theme))
        select.change(on_theme_changed)
        Jupyter.toolbar.element.append(select)

        def set_theme():
            theme = get_metadata(Jupyter.notebook, 'theme')
            console.log(theme)
            if theme is not None:
                select.val(theme)
                on_theme_changed()

        events.on("notebook_loaded.Notebook", set_theme)
        set_theme()
    
    return {"load_ipython_extension": main}

define(imports, load)
