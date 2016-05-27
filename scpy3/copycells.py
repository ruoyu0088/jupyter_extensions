def get_level(cell):
    if cell.cell_type != "markdown":
        return 1000
    
    text = cell.get_text()
    if text.startswith("#"):
        level = len(text) - len(text.lstrip("#"))
        return level
    return 1000
    
def load(Jupyter, configmod, utils):
    base_url = utils.get_body_data("baseUrl")
    config = configmod.ConfigSection('scpy3_copycells', {'base_url': base_url})
    config.load()

    copy_config = configmod.ConfigWithDefaults(config, {'cells':[]})
    
    def main():
        def show_mssage(message):
            notification_widget = Jupyter.notification_area.widget("notebook")            
            notification_widget.set_message(message, 2000)
            
        def select_handler(event):
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
                    
        def copy_handler(event):
            nb = Jupyter.notebook

            cells = nb.get_selected_cells()
            json = [cell.toJSON() for cell in cells]
            copy_config.set('cells', json)
            show_mssage("%d cells copied" % len(json))

        def paste_handler(event):
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

        def append_handler(event):
            nb = Jupyter.notebook
            
            def append_cells(cells_json):
                cells = nb.get_selected_cells()
                json = [cell.toJSON() for cell in cells]
                cells_json.extend(json)
                copy_config.set('cells', cells_json)
                show_mssage("%d cells appended, total %d cells" % (len(json), len(cells_json)))
                
            copy_config.get('cells').then(append_cells)
            
        actions = dict(
            select_section_cells = {
                'help': ' selected section cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-s',
                'handler': select_handler
            },
            copy_cells = {
                'help': ' copy selected  cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-c',
                'handler': copy_handler
            },
            paste_cells = {
                'help': ' paste cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-v',
                'handler': paste_handler
            },
            append_cells = {
                'help': ' append cells',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-a',
                'handler': append_handler
            }
        )
        
        km = Jupyter.keyboard_manager
        for key, action in actions.items():
            km.actions.register(action, key, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + key)
        
    return {"load_ipython_extension": main}

imports  = ['base/js/namespace',
        'services/config',
        'base/js/utils']

define(imports, load)
