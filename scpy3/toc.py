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
        'width': '250px',
        'top': '0px',
        'right': '0px',
        'bottom': '0px',
        'background-color': 'rgba(128,128,128,0.1)'
    })
    toc.appendTo(jQuery('body'))
    toc.hide()
    nb = Jupyter.notebook

    def remove_last_ch(index, el):
        el = jQuery(el)
        text = el.html()
        if text and text.endswith('\u00b6'):
            el.html(text[:-1])
        title = el.attr('title')
        if title and title.endswith('\u00b6'):
            el.attr('title', title[:-1])
            
    def update_toc():
        if toc['is'](':visible'):
            update_toc_top()
            jQuery('#scpy3-toc').empty()
            Jupyter.notebook.element.sideMenu({
                container: '#scpy3-toc',
                hs: ['h1', 'h2', 'h3', 'h4', 'h5']
            })
            toc.find('span').each(remove_last_ch)

    def update_toc_top():
        toc.css('top', '%dpx' % jQuery("#header").height())
        toc.find('.side-menu').height(toc.height() - 20)
        
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
        update_toc_top()
        handle_resize()

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

    def handle_resize():
        if toc['is'](':visible'):            
            el_cell = Jupyter.notebook.get_cell(0).element
            el_right_edge = el_cell.width() + el_cell.offset().left
            win_width = jQuery(window).width()
            diff = 260 - (win_width - el_right_edge)
            nc = jQuery("#notebook-container")
            new_padding = parseInt(nc.css("padding-right")) + diff
            padding_left = parseInt(nc.css("padding-left"))
            new_padding = max(new_padding, padding_left)
            nc.css("padding-right", new_padding)
        else:
            nc = jQuery("#notebook-container")
            nc.css("padding-right", nc.css("padding-left"))
               
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
    events.on('resize-header.Page', update_toc_top)
    events.on('command_mode.Notebook', update_toc)
    jQuery(window).resize(handle_resize)
    events.on('theme-changed.scpy3', update_toc_top)
    return {"load_ipython_extension": main}

define(imports, load)
