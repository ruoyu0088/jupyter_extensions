imports = ['base/js/namespace',
           'base/js/dialog',
           'services/config',
           'base/js/utils',
           'components/marked/lib/marked',
           'require']

revealjs = ['./reveal.js/lib/js/head.min.js',
           './reveal.js/js/reveal.js']

Themes = [
    "default",
    "beige",
    "blood",
    "night",
    "serif",
    "simple",
    "sky",
    "solarized"
]

Transitions = ['none', 'fade', 'slide', 'convex', 'concave', 'zoom']

Speeds = ['default', 'slow', 'fast']

def load(Jupyter, dialog, configmod, utils, marked, require):
    from .utils import register_actions, T, get_level, load_css, unload_css, show_dialog, make_selector, get_metadata, set_metadata
    
    require([require.toUrl(url) for url in revealjs], revealjs_loaded)
    header_flag = None
    
    def get_option(name):
        options = get_metadata(Jupyter.notebook, 'slide')
        if options is None:
            options = {}
        if 'theme' not in options:
            options['theme'] = 'default'
        if 'transition' not in options:
            options['transition'] = 'slide'
        if 'speed' not in options:
            options['speed'] = 'default'
        return options[name]
    
    def config_dialog():
        dlg_body = T('div')
        el_theme = make_selector('Theme', Themes).appendTo(jQuery('<p>Theme:</p>').appendTo(dlg_body))
        el_transition = make_selector('Transition', Transitions).appendTo(jQuery('<p>Transition:</p>').appendTo(dlg_body))
        el_speed = make_selector('Speed', Speeds).appendTo(jQuery('<p>Speed:</p>').appendTo(dlg_body))
        el_theme.val(get_option('theme'))
        el_transition.val(get_option('transition'))
        el_speed.val(get_option('speed'))
        
        def on_ok():
            nb = Jupyter.notebook
            metadata = get_metadata(nb, 'slide')
            if metadata is None:
                metadata = {}
            metadata['theme'] = el_theme.val()
            metadata['transition'] = el_transition.val()
            metadata['speed'] = el_speed.val()
            set_metadata(nb, 'slide', metadata)

        show_dialog('Reveal.js configuration', dlg_body, None, [["Ok", on_ok]])        
    
    def revealjs_loaded():
        console.log('revealjs loaded3')
    
    def is_new_section(cell):
        return get_level(cell) <= 2

    def is_new_subsection(cell):
        if cell.cell_type == 'code':
            if cell.get_text().startswith("#%slide"):
                return True
        return get_level(cell) <= 6

    def end_slide():
        nb = Jupyter.notebook
        nb.keyboard_manager.enable()
        unload_css('./reveal.js/css/reveal.css')
        unload_css('./reveal.js/css/theme/%s.css' % get_option('theme'))
        unload_css('./slide.css')

        jQuery('.reveal').remove()
        if header_flag:
            jQuery('#header').show()
        jQuery('#site').show()
 
    def start_slide():
        nonlocal header_flag
        nb = Jupyter.notebook
        nb.keyboard_manager.disable()

        load_css('./reveal.js/css/reveal.css')
        load_css('./reveal.js/css/theme/%s.css' % get_option('theme'))
        load_css('./slide.css')

        header_flag = jQuery('#header')['is'](':visible')
        jQuery('#header').hide()
        jQuery('#site').hide()
        
        cells = nb.get_cells()
        el_reveal = T('div.reveal').appendTo(jQuery('body'))
        el_slides = T('div.slides').appendTo(el_reveal)
        
        el_section = None
        el_subsection = None

        def process_code(cell):
            def _append_code_output():
                el = cell.element.find('.output_area').clone()
                el.children().attr('class', '').appendTo(el_subsection)
                
            def _append_code_html(err, code_html):
                jQuery(code_html).appendTo(el_subsection)
                _append_code_output()

            code = cell.get_text().strip()
            if not code.startswith('#%hide'):
                mdcode = '```python\n%s\n```' % code
                marked(mdcode, _append_code_html)
            else:
                _append_code_output()

        def process_markdown(cell):
            el = cell.element.find('.rendered_html').clone()
            el.children().appendTo(el_subsection)
            
        for cell in cells:
            if is_new_section(cell):
                el_section = T('section').appendTo(el_slides)

            if is_new_subsection(cell):
                el_subsection = T('section').appendTo(el_section)

            if el_subsection is not None:
                if cell.cell_type == 'markdown':
                    process_markdown(cell)
                elif cell.cell_type == 'code':
                    process_code(cell)

        Reveal.initialize({
            'controls': True,
            'progress': True,
            'history': True,
            'center': True,
            'transition': get_option('transition'),
            'keyboard': {
                81: end_slide
            }
        })

        def on_ready(event):
            Reveal.layout()
            Reveal.slide(0, 0, 0)

        Reveal.addEventListener( 'ready', on_ready)
    
    def main():
           
        actions = dict(
            start_slide = {
                'help': 'save current cell as slice',
                'icon': 'fa-bar-chart-o',
                'key': 'p',
                handler: start_slide
            },

            configure_slide_options = {
                'help': 'configure slide options',
                'key': 'Alt-p',
                handler: config_dialog
            }
        )

        register_actions(actions)

    return {"load_ipython_extension": main}

define(imports, load)
