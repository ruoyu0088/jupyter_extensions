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
    toc_flag = None
    start_section = None
    
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
        console.log('revealjs loaded')
    
    def is_new_section(cell):
        return get_level(cell) <= 2

    def is_new_subsection(cell):
        if cell.cell_type == 'code':
            if cell.get_text().startswith("#%slide"):
                return True
        return get_level(cell) <= 6

    def end_slide():
        nb = Jupyter.notebook
        cell_index = int(jQuery('section.present:last').attr('cellid'))
        nb.keyboard_manager.enable()
        unload_css('reveal.js/css/reveal.css')
        unload_css('reveal.js/css/theme/%s.css' % get_option('theme'))
        unload_css('slide.css')

        jQuery('.reveal').remove()
        if header_flag:
            jQuery('#header').show()
        if toc_flag:
            jQuery('#scpy3-toc').show()
        jQuery('#site').show()
        nb.select(cell_index)
        nb.scroll_to_cell(cell_index)
 
    def start_slide():
        nonlocal header_flag, toc_flag, start_section
        nb = Jupyter.notebook
        nb.keyboard_manager.disable()

        load_css('./reveal.js/css/reveal.css')
        load_css('./reveal.js/css/theme/%s.css' % get_option('theme'))
        load_css('./slide.css')

        header_flag = jQuery('#header')['is'](':visible')
        toc_flag = jQuery('#scpy3-toc')['is'](':visible')
        jQuery('#header').hide()
        jQuery('#site').hide()
        jQuery('#scpy3-toc').hide()
        
        cells = nb.get_cells()
        el_reveal = T('div.reveal').appendTo(jQuery('body'))
        el_reveal.addClass('reveal-theme-%s' % get_option('theme'))
        el_slides = T('div.slides').appendTo(el_reveal)
    
        el_section = None
        el_subsection = None
        cnt_section = -1
        cnt_subsection = -1
        selected_index = nb.get_selected_index()
        start_section = 0, 0
        
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
            
        for idx, cell in enumerate(cells):
            if is_new_section(cell):
                el_section = T('section').appendTo(el_slides)
                cnt_section += 1
                cnt_subsection = -1
            if is_new_subsection(cell):
                el_subsection = T('section').appendTo(el_section)
                cnt_subsection += 1
            if selected_index == idx:
                start_section = cnt_section, cnt_subsection
                console.log(start_section)
            if el_subsection is not None:
                if cell.cell_type == 'markdown':
                    process_markdown(cell)
                elif cell.cell_type == 'code':
                    process_code(cell)

                if el_subsection.attr('cellid') == undefined:
                    el_subsection.attr('cellid', idx)

        Reveal.initialize({
            'controls': True,
            'progress': True,
            'history': True,
            'center': True,
            'transition': get_option('transition'),
            'transitionSpeed': get_option('speed'),
            'keyboard': {
                81: end_slide
            }
        })

        def on_ready(event):
            Reveal.layout()
            Reveal.slide(start_section[0], start_section[1], 0)
                
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
