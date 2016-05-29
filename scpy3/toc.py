imports = ['base/js/namespace',
           'base/js/events',
           'require',
           './jquery.side.menu']

def load(Jupyter, events, require, _):
    from .utils import load_css, is_head_cell

    load_css('./side-menu.css')
    toc = jQuery('<div id="scpy3-toc"></div>')
    toc.css({
        'position': 'absolute',
        'width': '200px',
        'top': '0px',
        'right': '0px',
        'height': '600px',
        'background-color': 'rgba(128,128,128,0.1)'
    })
    toc.appendTo(jQuery('body'))
    toc.hide()
    nb = Jupyter.notebook

    def remove_last_ch(index, el):
        el = jQuery(el)
        text = el.html()
        if text and text.endswith('¶'):
            el.html(text[:-1])
        title = el.attr('title')
        if title and title.endswith('¶'):
            el.attr('title', title[:-1])
            
    def update_toc():
        if toc['is'](':visible'):
            top = jQuery("#header").height() if jQuery('#header')['is'](':visible') else 0
            toc.css('top', '%dpx' % top)
            jQuery('#scpy3-toc').empty()
            Jupyter.notebook.element.sideMenu({
                container: '#scpy3-toc',
                hs: ['h1', 'h2', 'h3', 'h4', 'h5']
            })
            toc.find('span').each(remove_last_ch)
            
    def update_marker():
        side_menu = nb.element.data('sideMenu')
        if not side_menu:
            return
        start = nb.get_selected_index()
        cell = None
        for i in range(start, -1, -1):
            c = nb.get_cell(i)
            if is_head_cell(c):
                cell = c
                break
        if cell is not None:
            mark_head(cell)
            
    def toggle_toc():
        toc.toggle()
        update_toc()

    def mark_head(cell):
        side_menu = nb.element.data('sideMenu')
        if not side_menu:
            return
        #id_ = jQuery(cell.get_rendered()).attr('id')
        id_ = cell.element.find(".rendered_html").children(0).attr("id")
        side_menu.showPosition(id_)

    def goto_head(step):
        i = nb.get_selected_index()
        while True:
            i += step
            cell = nb.get_cell(i)
            if cell is None:
                break
            if is_head_cell(cell):
                nb.select(i)
                nb.scroll_to_cell(i)
                mark_head(cell)
                break
            
    def prev_head():
        goto_head(-1)
            
    def next_head():
        goto_head(1)

    def main():
        
        actions = dict(
            toggle_toc = {
                'help': '',
                'icon': '',
                'key': 'Alt-t',
                'handler': toggle_toc
            },
            prev_head = {
                'handler': prev_head,
                'key': 'Ctrl-left'
            },
            next_head = {
                'handler': next_head,
                'key': 'Ctrl-right'
            }
        )
        
        km = Jupyter.keyboard_manager
        for name, action in actions.items():
            km.actions.register(action, name, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + name)

    #events.on('kernel_ready.Kernel', toggle_toc)
    events.on('create.Cell', update_toc)
    events.on('delete.Cell', update_toc)
    events.on('select.Cell', update_marker)
    events.on('command_mode.Notebook', update_toc)
    return {"load_ipython_extension": main}

define(imports, load)
