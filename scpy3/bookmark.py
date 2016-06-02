imports = ['base/js/namespace', 'base/js/events', 'require']

N = 3

def load(Jupyter, events, require):
    from .utils import load_css, show_message

    load_css('./bookmark.css')
    
    nb = Jupyter.notebook
    
    def toggle_bookmark(mark_id):
        cell = nb.get_selected_cell()
        for i in range(1, N+1):
            if i == mark_id:
                continue
            cell.element.removeClass('cell-bookmark-%d' % i)
            
        cell.element.toggleClass('cell-bookmark-%d' % mark_id)
        if cell.element.hasClass('cell-bookmark-%d' % mark_id):
            cell.metadata.scpy3_bookmark = mark_id
        else:
            del cell.metadata.scpy3_bookmark

    def run_bookmark(mark_id):
        cells = nb.get_cells()
        count = 0
        for cell in cells:
            if cell.cell_type == 'code' and cell.metadata.scpy3_bookmark == mark_id:
                cell.execute()
                count += 1
        show_message('%d cells executed' % count, 2000)
        
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
            show_message('No bookmark', 2000)
            
    def next_bookmark():
        search_bookmark(1)

    def prev_bookmark():
        search_bookmark(-1)
    
    def main():
        actions = dict(
            toggle_bookmark_1 = {
                'help': '',
                'icon': '',
                'key': 'Shift-1',
                handler: lambda :toggle_bookmark(1)
            },
            
            toggle_bookmark_2 = {
                'help': '',
                'icon': '',
                'key': 'Shift-2',
                handler: lambda :toggle_bookmark(2)
            },
            
            toggle_bookmark_3 = {
                'help': '',
                'icon': '',
                'key': 'Shift-3',
                handler: lambda :toggle_bookmark(3)
            },

            run_bookmark_1 = {
                'help': '',
                'icon': '',
                'key': 'Ctrl-Shift-1',
                handler: lambda :run_bookmark(1)
            },
            
            run_bookmark_2 = {
                'help': '',
                'icon': '',
                'key': 'Ctrl-Shift-2',
                handler: lambda :run_bookmark(2)
            },
            
            run_bookmark_3 = {
                'help': '',
                'icon': '',
                'key': 'Ctrl-Shift-3',
                handler: lambda :run_bookmark(3)
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
                cell.element.addClass('cell-bookmark-%d' % int(cell.metadata.scpy3_bookmark))
                    
    return {"load_ipython_extension": main}

define(imports, load)
    

