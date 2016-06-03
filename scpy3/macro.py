#encoding=utf8
default_macros = {
    "1":"\u2776",
    "2":"\u2777",
    "3":"\u2778",
    "4":"\u2779",
    "5":"\u277a",
    "6":"\u277b",
    "7":"\u277c",
    "8":"\u277d",
    "9":"\u277e",
    "fig":'![](/files/images/.png "")',
    "next":'`ref:fig-next`',
    "prev":'`ref:fig-prev`',
    "tip":'> **TIP**\n\n> ',
    "source":'> **SOURCE**\n\n> ',
    "warning":'> **WARNING**\n\n> ',
    "question":'> **QUESTION**\n\n> ',
    "link":'> **LINK**\n\n> \n\n> ',        
 }

def macros_to_text(macros):
    return JSON.stringify(macros, None, 2)

def text_to_macros(text):
    return JSON.parse(text)
    
def load(Jupyter, dialog, configmod, utils):
    from .utils import register_actions
    
    base_url = utils.get_body_data("baseUrl")
    config = configmod.ConfigSection('scpy3_macros', {'base_url': base_url})
    config.load()
    macros_config = configmod.ConfigWithDefaults(config, {'macros':default_macros})

    def on_ok(text):
        macros = text_to_macros(text)
        macros_config.set('macros', macros)

    def show_macro_box(macros):
        title = 'Define Macros'
        info = 'Define Macros'

        el_dialog = jQuery('<div/>')
        el_info = jQuery('<p/>').text(info)
        el_br = jQuery('<br/>')
        css_textarea = {
            'font-size': '12px',
            'width': '90%',
            'font-family': 'monospace'
        }
        el_textarea = jQuery('<textarea/>').css(css_textarea).attr('rows', '10').val(macros_to_text(macros))
        el_dialog.append(el_info)
        el_dialog.append(el_br)
        el_dialog.append(el_textarea)

        def on_click():
            text = el_textarea.val()
            on_ok(text)

        def on_open():
            el_textarea.focus()

        settings = {
            'keyboard_manager': Jupyter.notebook.keyboard_manager,
            'title': title,
            'body': el_dialog,
            'buttons':{
                'ok': {
                    'class': 'btn-primary',
                    'click': on_click
                }
            },
            'open': on_open
        }
        dialog.modal(settings)

        
    def key_handler(event):

        cm = Jupyter.notebook.get_selected_cell().code_mirror
        cursor = cm.getCursor()
        line = cm.getLine(cursor.line)
        index = cursor.ch - 1

        def process(macros):
            index = cursor.ch - 1
            
            while index >= 0:
                if line[index] == "$":
                    cmd = line[index+1:cursor.ch]
                    info = {"line":cursor.line, "ch":index}
                    if cmd == "":
                        show_macro_box(macros)
                    elif cmd in macros:
                        cm.replaceRange(macros[cmd], info, cursor)
                    return
                index -= 1

            index = cursor.ch - 1
            while index >= 0:
                cmd = line[index:cursor.ch]
                if cmd in macros:
                    info = {"line":cursor.line, "ch":index}
                    cm.replaceRange(macros[cmd], info, cursor)
                    return
                index -= 1
            
        macros_config.get("macros").then(process)
        return True

    def main():
        actions = dict(
            expand_macro = {
                "help": 'expand macro',
                "key": 'Alt-m',
                "handler": lambda event: key_handler(Jupyter, event)
            }
        )

        register_actions(actions, "edit")

    return {"load_ipython_extension": main}

imports = ['base/js/namespace',
           'base/js/dialog',
           'services/config',
           'base/js/utils']

define(imports, load)
