imports = ['base/js/namespace',
           'base/js/dialog',
           'services/config',
           'base/js/utils',
           'components/marked/lib/marked'
]

def load(Jupyter, dialog, configmod, utils, marked):
    from .utils import register_actions, format_table
    
    def format_markdown_table(event):
        console.log(event)
        cm = Jupyter.notebook.get_selected_cell().code_mirror
        cursor = cm.getCursor()
        lineno = cursor.line
        line = cm.getLine(lineno)
        if line.strip() == '':
            return
        
        while True:
            lineno += 1
            line = cm.getLine(lineno)
            if line is None or line.strip() == '':
                line_end = lineno - 1
                break
            
        lineno = cursor.line
        while True:
            lineno -= 1
            line = cm.getLine(lineno)
            if line is None or line.strip() == '':
                line_start = lineno + 1
                break

        pos_start = {'line':line_start, 'ch':0}
        pos_end = {'line':line_end, 'ch':1000000}
        text = cm.getRange(pos_start, pos_end)

        table = format_table(text)
        cm.replaceRange(table, pos_start, pos_end)
        
    def main():
        actions = dict(
            format_markdown_table = {
                "help": 'format markdown table',
                "key": 'Alt-t',
                "handler": format_markdown_table
            }
        )

        register_actions(actions, "edit")

    return {"load_ipython_extension": main}

define(imports, load)



