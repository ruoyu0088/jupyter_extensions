imports  = ['base/js/namespace',
        'services/config',
        'base/js/utils']

def load(Jupyter, configmod, utils):
    from .utils import get_level, show_message, typeahead_form
    
    base_url = utils.get_body_data("baseUrl")
    config = configmod.ConfigSection('scpy3_copycells', {'base_url': base_url})
    config.load()

    copy_config = configmod.ConfigWithDefaults(config, {'cells':[]})
    
    def main():
        def select_section_cells(event):
            nb = Jupyter.notebook
            cell = nb.get_selected_cell()
            current_level = get_level(cell)
            if current_level < 10:
                while True:
                    cell.select()
                    cell = nb.get_next_cell(cell)
                    if cell is None:
                        break
                    if get_level(cell) <= current_level:
                        break
                    
        def copy_cells(event):
            nb = Jupyter.notebook

            cells = nb.get_selected_cells()
            json = [cell.toJSON() for cell in cells]
            copy_config.set('cells', json)
            show_message("%d cells copied" % len(json), 2000)

        def paste_cells(event):
            nb = Jupyter.notebook

            def insert_cells(cells_json):
                current_cell = nb.get_selected_cell()
                
                for cell_json in cells_json:
                    cell = nb.insert_cell_below(cell_json.cell_type)
                    cell.fromJSON(cell_json)
                    cell.focus_cell()

                for i in range(len(cells_json)):
                    current_cell = nb.get_next_cell(current_cell)
                    current_cell.select()
                    
            copy_config.get('cells').then(insert_cells)

        def append_cells(event):
            nb = Jupyter.notebook
            
            def append_cells(cells_json):
                cells = nb.get_selected_cells()
                json = [cell.toJSON() for cell in cells]
                cells_json.extend(json)
                copy_config.set('cells', cells_json)
                show_message("%d cells appended, total %d cells" % (len(json), len(cells_json)), 2000)
                
            copy_config.get('cells').then(append_cells)

        def paste_selected_cell(event):
            mod, input_ = typeahead_form()
            input_.attr('id', 'scpy3-paste-typeahead')

            def on_submit(node, query, result, result_count):
                console.log(node, query, result, result_count)
                mod.modal('hide')
                cell = Jupyter.notebook.insert_cell_below(result.cell.cell_type)
                cell.fromJSON(result.cell)
                cell.focus_cell()

            def show_clipboard(cells):
                src = {'Clipboard':{'data': [], 'display': 'display'}}
                for cell in cells:
                    src.Clipboard.data.append({'display': cell.source[:80], 'cell': cell, 'group':'Clipboard'})
                
                input_.typeahead({
                    'emptyTemplate': 'Clipboard is empty',
                    'maxItem': 100,
                    'group': ['group', '{{group}}'],
                    'minLength': 0,
                    'searchOnFocus': True,
                    'hint': True,
                    'mustSelectItem': True,
                    'template': '<pre style="background-color:transparent;border:none;">{{display}} ...</pre>',
                    'source': src,
                    'callback': {
                        'onSubmit': on_submit,
                        'onClickAfter': on_submit
                    }
                })

                mod.modal('show')

            copy_config.get('cells').then(show_clipboard)
            
        actions = dict(
            select_section_cells = {
                'help': ' selected section cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-s',
                'handler': select_section_cells
            },
            copy_cells = {
                'help': ' copy selected  cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-c',
                'handler': copy_cells
            },
            paste_cells = {
                'help': ' paste cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-v',
                'handler': paste_cells
            },
            paste_selected_cell = {
                'key': 'Alt-Shift-v',
                'handler': paste_selected_cell
            },
            append_cells = {
                'help': ' append cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-a',
                'handler': append_cells
            }
        )
        
        km = Jupyter.keyboard_manager
        for key, action in actions.items():
            km.actions.register(action, key, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + key)
        
    return {"load_ipython_extension": main}

define(imports, load)
