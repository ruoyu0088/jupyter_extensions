imports = ['base/js/namespace', 'base/js/events']

def load(Jupyter, events):
    header = jQuery('#header')
    header_elements = '#maintoolbar,#header-container,.header-bar,#menubar-container,#header'
    
    def maximize():
         if header['is'](':visible'):
            body = jQuery('body')
            notification = jQuery('#notification_area')
            notification.css({'position':'absolute', 'width':'500px', 'bottom':'0px'})
            notification.appendTo(body)
            info = jQuery('<div id="scpy3-maximize-info"></div>')
            info.css({'position':'absolute', 'width':'500px', 'bottom':'0px', 'right':'20px'})
            info.appendTo(body)
            jQuery('#kernel_indicator').appendTo(info)            
            jQuery('#readonly-indicator').appendTo(info)
            jQuery('#modal_indicator').appendTo(info)
            jQuery('#notebook').css({'padding-top':'0px'})
            jQuery(header_elements).hide()
            events.trigger('resize-header.Page')

    def normalize():
         if not header['is'](':visible'):
            notification = jQuery('#notification_area')
            notification.removeAttr('style')
            jQuery('#kernel_indicator').insertAfter(jQuery("button.navbar-toggle"))
            jQuery('#readonly-indicator').insertAfter(jQuery('#kernel_indicator'))
            jQuery('#modal_indicator').insertAfter(jQuery('#readonly-indicator'))            
            notification.insertAfter(jQuery('#modal_indicator'))
            jQuery('#scpy3-maximize-info').remove()
            jQuery('#notebook').removeAttr('style')
            jQuery(header_elements).show()
            events.trigger('resize-header.Page')

    def main():
        actions = dict(
            maximize = {
                'help': '',
                'icon': '',
                'key': 'Ctrl-up',
                handler: maximize
            },

            normalize = {
                'help': '',
                'icon': '',
                'key': 'Ctrl-down',
                handler: normalize
            }
        )
        
        km = Jupyter.keyboard_manager
        for name, action in actions.items():
            km.actions.register(action, name, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + name)


    return {"load_ipython_extension": main}

define(imports, load)
    

