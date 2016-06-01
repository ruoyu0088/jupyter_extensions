imports = ['base/js/namespace', 'base/js/events', 'require']

def load(Jupyter, events, require):
    from .utils import load_css

    load_css('./bookmark.css')
    
    nb = Jupyter.notebook
    
    def toggle_bookmark():
        cell = nb.get_selected_cell()
        cell.element.toggleClass('cell-bookmark')
        if cell.element.hasClass('cell-bookmark'):
            cell.metadata.scpy3_bookmark = True
        else:
            del cell.metadata.scpy3_bookmark
            
    def search_bookmark(step):
        console.log('next_bookmark')
        cells = nb.get_cells()
        start = nb.get_selected_index()
        if step > 0:            
            indexes = range(start+1, len(cells)) + range(0, start)
        else:
            indexes = range(start-1, -1, -1) + range(len(cells)-1, start, -1)

        for i in indexes:
            cell = cells[i]
            if cell.metadata.scpy3_bookmark:
                nb.select(i)
                nb.scroll_to_cell(i)
                break
        else:
            Jupyter.notification_area('notebook').set_message('No bookmark', 2000)
            
    def next_bookmark():
        search_bookmark(1)

    def prev_bookmark():
        search_bookmark(-1)
    
    def main():
        actions = dict(
            toggle_bookmark = {
                'help': '',
                'icon': '',
                'key': 'Alt-b',
                handler: toggle_bookmark
            },

            next_bookmark = {
                'help': '',
                'icon': '',
                'key': 'Shift-right',
                handler: next_bookmark
            },

            prev_bookmark = {
                'help': '',
                'icon': '',
                'key': 'Shift-left',
                handler: prev_bookmark
            }

        )
        
        km = Jupyter.keyboard_manager
        for name, action in actions.items():
            km.actions.register(action, name, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + name)

        for cell in nb.get_cells():
            if cell.metadata.scpy3_bookmark:
                cell.element.addClass('cell-bookmark')
                    
    return {"load_ipython_extension": main}

define(imports, load)
    

