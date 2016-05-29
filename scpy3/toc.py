imports = ['base/js/namespace',
           'base/js/events',
           'require',
           './jquery.side.menu']

def load(Jupyter, events, require, _):
    from .utils import load_css

    load_css('./side-menu.css')
    toc = jQuery('<div id="scpy3-toc"></div>')
    toc.css({
        'position': 'absolute',
        'width': '200px',
        'top': '120px',
        'right': '0px',
        'height': '600px',
        'background-color': 'rgba(128,128,128,0.1)'
    })
    toc.appendTo(jQuery('body'))
    toc.hide()

    def remove_last_ch(index, el):
        el = jQuery(el)
        text = el.html()
        if text and text.endswith('¶'):
            el.html(text[:-1])
        title = el.attr('title')
        if title and title.endswith('¶'):
            el.attr('title', title[:-1])
            
    def update_toc():
        print('update toc')
        if toc['is'](':visible'):
            jQuery('#scpy3-toc').empty()
            Jupyter.notebook.element.sideMenu({
                container: '#scpy3-toc',
                hs: ['h2', 'h3', 'h4', 'h5']
            })
            toc.find('span').each(remove_last_ch)
            
    def toggle_toc():
        toc.toggle()
        update_toc()

    def main():
        
        actions = dict(
            toggle_toc = {
                'help': '',
                'icon': '',
                'key': 'Alt-t',
                handler: toggle_toc
            }
        )
        
        km = Jupyter.keyboard_manager
        for name, action in actions.items():
            km.actions.register(action, name, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + name)

    #events.on('kernel_ready.Kernel', toggle_toc)
    events.on('create.Cell', update_toc)
    events.on('delete.Cell', update_toc)
    events.on('command_mode.Notebook', update_toc)
    return {"load_ipython_extension": main}

define(imports, load)
