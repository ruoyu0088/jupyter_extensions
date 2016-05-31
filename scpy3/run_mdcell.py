imports = ['base/js/namespace', 'require', 'base/js/events']

def load(Jupyter, require, events):
    from .utils import replace
    nb = Jupyter.notebook

    def run_md_cell():
        cell = nb.get_selected_cell()
        if cell.cell_type != 'markdown':
            return

        md_code = cell.get_text()
        pattern = RegExp('\\n<pre class="scpy3-output"><code>[\\s\\S]+</code></pre>')
        md_code = replace(md_code, pattern, '')
        console.log(md_code)
        outputs = []        

        def execute_reply_callback(msg):
            if msg.msg_type == 'execute_reply' and msg.content.status == 'ok':
                def do_output():
                    to_replace = '```python\n%s```' % src
                    output = '\n'.join(outputs)
                    target = '%s\n<pre class="scpy3-output"><code>%s</code></pre>' % (to_replace, output)
                    cell.set_text(md_code.replace(to_replace, target))
                    cell.render()
                window.setTimeout(do_output, 100)
                
        def output_callback(msg):
            if msg.msg_type == 'stream':
                outputs.append(msg.content.text)
            elif msg.msg_type == 'execute_result':
                if 'text/plain' in msg.content.data:
                    outputs.append(msg.content.data['text/plain'])

        callbacks = {
            'shell' : {
                'reply' : execute_reply_callback,
            },
            'iopub' : {
                'output' : output_callback,
            }
        }

        options = {'allow_stdin': False, 'silent': False}
        
        for code in cell.element.find("code.language-python").toArray():
            src = jQuery(code).text()
            outputs = []
            nb.kernel.execute(src, callbacks, options)
    
    def main():
        actions = dict(
            run_md_cell = {
                'help': 'run code in markdown cell',
                'icon': 'fa-recycle',
                'help_index': '',
                'key': 'Alt-r',
                'handler': run_md_cell
            },
        )
        
        km = Jupyter.keyboard_manager
        for key, action in actions.items():
            km.actions.register(action, key, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + key)
        
    
    return {"load_ipython_extension": main}

define(imports, load)
