def load_css(name):
    link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = require.toUrl(name)
    document.getElementsByTagName('head')[0].appendChild(link)

def unload_css(names):
    to_remove = []
    for el in document.getElementsByTagName('link').values():
        href = el.getAttribute('href')
        for name in names:
            if "scpy3" in href and name in href:
                to_remove.append(el)
                break
    for el in to_remove:
        el.parentNode.removeChild(el)

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

def is_head_cell(cell):
    return cell.cell_type == 'markdown' and cell.get_text().startswith('#')

def set_metadata(target, key, value):
    meta = target.metadata
    if 'scpy3' not in meta:
        meta.scpy3 = {}
    meta.scpy3[key] = value

def get_metadata(target, key):
    meta = target.metadata
    if 'scpy3' not in meta:
        return None
    if key not in meta.scpy3:
        return None
    return meta.scpy3[key]

def replace(src, pattern, target):
    """
    return String.prototype.replace.bind(src)(pattern, target)
    """

def get_level(cell):
    if cell.cell_type != "markdown":
        return 1000
    
    text = cell.get_text()
    if text.startswith("#"):
        level = len(text) - len(text.lstrip("#"))
        return level
    return 1000


def show_message(message, wait):
    notification_widget = Jupyter.notification_area.widget("notebook")            
    notification_widget.set_message(message, wait)


def typeahead_form():
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
    return mod, input_

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

def config_save(config):
    url = config.api_url()
    utils.promising_ajax(url, {
        'cache': False,
        'type': 'PUT',
        'data': JSON.stringify(config.data),
        'contentType': 'application/json'
    })
