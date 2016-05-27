imports = ['base/js/namespace',
           'base/js/dialog',
           'services/config',
           'base/js/utils']


def dummy_slices(n):
    slices = []
    for i in range(n):
        item = {
            "name": "name %d" % i,
            "group": "group %d" % (i % 10),
            "code": "print(%d)\nprint(%d + 1)" % (i, i)
        }
        slices.append(item)
    return slices

def T(tagname, *args):
    klass = None
    if '.' in tagname:
        tagname, klass = tagname.split('.')
    el = jQuery("<%s/>" % tagname)
    if klass is not None:
        el.addClass(klass)
    for child in args:
        el.append(child)
    return el

def load(Jupyter, dialog, configmod, utils):
    config = configmod.ConfigSection('scpy3_slices',
                                     {base_url: utils.get_body_data("baseUrl")});
    config.load()
    slice_config = configmod.ConfigWithDefaults(config, {'slices':{}})

    def show_dialog(title, body, open_callback=None, buttons=None):
        dialog_settings = {
            'notebook': Jupyter.notebook,
            'keyboard_manager': Jupyter.keyboard_manager,
            'title' : title,
            'body' : body,
        }

        if open_callback is not None:
            dialog_settings['open'] = open_callback

        if buttons is not None:
            buttons_setting = {}
            for button, callback in buttons:
                buttons_setting[button] = {
                    'class': 'btn-primary',
                    'click': callback
                }
            dialog_settings['buttons'] = buttons_setting
            
        dialog.modal(dialog_settings)
    
    def main():
        km = Jupyter.keyboard_manager

        def save_cell_as_slice():
            nb = Jupyter.notebook
            cell = nb.get_selected_cell()
            code = cell.get_text()
            
            def on_open():
                el_name.focus()

            def on_ok():
                text = el_name.val()
                if ":" in text:
                    group, name = text.split(':')
                else:
                    group = 'default'
                    name = text
                group = group.strip()
                name = name.strip()
                code = el_code.text()

                def add_slice(slices):
                    slices[group + ":" + name] = {'name':name,
                                                  'group':group,
                                                  'code':code}
                    slice_config.set('slices', slices)
                
                slice_config.get('slices').then(add_slice)
                
            el_name = T('input')
            el_code = T('pre').text(code)
            el_body = T('div', el_name, jQuery('<br/>'), el_code)
            show_dialog("Save as Slice", el_body, on_open, [['Ok', on_ok]])

        def load_slice():
            nb = Jupyter.notebook
            form = T('form')
            container = T('div.typeahead-container')
            field = T('div.typeahead-field')
            input_ = T('input').attr('type', 'search')
            search_button = T('button', T('span.typeahead-search-icon')).attr('type', 'submit')
            field.append(T('span.typeahead-query', input_))
            field.append(T('span.typeahead-button', search_button))
            
            container.append(field)
            form.append(container)

            mod = T('div.modal cmd-palette',
                    T('div.modal-dialog',
                      T('div.modal-content',
                        T('div.modal-body', form))))
            
            mod.modal({'show': False, 'backdrop': True})

            def on_show():
                def focus():
                    input_.focus()
                setTimeout(focus, 100)

            mod.on('show.bs.modal', on_show)

            nb.keyboard_manager.disable()

            def before_close():
                print("before_close")
                if before_close.ok:
                    return
                cell = nb.get_selected_cell()
                if cell:
                    cell.select()
                if nb.keyboard_manager:
                    nb.keyboard_manager.enable()
                    nb.keyboard_manager.command_mode()
                before_close.ok = True

            mod.on('hide.bs.modal', before_close)

            def on_submit(node, query, result, result_count):
                mod.modal('hide')
                cell = nb.get_selected_cell()
                if cell.cell_type != 'code':
                    cell = nb.insert_cell_below("code")
                code = cell.get_text()
                if not code.endswith('\n'):
                    code += '\n'
                cell.set_text(code + result.code)
                cell.select()
                
            def on_result(node, query, result, result_count):
                pass

            def on_mouse_enter(node, a, item, event):
                pre = jQuery('pre', a)
                pre.text(item.code)

            def on_mouse_leave(node, a, item, event):
                pre = jQuery('pre', a)
                pre.text(item.firstline)                

            def on_navigate_after(node, lis, a, item, query, event):
                console.log(node, lis, a, item, query, event)
                
            def show_search(slices):
                src = {}

                for item in slices.values():
                    group = item["group"]
                    if group not in src:
                        src[group] = {'data': [],
                                      'display': 'display'}
                    src[group]['data'].append({
                        'display': item.name,
                        'group': item.group,
                        'code': item.code,
                        'firstline': item.code.split('\n')[0]
                    })

                input_.typeahead({
                    'emptyTemplate': "No result",
                    'maxItem': 1000,
                    'minLength': 0,
                    'hint': True,
                    'group': ['group', '{{group}}'],
                    'searchOnFocus': True,
                    'mustSelectItem': True,
                    'template': '{{display}}<br/><pre>{{firstline}}</pre>',
                    'order': 'asc',
                    'source': src,
                    'callback': {
                        'onSubmit': on_submit,
                        'onClickAfter': on_submit,
                        'onResult': on_result,
                        'onMouseEnter': on_mouse_enter,
                        'onMouseLeave': on_mouse_leave,
                        'onNavigateAfter': on_navigate_after
                    },                
                    'debug': True
                })

                mod.modal('show')
            
            slice_config.get('slices').then(show_search)
            
        actions = dict(
            save_cell_as_slice = {
                'help': '',
                'icon': '',
                'key': 'Alt-i',
                handler: save_cell_as_slice
            },

            load_slice = {
                'help': '',
                'icon': '',
                'key': 'Alt-l',
                handler: load_slice
            }
        )

        for name, action in actions.items():
            km.actions.register(action, name, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + name)

    return {"load_ipython_extension": main}

define(imports, load)
