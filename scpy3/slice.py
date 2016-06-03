imports = ['base/js/namespace',
           'base/js/dialog',
           'services/config',
           'base/js/utils',
           'require']


def load(Jupyter, dialog, configmod, utils, require):
    from .utils import T, typeahead_form, show_dialog, show_message, config_save

    config = configmod.ConfigSection('scpy3_slices',
                                     {base_url: utils.get_body_data("baseUrl")});
    config.load()
    slice_config = configmod.ConfigWithDefaults(config, {'slices':{}})
    
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
                    key = group + ":" + name
                    slices[key] = {'name':name,
                                                  'group':group,
                                                  'code':code}
                    slice_config.set('slices', slices)
                    show_message('slice %s added' % key, 2000)
                
                slice_config.get('slices').then(add_slice)
                
            el_name = T('input').attr('id', 'scpy3-slice-name')
            
            def on_key(event):
                if event.which == 13:
                    jQuery("#scpy3-slice-name").parents("div.modal-dialog").find("button.btn-default").click()
                    
            el_name.on('keypress', on_key)
            el_code = T('pre').text(code)
            el_body = T('div', el_name, jQuery('<br/>'), el_code)
            show_dialog("Save as Slice", el_body, on_open, [['Ok', on_ok]])

        def load_slice():
            typeahead = None
            nb = Jupyter.notebook

            mod, input_ = typeahead_form()
            input_.attr('id', 'scpy3-slice-typeahead')

            def on_key(event):
                console.log(event)
                if event.altKey == True and event.key == 'Delete':
                    items = typeahead.resultContainer.find("li:not(.typeahead-group)").toArray()
                    for i, item in enumerate(items):
                        if jQuery(item).hasClass('active'):
                            res = typeahead.result[i]
                            jQuery(item).fadeTo('fast', 0.4)
                            break
                    else:
                        return
                    key = res.group + ':' + res.display

                    def remove_slice(slices):
                        del config.data.slices[key]
                        config_save(config)
                        show_message('slice %s removed' % key, 2000)

                    slice_config.get('slices').then(remove_slice)
                    
                
            input_.on('keypress', on_key)

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
                nonlocal typeahead
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

                typeahead  = input_.typeahead({
                    'emptyTemplate': "No result",
                    'maxItem': 1000,
                    'minLength': 0,
                    'hint': True,
                    'group': ['group', '{{group}}'],
                    'searchOnFocus': True,
                    'mustSelectItem': True,
                    'template': '<strong>{{display}}</strong><br/><pre style="background-color: transparent;">{{firstline}}</pre>',
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
                    'debug': False
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
